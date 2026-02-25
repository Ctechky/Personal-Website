import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ResumeData, ChatMessage } from '../types';
import { CONFIG } from '../config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

// Model cascade: try primary first, fall back if unavailable
const MODEL_PRIMARY  = 'gemini-2.5-flash-lite';
const MODEL_FALLBACK = 'gemini-2.5-flash';

// Nav-aware smooth scroll — accounts for the sticky TopNav height.
// Exposed on window so inline onclick strings in dangerouslySetInnerHTML can call it.
if (typeof window !== 'undefined') {
    (window as any).__chatbotScrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const navEl = document.querySelector('.top-nav') as HTMLElement | null;
        const navHeight = navEl ? navEl.offsetHeight : 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
    };
}

// Function to convert markdown-like formatting to HTML
const formatChatbotResponse = (text: string): string => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

    // 1. Markdown links [label](url) — detect same-origin anchor vs external
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_match, label, url) => {
        try {
            const parsed = new URL(url);
            if (parsed.origin === currentOrigin && parsed.hash) {
                const id = parsed.hash.slice(1);
                return `<a href="${parsed.hash}" onclick="event.preventDefault();window.__chatbotScrollTo('${id}');" style="color: #3b82f6; text-decoration: underline;">${label}</a>`;
            }
        } catch {}
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${label}</a>`;
    });
    // 2. Markdown links [label](/#section) or [label](/path)
    text = text.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_match, label, path) => {
        const hash = path.startsWith('/#') ? path.slice(1) : path;
        if (hash.startsWith('#')) {
            const id = hash.slice(1);
            return `<a href="${hash}" onclick="event.preventDefault();window.__chatbotScrollTo('${id}');" style="color: #3b82f6; text-decoration: underline;">${label}</a>`;
        }
        return `<a href="${path}" style="color: #3b82f6; text-decoration: underline;">${label}</a>`;
    });
    // 3. Bare PDF links not already inside an anchor
    text = text.replace(/(?<!href=")(https?:\/\/[^\s<"]+\.pdf)/gi,
        `<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">Download (PDF)</a>`);
    // 4. Email addresses
    text = text.replace(/(?<!href="mailto:)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        `<a href="mailto:$1" style="color: #3b82f6; text-decoration: underline;">$1</a>`);
    // 5. LinkedIn URLs
    text = text.replace(/(?<!href=")(https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+)/g,
        `<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">$1</a>`);
    // 6. Telegram URLs
    text = text.replace(/(?<!href=")(https:\/\/t\.me\/[a-zA-Z0-9_]+)/g,
        `<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">$1</a>`);
    // 7. GitHub URLs
    text = text.replace(/(?<!href=")(https:\/\/github\.com\/[^\s<"]+)/g,
        `<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">$1</a>`);

    // ── Inline formatting ─────────────────────────────────────────────────
    // Bold: **text** or __text__
    text = text.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
    // Italic: *text* or _text_ (not touching already-replaced bold)
    text = text.replace(/(?<!\*)\*(?!\*)([^*\n]+)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    text = text.replace(/(?<!_)_(?!_)([^_\n]+)(?<!_)_(?!_)/g, '<em>$1</em>');
    // Inline code: `code`
    text = text.replace(/`([^`\n]+)`/g, '<code style="background:rgba(99,102,241,0.12);padding:1px 5px;border-radius:4px;font-size:0.9em;">$1</code>');

    // ── Lists ─────────────────────────────────────────────────────────────
    // Normalise all bullet styles (•, -, *) to a single marker before processing
    const lines = text.split('\n');
    let inUl = false;
    let inOl = false;
    let olCounter = 0;

    const processedLines = lines.map(line => {
        const trimmed = line.trim();

        // Unordered: •, -, * at line start
        const ulMatch = trimmed.match(/^([•\-\*])\s+(.+)/);
        if (ulMatch) {
            const content = ulMatch[2];
            if (inOl) { inOl = false; olCounter = 0; const close = `</ol><li>${content}</li>`; inUl = true; return close; }
            if (!inUl) { inUl = true; return `<ul><li>${content}</li>`; }
            return `<li>${content}</li>`;
        }

        // Ordered: 1. 2. etc.
        const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (olMatch) {
            const content = olMatch[2];
            if (inUl) { inUl = false; const close = `</ul><li>${content}</li>`; inOl = true; olCounter = 1; return close; }
            if (!inOl) { inOl = true; olCounter = 1; return `<ol><li>${content}</li>`; }
            olCounter++;
            return `<li>${content}</li>`;
        }

        // Close open lists on empty line or normal content
        if (inUl) { inUl = false; return trimmed === '' ? '</ul>' : `</ul>${line}`; }
        if (inOl) { inOl = false; olCounter = 0; return trimmed === '' ? '</ol>' : `</ol>${line}`; }

        return line;
    });

    if (inUl) processedLines.push('</ul>');
    if (inOl) processedLines.push('</ol>');

    text = processedLines.join('\n');

    // Convert remaining newlines to <br>, skip inside list tags
    text = text.replace(/\n(?!<\/?(li|ul|ol))/g, '<br>');

    return text;
};

// ─── Response cache ────────────────────────────────────────────────────────────
// Module-level (shared across renders, cleared on hard page refresh).
// Skips API calls for repeated or near-identical questions.
const responseCache = new Map<string, string>();

const normalizeQuery = (text: string): string =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');

// ─── Client-side rate limiter ──────────────────────────────────────────────────
// Keeps a rolling window of request timestamps. Blocks early at RPM_LIMIT
// to stay safely under the free-tier 15 RPM cap.
const RPM_LIMIT = 12;
const requestTimestamps: number[] = [];

const isRateLimited = (): boolean => {
    const now = Date.now();
    while (requestTimestamps.length && requestTimestamps[0] < now - 60_000)
        requestTimestamps.shift();
    return requestTimestamps.length >= RPM_LIMIT;
};

const recordRequest = () => requestTimestamps.push(Date.now());

const createSystemInstruction = (resume: ResumeData): string => {
    const cfg = CONFIG.chatbot;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // Full absolute URLs — used directly in markdown links the AI produces
    const resumeFullUrl      = `${origin}${resume.resumeUrl}`;
    const coverLetterFullUrl = `${origin}/General%20Cover%20letter.pdf`;

    // ── Education ──────────────────────────────────────────────────────────
    const educationSection = resume.education.map(e =>
        `  • ${e.degree} — ${e.institution} (${e.period})\n` +
        e.details.map(d => `    - ${d}`).join('\n')
    ).join('\n');

    // ── Experience ─────────────────────────────────────────────────────────
    const experienceSection = resume.experience.map(e =>
        `  • ${e.role} @ ${e.company} (${e.period})\n` +
        e.description.map(d => `    - ${d}`).join('\n')
    ).join('\n');

    // ── Leadership ─────────────────────────────────────────────────────────
    const leadershipSection = resume.leadership.map(l =>
        `  • ${l.role} @ ${l.organization} (${l.period})\n` +
        l.description.map(d => `    - ${d}`).join('\n')
    ).join('\n');

    // ── Projects ───────────────────────────────────────────────────────────
    const projectsSection = resume.projects.map(p =>
        `  • ${p.title}${p.period ? ` (${p.period})` : ''}${p.status ? ` [${p.status}]` : ''}\n` +
        (p.description ? `    ${p.description}` : '') +
        (p.link ? `\n    Link: ${p.link}` : '')
    ).join('\n');

    // ── Skills ─────────────────────────────────────────────────────────────
    const skillsSection = resume.skills.map(cat =>
        `  ${cat.title}:\n` +
        cat.skills.map(s => `    - ${s.name} (level ${s.level}/4)`).join('\n')
    ).join('\n');

    // ── Hobbies ────────────────────────────────────────────────────────────
    const hobbiesSection = resume.hobbies
        ? resume.hobbies.map(h => `  • ${h.name}${h.description ? `: ${h.description}` : ''}`).join('\n')
        : '  Not specified';

    // ── Website sections with full anchor links ────────────────────────────
    const websiteSections = Object.entries(CONFIG.content.sectionHeadings)
        .map(([id, label]) => `  • [${label}](${origin}/#${id})`)
        .join('\n');

    return `${cfg.personality.description.replace('{name}', resume.name)}

PERSONALITY & TONE:
${cfg.personality.traits.map(t => `- ${t}`).join('\n')}

RESPONSE FORMAT RULES:
${cfg.formatting.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CORE FOCUS: ${cfg.focus}

═══════════════════════════════════════════════
COMPLETE WEBSITE & PORTFOLIO KNOWLEDGE BASE
═══════════════════════════════════════════════

ABOUT ME:
${resume.about}

CONTACT:
  Email:    ${resume.contact.email}
  LinkedIn: ${resume.contact.linkedin || 'Not available'}
  GitHub:   ${resume.contact.github}
  Telegram: ${resume.contact.telegram || 'Not available'}

DOWNLOADS:
  Resume:       ${resumeFullUrl}
  Cover Letter: ${coverLetterFullUrl}

DOWNLOAD INSTRUCTIONS (CRITICAL):
- When someone asks for resume/CV: respond with "[Download my resume](${resumeFullUrl})"
- When someone asks for cover letter: respond with "[Download my cover letter](${coverLetterFullUrl})"
- If they ask for both: give both links on separate lines
- NEVER show raw file paths — always use markdown link syntax [label](url)

WEBSITE SECTIONS — when mentioning any section, link to it using markdown:
${websiteSections}
Example: instead of "check my experience section" say "[check my experience](${origin}/#experience)"

── EDUCATION ──────────────────────────────────
${educationSection}

── WORK EXPERIENCE ────────────────────────────
${experienceSection}

── LEADERSHIP & ACTIVITIES ────────────────────
${leadershipSection}

── PROJECTS ───────────────────────────────────
${projectsSection}

── SKILLS ─────────────────────────────────────
${skillsSection}

── HOBBIES & INTERESTS ────────────────────────
${hobbiesSection}

═══════════════════════════════════════════════

CONTACT REDIRECT (use when question is out of scope):
${cfg.contactRedirect}
  • Email: ${resume.contact.email}
  • LinkedIn: ${resume.contact.linkedin || 'Not available'}
  • Telegram: ${resume.contact.telegram || 'Not available'}

EXAMPLE RESPONSE — Skills:
${cfg.examples.skills.title}
${cfg.examples.skills.points.map(p => `• ${p}`).join('\n')}

EXAMPLE RESPONSE — Experience:
${cfg.examples.experience.title}
${cfg.examples.experience.points.map(p => `• ${p}`).join('\n')}`;
};

const INITIAL_SUGGESTIONS = CONFIG.chatbot.initialQuestions;

// ─── Follow-up question router ────────────────────────────────────────────────

const generateFollowUpQuestions = (lastUserMessage: string): string[] => {
    const msg = lastUserMessage.toLowerCase();
    const fu  = CONFIG.chatbot.followUpQuestions;
    if (msg.includes('semiconductor') || msg.includes('skyworks') || msg.includes('manufacturing')) return fu.semiconductor;
    if (msg.includes('skill')         || msg.includes('technical')  || msg.includes('programming'))  return fu.skills;
    if (msg.includes('project')       || msg.includes('github')     || msg.includes('built'))        return fu.projects;
    if (msg.includes('leadership')    || msg.includes('president')  || msg.includes('aiche'))        return fu.leadership;
    if (msg.includes('education')     || msg.includes('ntu')        || msg.includes('study') || msg.includes('degree')) return fu.education;
    if (msg.includes('experience')    || msg.includes('internship') || msg.includes('work')  || msg.includes('keppel')) return fu.experience;
    return fu.default;
};

/** Returns true when the error signals the model itself is unavailable (not an auth/quota issue). */
const isModelUnavailableError = (err: any): boolean => {
    const m: string = err?.message ?? '';
    return m.includes('404') || m.includes('not found') || (m.includes('model') && !m.includes('quota'));
};

// ─── useChatbot hook ──────────────────────────────────────────────────────────

interface UseChatbotReturn {
    messages:        ChatMessage[];
    isLoading:       boolean;
    input:           string;
    suggestions:     string[];
    showSuggestions: boolean;
    activeModel:     string | null;
    setInput:        React.Dispatch<React.SetStateAction<string>>;
    initialize:      () => void;
    sendMessage:     (text: string) => Promise<void>;
}

const useChatbot = (resumeData: ResumeData): UseChatbotReturn => {
    const [messages,        setMessages]        = useState<ChatMessage[]>([]);
    const [isLoading,       setIsLoading]       = useState(false);
    const [input,           setInput]           = useState('');
    const [suggestions,     setSuggestions]     = useState<string[]>(INITIAL_SUGGESTIONS);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [activeModel,     setActiveModel]     = useState<string | null>(null);

    const chatRef         = useRef<any>(null);
    const currentModelRef = useRef<string>(MODEL_PRIMARY);
    // Manually managed conversation history — lets us apply a sliding window
    // so the context sent per request stays small regardless of session length.
    const historyRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);
    const MAX_HISTORY_PAIRS = 5; // keep last 5 user+model pairs = 10 messages

    /** Create a fresh chat session for the given model using trimmed history. */
    const buildChat = useCallback((modelName: string, history: { role: string; parts: { text: string }[] }[] = []) => {
        const genAI = new GoogleGenerativeAI(VITE_API_KEY);
        // systemInstruction is the correct, token-efficient way to pass context.
        // It does NOT get included in the rolling chat history sent with each message.
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: createSystemInstruction(resumeData),
            generationConfig: { maxOutputTokens: 512 },
        });
        return model.startChat({ history });
    }, [resumeData]);

    /** Trim historyRef to MAX_HISTORY_PAIRS user+model pairs and rebuild the session. */
    const rebuildWithTrimmedHistory = useCallback((modelName: string) => {
        const h = historyRef.current;
        // Keep only the last MAX_HISTORY_PAIRS * 2 items (pairs of user+model)
        const trimmed = h.length > MAX_HISTORY_PAIRS * 2
            ? h.slice(h.length - MAX_HISTORY_PAIRS * 2)
            : h;
        historyRef.current = trimmed;
        chatRef.current = buildChat(modelName, trimmed);
    }, [buildChat]);

    /** Called once when the chatbot panel opens. */
    const initialize = useCallback(() => {
        historyRef.current = []; // fresh session — clear history
        if (!VITE_API_KEY) {
            setMessages([{ role: 'model', text: CONFIG.chatbot.fallbackGreeting.replace('{name}', resumeData.name) }]);
            return;
        }
        try {
            chatRef.current         = buildChat(MODEL_PRIMARY, []);
            currentModelRef.current = MODEL_PRIMARY;
            setActiveModel(MODEL_PRIMARY);
            setMessages([{ role: 'model', text: CONFIG.chatbot.greeting.replace('{name}', resumeData.name) }]);
        } catch (err: any) {
            console.error('Failed to initialise chatbot:', err);
            setMessages([{
                role: 'model',
                text: formatChatbotResponse(
                    `Hi! I'm ${resumeData.name}. The chatbot is currently unavailable.\n\n**Please contact me directly:**\n\n📧 Email: ${resumeData.contact.email}\n💼 LinkedIn: ${resumeData.contact.linkedin || ''}`
                ),
            }]);
        }
    }, [resumeData, buildChat]);

    /** Send a user message. Falls back to MODEL_FALLBACK if the primary model is unavailable. */
    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        // No API key – show contact info only
        if (!VITE_API_KEY || !chatRef.current) {
            const contact = formatChatbotResponse(
                `For detailed questions about ${resumeData.name}, please contact me directly:\n\n📧 ${resumeData.contact.email}` +
                (resumeData.contact.linkedin ? `\n💼 LinkedIn: ${resumeData.contact.linkedin}` : '') +
                (resumeData.contact.telegram ? `\n💬 Telegram: ${resumeData.contact.telegram}` : '')
            );
            setMessages(prev => [...prev, { role: 'user', text: messageText }, { role: 'model', text: contact }]);
            setSuggestions(generateFollowUpQuestions(messageText));
            setShowSuggestions(true);
            return;
        }

        // ── Cache hit: reply instantly without an API call ─────────────────
        const cacheKey = normalizeQuery(messageText);
        const cached   = responseCache.get(cacheKey);
        if (cached) {
            setMessages(prev => [...prev, { role: 'user', text: messageText }, { role: 'model', text: cached }]);
            setSuggestions(generateFollowUpQuestions(messageText));
            setShowSuggestions(true);
            return;
        }

        // ── Client-side rate guard ─────────────────────────────────────────
        if (isRateLimited()) {
            setMessages(prev => [...prev,
                { role: 'user', text: messageText },
                { role: 'model', text: "I've been chatting a lot in the last minute and hit the free-tier rate limit 😅 Give it about a minute and try again!" },
            ]);
            setSuggestions(generateFollowUpQuestions(messageText));
            setShowSuggestions(true);
            return;
        }

        setMessages(prev => [...prev, { role: 'user', text: messageText }]);
        setInput('');
        setIsLoading(true);
        setShowSuggestions(false);

        const trySend = async (allowFallback = true, retries429 = 1): Promise<void> => {
            try {
                recordRequest();
                const result    = await chatRef.current.sendMessage(messageText);
                const response  = await result.response;
                const formatted = formatChatbotResponse(response.text());

                // Record this exchange in our manual history
                historyRef.current.push(
                    { role: 'user',  parts: [{ text: messageText }] },
                    { role: 'model', parts: [{ text: response.text() }] },
                );

                // If history exceeds the window, rebuild session with trimmed context
                if (historyRef.current.length > MAX_HISTORY_PAIRS * 2) {
                    rebuildWithTrimmedHistory(currentModelRef.current);
                }

                // Store in cache for future identical/near-identical questions
                responseCache.set(cacheKey, formatted);
                setMessages(prev => [...prev, { role: 'model', text: formatted }]);
                setSuggestions(generateFollowUpQuestions(messageText));
                setShowSuggestions(true);
            } catch (err: any) {
                console.error(`Error with model ${currentModelRef.current}:`, err);
                const m = err?.message ?? '';

                // 429 / RESOURCE_EXHAUSTED: wait 10 s then retry once
                if (retries429 > 0 && (m.includes('429') || m.includes('RESOURCE_EXHAUSTED'))) {
                    console.warn('Rate limited by API — retrying in 10 s…');
                    setMessages(prev => [...prev, { role: 'model', text: '⏳ Hit the rate limit — retrying in 10 seconds…' }]);
                    await new Promise(res => setTimeout(res, 10_000));
                    setMessages(prev => prev.filter(msg => !msg.text.startsWith('⏳')));
                    await trySend(allowFallback, retries429 - 1);
                    return;
                }

                // Switch to fallback once if the primary model itself is the problem
                if (allowFallback && isModelUnavailableError(err) && currentModelRef.current === MODEL_PRIMARY) {
                    console.warn(`${MODEL_PRIMARY} unavailable — retrying with ${MODEL_FALLBACK}`);
                    try {
                        chatRef.current         = buildChat(MODEL_FALLBACK, historyRef.current);
                        currentModelRef.current = MODEL_FALLBACK;
                        setActiveModel(MODEL_FALLBACK);
                        await trySend(false, retries429);
                        return;
                    } catch (rebuildErr) {
                        console.error('Failed to build fallback model session:', rebuildErr);
                    }
                }

                // User-friendly error message
                const email    = resumeData.contact.email;
                const linkedin = resumeData.contact.linkedin || '';
                let errMsg = `❌ **Error Encountered**\n\nSorry, I encountered an error.\n\n**Please contact me directly:**\n\n📧 Email: ${email}\n💼 LinkedIn: ${linkedin}`;
                if (m.includes('API key not valid') || m.includes('API_KEY_INVALID')) {
                    errMsg = `❌ **API Key Error**\n\nThe chatbot API key is not configured correctly.\n\n**Please contact me directly:**\n\n📧 Email: ${email}\n💼 LinkedIn: ${linkedin}`;
                } else if (m.includes('quota') || m.includes('429') || m.includes('RESOURCE_EXHAUSTED')) {
                    errMsg = `The AI quota is exhausted for now. Try again in a few minutes, or reach me directly:\n\n📧 ${email}\n💼 LinkedIn: ${linkedin}`;
                }
                setMessages(prev => [...prev, { role: 'model', text: formatChatbotResponse(errMsg) }]);
                setShowSuggestions(true);
            }
        };

        await trySend();
        setIsLoading(false);
    }, [isLoading, resumeData, buildChat, rebuildWithTrimmedHistory]);

    return { messages, isLoading, input, suggestions, showSuggestions, activeModel, setInput, initialize, sendMessage };
};

// ─── Chatbot component ────────────────────────────────────────────────────────

interface ChatbotProps {
    resumeData: ResumeData;
    theme: 'light' | 'dark';
}

const Chatbot: React.FC<ChatbotProps> = ({ resumeData, theme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        messages, isLoading, input, suggestions, showSuggestions,
        setInput, initialize, sendMessage,
    } = useChatbot(resumeData);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Initialise once when the panel first opens
    useEffect(() => {
        if (isOpen && messages.length === 0) initialize();
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-scroll to latest message
    useEffect(() => {
        if (chatContainerRef.current)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    const handleSubmit = (e?: React.FormEvent, questionText?: string) => {
        if (e) e.preventDefault();
        sendMessage(questionText ?? input);
    };

    if (!isOpen) {
        return (
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(true)}
                aria-label="Open chatbot"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
        );
    }

    const headerLabel = VITE_API_KEY
        ? CONFIG.chatbot.headers.withApi
        : CONFIG.chatbot.headers.withoutApi;

    return (
        <div className="chatbot-container">
            <div className={`chatbot-window ${theme}-theme`}>

                {/* Header */}
                <div className="chatbot-header">
                    <h3>{headerLabel}</h3>
                    <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
                        ×
                    </button>
                </div>

                {/* Messages */}
                <div className="chatbot-messages" ref={chatContainerRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chatbot-message ${msg.role}`}>
                            <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chatbot-message model">
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span/><span/><span/>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Suggested questions */}
                    {showSuggestions && messages.length > 0 && !isLoading && VITE_API_KEY && (
                        <div className="chatbot-suggestions">
                            <p className="suggestions-title">
                                {messages.length === 1
                                    ? CONFIG.chatbot.suggestions.initial
                                    : CONFIG.chatbot.suggestions.followUp}
                            </p>
                            <div className="suggestions-bubbles">
                                {suggestions.map((q, idx) => (
                                    <button
                                        key={`${q}-${idx}`}
                                        className="suggestion-bubble"
                                        onClick={() => handleSubmit(undefined, q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="chatbot-input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={VITE_API_KEY ? CONFIG.chatbot.placeholders.input : CONFIG.chatbot.placeholders.contactInput}
                        disabled={isLoading}
                        className="chatbot-input"
                    />
                    <button type="submit" disabled={!input.trim() || isLoading} className="chatbot-send">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                        </svg>
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Chatbot;