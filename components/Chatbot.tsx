import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ResumeData, ChatMessage } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

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
        if (isOpen && !chatRef.current && !error) {
            try {
                if (!API_KEY) {
                    throw new Error("API key is not configured.");
                }
                const ai = new GoogleGenAI({ apiKey: API_KEY });
                const systemInstruction = createSystemInstruction(resumeData);
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-pro',
                    config: { systemInstruction },
                });
                chatRef.current = newChat;
                setMessages([{ 
                    role: 'model', 
                    text: `Hello! I'm an AI assistant. How can I help you learn more about ${resumeData.name}'s background and experience?` 
                }]);
            } catch (err: any) {
                console.error("Failed to initialize chatbot:", err);
                const friendlyError = "Could not connect to the AI assistant. Please ensure the VITE_API_KEY is configured correctly.";
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
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chat.sendMessage({ message: input });
            const text = result.text;
            if (text) {
                setMessages(prev => [...prev, { role: 'model', text }]);
            } else {
                throw new Error("Received an empty response from the API.");
            }
        } catch (err) {
            console.error("Gemini API error:", err);
            const errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChatbot = () => setIsOpen(!isOpen);

    return (
        <>
            <button onClick={toggleChatbot} className="chatbot-toggle" aria-label="Toggle Chatbot">
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h2>Chat with AI Assistant</h2>
                    </div>
                    <div ref={chatContainerRef} className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chatbot-message ${msg.role}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chatbot-loading">
                                <div className="chatbot-loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="chatbot-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={error ? "Chat is disabled" : "Ask about my experience..."}
                            disabled={isLoading || !!error}
                            aria-label="Chat input"
                            className="chatbot-input"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim() || !!error} 
                            aria-label="Send message" 
                            className="chatbot-submit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
