import React, { useState, useRef, useEffect } from 'react';
import type { ResumeData, ChatMessage } from '../types';

// Check if Gemini is available
const API_KEY = import.meta.env.VITE_API_KEY;
const isGeminiAvailable = API_KEY && typeof window !== 'undefined';

// Dynamic import for Gemini (only when needed)
let GoogleGenAI: any = null;
let Chat: any = null;

if (isGeminiAvailable) {
  try {
    // This will only work in local development with proper API key
    const genai = require('@google/genai');
    GoogleGenAI = genai.GoogleGenAI;
    Chat = genai.Chat;
  } catch (error) {
    console.warn('Google GenAI not available:', error);
  }
}

const createSystemInstruction = (resume: ResumeData): string => {
    return `You are a helpful and friendly chatbot assistant for ${resume.name}'s personal portfolio website.
Your goal is to answer questions about ${resume.name} based on their resume and professional background.
Be professional, concise, and helpful. If a question is outside the scope of the provided resume data, politely decline to answer.

Here is the resume data:
${JSON.stringify(resume, null, 2)}`;
};

const Chatbot: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0 && !error) {
            if (!isGeminiAvailable || !GoogleGenAI) {
                // Fallback when Gemini is not available
                setMessages([{ 
                    role: 'model', 
                    text: `Hi! I'm ${resumeData.name}. For questions about my background, experience, and projects, please contact me directly.` 
                }]);
                return;
            }

            try {
                const genAI = new GoogleGenAI(API_KEY);
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
                setMessages([{ 
                    role: 'model', 
                    text: `Hello! I'm an AI assistant. How can I help you learn more about ${resumeData.name}'s background and experience?` 
                }]);
            } catch (err: any) {
                console.error("Failed to initialize chatbot:", err);
                const friendlyError = "AI assistant is currently unavailable. Please contact me directly!";
                setError(friendlyError);
                setMessages([{ role: 'model', text: friendlyError }]);
            }
        }
    }, [isOpen, resumeData, error]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const chat = chatRef.current;
        if (!input.trim() || isLoading) return;

        // If Gemini is not available, show contact info
        if (!isGeminiAvailable || !chat) {
            setMessages(prev => [...prev, 
                { role: 'user', text: input },
                { role: 'model', text: `For detailed questions about ${resumeData.name}, please contact me directly:\n\n📧 ${resumeData.contact.email}\n💼 LinkedIn: ${resumeData.contact.linkedin || 'Not available'}` }
            ]);
            setInput('');
            return;
        }

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chat.sendMessage(input);
            const response = await result.response;
            const responseText = response.text();

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
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
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <h3>{isGeminiAvailable ? 'Ask me anything!' : 'Contact Me'}</h3>
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
                            <div className="message-content">
                                {message.text}
                            </div>
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
                </div>
                
                <form onSubmit={handleSendMessage} className="chatbot-input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isGeminiAvailable ? "Ask about my experience..." : "Contact me directly..."}
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