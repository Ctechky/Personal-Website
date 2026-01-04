import React, { useState, useRef, useEffect } from 'react';
import type { ResumeData, ChatMessage } from '../types';
import { CONFIG } from '../config';

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

// Import Gemini directly (works in both environments)
import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to convert markdown-like formatting to HTML
const formatChatbotResponse = (text: string): string => {
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
    const chatbotConfig = CONFIG.chatbot;
    
    return `${chatbotConfig.personality.description.replace('{name}', resume.name)}

PERSONALITY & TONE:
${chatbotConfig.personality.traits.map(trait => `- ${trait}`).join('\n')}

CRITICAL RESPONSE FORMAT RULES (MUST FOLLOW EXACTLY):
${chatbotConfig.formatting.rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

MANDATORY FORMAT STRUCTURE:
${chatbotConfig.formatting.structure.categoryTitle}

${chatbotConfig.formatting.structure.bulletPoint}
• Second bullet point with metrics/details
• Third bullet point if needed

${chatbotConfig.formatting.structure.nextCategory}

• Bullet point with information
• Another bullet point

EXAMPLE - Skills Question (with enthusiastic tone):
${chatbotConfig.examples.skills.title}

${chatbotConfig.examples.skills.points.map(point => `• ${point}`).join('\n')}

**💡 Data Analytics & Machine Learning Innovation**

• Revolutionary Predictive Analytics & ML (PyTorch, Scikit-Learn)
• Advanced Statistical Analysis, Data Mining & Intelligent Text Analytics
• Dynamic Power BI Dashboards & Real-time Data Visualization
• Automated Process Optimization & Smart Manufacturing Solutions

**⚡ Programming & Advanced Tools**

• Python, SQL, MATLAB, JavaScript, TypeScript
• SQLite, MySQL, Django ORM
• Microsoft Power Platform (Automate, Apps)

EXAMPLE - Experience Question (with passionate tone):
${chatbotConfig.examples.experience.title}

${chatbotConfig.examples.experience.points.map(point => `• ${point}`).join('\n')}

**🎯 Key Innovation Drivers**

• Advanced Analytics, Machine Learning, Power BI
• Python, Azure, Process Automation

SEMICONDUCTOR FOCUS: ${chatbotConfig.focus}

IMPORTANT: If a question is outside the scope of the provided resume data, enthusiastically redirect to semiconductor-related topics and suggest they contact ${resume.name} directly:

${chatbotConfig.contactRedirect}

• Email: ${resume.contact.email}
• LinkedIn: ${resume.contact.linkedin || 'Not available'}
• Telegram: ${resume.contact.telegram || 'Not available'}

Here is the resume data:
${JSON.stringify(resume, null, 2)}`;
};

// Initial suggested questions
const INITIAL_SUGGESTIONS = CONFIG.chatbot.initialQuestions;

// Function to generate dynamic follow-up questions based on conversation context
const generateFollowUpQuestions = (lastUserMessage: string): string[] => {
    const msg = lastUserMessage.toLowerCase();
    const followUps = CONFIG.chatbot.followUpQuestions;
    
    // Semiconductor/Manufacturing related
    if (msg.includes('semiconductor') || msg.includes('skyworks') || msg.includes('manufacturing')) {
        return followUps.semiconductor;
    }
    
    // Skills related
    if (msg.includes('skill') || msg.includes('technical') || msg.includes('programming')) {
        return followUps.skills;
    }
    
    // Projects related
    if (msg.includes('project') || msg.includes('github') || msg.includes('built')) {
        return followUps.projects;
    }
    
    // Leadership related
    if (msg.includes('leadership') || msg.includes('president') || msg.includes('aiche')) {
        return followUps.leadership;
    }
    
    // Education related
    if (msg.includes('education') || msg.includes('ntu') || msg.includes('study') || msg.includes('degree')) {
        return followUps.education;
    }
    
    // Experience related
    if (msg.includes('experience') || msg.includes('internship') || msg.includes('work') || msg.includes('keppel')) {
        return followUps.experience;
    }
    
    // Default follow-ups for general questions
    return followUps.default;
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
                    text: CONFIG.chatbot.fallbackGreeting.replace('{name}', resumeData.name)
                }]);
                return;
            }

            console.log("Initializing Gemini AI...");
            try {
                const genAI = new GoogleGenerativeAI(VITE_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                
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
                    text: CONFIG.chatbot.greeting.replace('{name}', resumeData.name)
                }]);
            } catch (err: any) {
                console.error("Failed to initialize chatbot:", err);
                setMessages([{ 
                    role: 'model', 
                    text: CONFIG.chatbot.fallbackGreeting.replace('{name}', resumeData.name)
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
            const contactFallback = CONFIG.chatbot.contactFallback
                .replace('{name}', resumeData.name)
                .replace('{email}', resumeData.contact.email)
                .replace('{linkedin}', resumeData.contact.linkedin || 'Not available')
                .replace('{telegram}', resumeData.contact.telegram || 'Not available');
            
            setMessages(prev => [...prev, 
                { role: 'user', text: messageText },
                { role: 'model', text: contactFallback }
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
            const formattedResponse = formatChatbotResponse(responseText);
            setMessages(prev => [...prev, { role: 'model', text: formattedResponse }]);
            
            // Generate dynamic follow-up suggestions based on user's question
            const followUps = generateFollowUpQuestions(messageText);
            setSuggestions(followUps);
            setShowSuggestions(true);
        } catch (error: any) {
            console.error('Error sending message:', error);
            
            // Extract error message from the error object
            let errorMessage = CONFIG.chatbot.errorMessage;
            
            if (error?.message) {
                // Check for API key errors
                if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
                    errorMessage = `❌ **API Key Error**\n\nYour Gemini API key is not valid. Please check your .env file and ensure you have a valid API key from Google AI Studio.\n\nGet your API key: https://aistudio.google.com/app/apikey`;
                } else if (error.message.includes('quota') || error.message.includes('429')) {
                    errorMessage = `❌ **Quota Exceeded**\n\nYour API quota has been exceeded. Please check your Google AI Studio account.`;
                } else if (error.message.includes('model') || error.message.includes('404')) {
                    errorMessage = `❌ **Model Error**\n\nThe AI model is not available. Error: ${error.message}`;
                } else {
                    errorMessage = `❌ **Error**\n\n${error.message}\n\nPlease check your API key or try again later.`;
                }
            }
            
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: errorMessage
            }]);
            setShowSuggestions(true);
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
                    <h3>{VITE_API_KEY ? CONFIG.chatbot.headers.withApi : CONFIG.chatbot.headers.withoutApi}</h3>
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
                                {messages.length === 1 ? CONFIG.chatbot.suggestions.initial : CONFIG.chatbot.suggestions.followUp}
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
                        placeholder={VITE_API_KEY ? CONFIG.chatbot.placeholders.input : CONFIG.chatbot.placeholders.contactInput}
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