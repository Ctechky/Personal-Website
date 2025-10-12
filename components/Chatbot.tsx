import React, { useState, useRef, useEffect } from 'react';
import type { ResumeData, ChatMessage } from '../types';

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

// Import Gemini directly (works in both environments)
import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to convert markdown-like formatting to HTML
const formatChatbotResponse = (text: string, resumeData: ResumeData): string => {
    // First, process contact links
    text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, 
        `<a href="mailto:$1" style="color: #3b82f6; text-decoration: underline;">$1</a>`);
    
    text = text.replace(/(https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+)/g, 
        `<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">$1</a>`);
    
    text = text.replace(/(https:\/\/t\.me\/[a-zA-Z0-9_]+)/g, 
        `<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">$1</a>`);
    
    // Convert **bold** markdown to HTML
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points with proper spacing
    // Replace • bullets with HTML list items
    const lines = text.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        
        // Check if line starts with bullet
        if (trimmedLine.startsWith('•')) {
            const content = trimmedLine.substring(1).trim();
            if (!inList) {
                inList = true;
                return `<ul><li>${content}</li>`;
            }
            return `<li>${content}</li>`;
        } else if (inList && trimmedLine !== '') {
            // Close list if we hit non-bullet content
            inList = false;
            return `</ul>${line}`;
        } else if (inList && trimmedLine === '') {
            // Close list on empty line
            inList = false;
            return '</ul><br>';
        }
        
        return line;
    });
    
    // Close any remaining open list
    if (inList) {
        processedLines.push('</ul>');
    }
    
    text = processedLines.join('\n');
    
    // Convert line breaks to <br> for better spacing (but not inside lists)
    text = text.replace(/\n(?!<li>|<ul>|<\/ul>)/g, '<br>');
    
    return text;
};

const createSystemInstruction = (resume: ResumeData): string => {
    return `You are a helpful and friendly chatbot assistant for ${resume.name}'s personal portfolio website.
Your goal is to answer questions about ${resume.name} based on their resume and professional background.

CRITICAL RESPONSE FORMAT RULES (MUST FOLLOW EXACTLY):
1. ALWAYS use markdown formatting with proper line breaks
2. Use **bold headings** followed by a blank line
3. Use bullet points (•) with proper spacing
4. Add blank lines between sections for readability
5. Keep responses concise - maximum 1-2 lines per bullet point
6. Highlight numbers and metrics prominently

MANDATORY FORMAT STRUCTURE:
**Category Title**

• First bullet point with key information
• Second bullet point with metrics/details
• Third bullet point if needed

**Next Category**

• Bullet point with information
• Another bullet point

EXAMPLE - Skills Question:
**Process Engineering**

• Semiconductor Manufacturing & Wafer Fabrication
• Lithography Process Optimization & Root Cause Analysis
• Quality Management Systems & Process Control
• SEM Microscopy

**Data Analytics & Machine Learning**

• Predictive Analytics & ML (PyTorch, Scikit-Learn)
• Statistical Analysis, Data Mining & Text Analytics
• Power BI Dashboards & Data Visualization

**Programming & Tools**

• Python, SQL, MATLAB, JavaScript, TypeScript
• SQLite, MySQL, Django ORM
• Microsoft Power Platform (Automate, Apps)

EXAMPLE - Experience Question:
**Skyworks Solutions Inc. (Dec 2024 - May 2025)**

• Applied ML (Random Forest) for semiconductor defect analysis
• Built Power BI dashboards detecting 100+ issues, saving $300K
• Automated quality reviews achieving 95% closure rate
• Optimized workflows cutting data entry errors by 15%

**Key Skills Used**

• Advanced Analytics, Machine Learning, Power BI
• Python, Azure, Process Automation

IMPORTANT: If a question is outside the scope of the provided resume data, politely decline and suggest they contact ${resume.name} directly:

**Contact Information**

• Email: ${resume.contact.email}
• LinkedIn: ${resume.contact.linkedin || 'Not available'}
• Telegram: ${resume.contact.telegram || 'Not available'}

Here is the resume data:
${JSON.stringify(resume, null, 2)}`;
};

// Initial suggested questions
const INITIAL_SUGGESTIONS = [
    "What are your key technical skills?",
    "Tell me about your semiconductor experience",
    "What projects have you worked on?",
    "What leadership roles have you held?",
    "What's your educational background?"
];

// Function to generate dynamic follow-up questions based on conversation context
const generateFollowUpQuestions = (lastUserMessage: string): string[] => {
    const msg = lastUserMessage.toLowerCase();
    
    // Semiconductor/Manufacturing related
    if (msg.includes('semiconductor') || msg.includes('skyworks') || msg.includes('manufacturing')) {
        return [
            "What specific tools did you use for semiconductor analysis?",
            "Tell me about your lithography research",
            "What were the key results from your URECA project?"
        ];
    }
    
    // Skills related
    if (msg.includes('skill') || msg.includes('technical') || msg.includes('programming')) {
        return [
            "What data analytics tools are you proficient in?",
            "Tell me about your machine learning experience",
            "What process engineering software do you use?"
        ];
    }
    
    // Projects related
    if (msg.includes('project') || msg.includes('github') || msg.includes('built')) {
        return [
            "What was your most challenging project?",
            "Tell me about your floor plan generator",
            "What technologies did you use in your projects?"
        ];
    }
    
    // Leadership related
    if (msg.includes('leadership') || msg.includes('president') || msg.includes('aiche')) {
        return [
            "What initiatives did you lead at AIChE?",
            "Tell me about your experience managing teams",
            "What was your impact as VP of Analytics Club?"
        ];
    }
    
    // Education related
    if (msg.includes('education') || msg.includes('ntu') || msg.includes('study') || msg.includes('degree')) {
        return [
            "What are your key specializations?",
            "Tell me about your academic achievements",
            "What relevant coursework have you completed?"
        ];
    }
    
    // Experience related
    if (msg.includes('experience') || msg.includes('internship') || msg.includes('work') || msg.includes('keppel')) {
        return [
            "What did you accomplish at Keppel?",
            "Tell me about your impact at Skyworks",
            "What process improvements did you implement?"
        ];
    }
    
    // Default follow-ups for general questions
    return [
        "What are your career goals?",
        "Tell me about your key achievements",
        "What makes you stand out as a candidate?"
    ];
};

const Chatbot: React.FC<{ resumeData: ResumeData; theme: 'light' | 'dark' }> = ({ resumeData, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const chatRef = useRef<any>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            console.log("VITE_API_KEY:", VITE_API_KEY ? "Found" : "Not found");
            
            if (!VITE_API_KEY) {
                console.log("No API key, showing fallback");
                setMessages([{ 
                    role: 'model', 
                    text: `Hi! I'm ${resumeData.name}. For questions about my background, experience, and projects, please contact me directly.` 
                }]);
                return;
            }

            console.log("Initializing Gemini AI...");
            try {
                const genAI = new GoogleGenerativeAI(VITE_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
                
                const systemInstruction = createSystemInstruction(resumeData);
                
                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemInstruction }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "I understand. I'll help answer questions about the portfolio owner based on their resume data." }],
                        },
                    ],
                });
                
                chatRef.current = chat;
                console.log("Gemini AI initialized successfully");
                setMessages([{ 
                    role: 'model', 
                    text: `Hello! I'm an AI assistant. How can I help you learn more about ${resumeData.name}'s background and experience?` 
                }]);
            } catch (err: any) {
                console.error("Failed to initialize chatbot:", err);
                setMessages([{ 
                    role: 'model', 
                    text: `Hi! I'm ${resumeData.name}. For questions about my background, experience, and projects, please contact me directly.` 
                }]);
            }
        }
    }, [isOpen, resumeData]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent, questionText?: string) => {
        if (e) e.preventDefault();
        const chat = chatRef.current;
        const messageText = questionText || input;
        
        if (!messageText.trim() || isLoading) return;

        // If no API key or chat not initialized, show contact info
        if (!VITE_API_KEY || !chat) {
            setMessages(prev => [...prev, 
                { role: 'user', text: messageText },
                { role: 'model', text: `For detailed questions about ${resumeData.name}, please contact me directly:\n\n📧 ${resumeData.contact.email}\n💼 LinkedIn: ${resumeData.contact.linkedin || 'Not available'}\n💬 Telegram: ${resumeData.contact.telegram || 'Not available'}` }
            ]);
            setInput('');
            // Generate follow-up suggestions even without API
            const followUps = generateFollowUpQuestions(messageText);
            setSuggestions(followUps);
            setShowSuggestions(true);
            return;
        }

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        // Hide suggestions while loading
        setShowSuggestions(false);

        try {
            const result = await chat.sendMessage(messageText);
            const response = await result.response;
            const responseText = response.text();

            // Format response with markdown and links
            const formattedResponse = formatChatbotResponse(responseText, resumeData);
            setMessages(prev => [...prev, { role: 'model', text: formattedResponse }]);
            
            // Generate dynamic follow-up suggestions based on user's question
            const followUps = generateFollowUpQuestions(messageText);
            setSuggestions(followUps);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: 'Sorry, I encountered an error. Please contact me directly via email or LinkedIn!' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (question: string) => {
        handleSendMessage(undefined, question);
    };

    if (!isOpen) {
        return (
            <button 
                className="chatbot-toggle"
                onClick={() => setIsOpen(true)}
                aria-label="Open chatbot"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
        );
    }

    return (
        <div className="chatbot-container">
            <div className={`chatbot-window ${theme}-theme`}>
                <div className="chatbot-header">
                    <h3>{VITE_API_KEY ? 'Ask me anything!' : 'Contact Me'}</h3>
                    <button 
                        className="chatbot-close" 
                        onClick={() => setIsOpen(false)}
                        aria-label="Close chatbot"
                    >
                        ×
                    </button>
                </div>
                
                <div className="chatbot-messages" ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`chatbot-message ${message.role}`}>
                            <div 
                                className="message-content"
                                dangerouslySetInnerHTML={{ __html: message.text }}
                            />
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chatbot-message model">
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Dynamic suggested questions that update based on conversation */}
                    {showSuggestions && messages.length > 0 && !isLoading && VITE_API_KEY && (
                        <div className="chatbot-suggestions">
                            <p className="suggestions-title">
                                {messages.length === 1 ? 'Quick questions:' : 'You might also ask:'}
                            </p>
                            <div className="suggestions-bubbles">
                                {suggestions.map((question, index) => (
                                    <button
                                        key={`${question}-${index}`}
                                        className="suggestion-bubble"
                                        onClick={() => handleSuggestionClick(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <form onSubmit={handleSendMessage} className="chatbot-input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={VITE_API_KEY ? "Ask about my experience..." : "Contact me directly..."}
                        disabled={isLoading}
                        className="chatbot-input"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="chatbot-send"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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