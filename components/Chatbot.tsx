import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ResumeData, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

const createSystemInstruction = (resume: ResumeData): string => {
    const fullResumeContext = JSON.stringify(resume, null, 2);
    return `You are a helpful and friendly chatbot assistant for ${resume.name}'s personal portfolio website.
Your goal is to answer questions about ${resume.name} based on his resume.
Be professional, concise, and helpful. If a question is outside the scope of the provided resume data, politely decline to answer.
Here is the resume data in JSON format for your reference:
${fullResumeContext}
`;
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
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
                chatRef.current = newChat;
                setMessages([{ role: 'model', text: `Hello! I'm an AI assistant. How can I help you with ${resumeData.name}'s profile today?` }]);
            } catch (err: any) {
                console.error("Failed to initialize chatbot:", err);
                const friendlyError = "Could not connect to the AI assistant. Please ensure the VITE_API_KEY is configured correctly in the Vercel project settings.";
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
            <button onClick={toggleChatbot} style={{position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'transform 0.2s ease-in-out'}} aria-label="Toggle Chatbot">
                 {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </button>

            {isOpen && (
                <div style={{position: 'fixed', bottom: '7rem', right: '2rem', width: 'clamp(300px, 90vw, 400px)', height: '60vh', backgroundColor: 'var(--surface-color)', borderRadius: '0.75rem', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)'}}>
                    <div style={{padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h2 style={{fontSize: '1.1rem', color: 'var(--text-lightest)'}}>Chat with my AI Assistant</h2>
                    </div>
                    <div ref={chatContainerRef} style={{flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                                <p style={{backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--surface-light)', color: 'var(--text-lightest)', padding: '0.75rem 1rem', borderRadius: '1.25rem', maxWidth: '85%'}}>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && (
                             <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                                <div style={{backgroundColor: 'var(--surface-light)', borderRadius: '1.25rem', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem'}}>
                                    <span style={{width: '8px', height: '8px', backgroundColor: 'var(--text-dark)', borderRadius: '50%', animation: 'pulse 1.4s infinite ease-in-out both'}}></span>
                                    <span style={{width: '8px', height: '8px', backgroundColor: 'var(--text-dark)', borderRadius: '50%', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0.2s'}}></span>
                                    <span style={{width: '8px', height: '8px', backgroundColor: 'var(--text-dark)', borderRadius: '50%', animation: 'pulse 1.4s infinite ease-in-out both', animationDelay: '0.4s'}}></span>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} style={{padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem'}}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={error ? "Chat is disabled" : "Ask about my experience..."}
                            disabled={isLoading || !!error}
                            aria-label="Chat input"
                            style={{flexGrow: 1, padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-light)', color: 'var(--text-light)', fontSize: '1rem'}}
                        />
                        <button type="submit" disabled={isLoading || !input.trim() || !!error} aria-label="Send message" style={{padding: '0.75rem', backgroundColor: 'var(--accent-primary)', border: 'none', borderRadius: '0.375rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
