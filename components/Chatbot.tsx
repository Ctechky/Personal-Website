import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import type { ResumeData, ChatMessage } from '../types';

// NOTE: These styles are now in index.html, but I'll add some inline styles for dynamic parts.
const chatbotButtonOpen: React.CSSProperties = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  backgroundColor: '#f97316', // accent-primary
  color: 'white',
  borderRadius: '9999px',
  padding: '1rem',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)',
  transform: 'scale(1)',
  transition: 'all 0.3s',
  zIndex: 50,
  border: 'none',
  cursor: 'pointer',
};

const chatbotContainer: React.CSSProperties = {
  position: 'fixed',
  bottom: '6rem',
  right: '1.5rem',
  width: '100%',
  maxWidth: '24rem',
  height: '60vh',
  backgroundColor: '#1a1a1a', // surface-color
  borderRadius: '0.75rem',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 40,
  fontSize: '0.875rem',
  border: '1px solid #2c2c2c', // border-color
  color: '#d4d4d4', // text-light
};

const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


const Chatbot: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const initializeChat = useCallback(() => {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            setMessages([{ role: 'model', text: "I'm sorry, the chatbot is not configured correctly. An API key is missing." }]);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `You are a helpful and friendly AI assistant for ${resumeData.name}'s portfolio website. Your goal is to answer questions from potential recruiters about ${resumeData.name}'s skills, projects, and experience. Use the following resume data to answer questions. Be professional and concise. Here is the resume data in JSON format: ${JSON.stringify(resumeData)}`;
        
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        chatRef.current = chat;
        setMessages([{ role: 'model', text: `Hi! I'm an AI assistant. How can I help you with ${resumeData.name}'s portfolio?` }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeData]);

    useEffect(() => {
        if (isOpen) {
           initializeChat();
        } else {
            setMessages([]);
            chatRef.current = null;
        }
    }, [isOpen, initializeChat]);


    const handleSend = async () => {
        if (!input.trim() || isLoading || !chatRef.current) return;
        
        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessageStream({ message: input });
            let text = '';
            for await (const chunk of response) {
                text += chunk.text;
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = { ...lastMessage, text };
                        return newMessages;
                    }
                    return [...prev, { role: 'model', text }];
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonStyle = {
      ...chatbotButtonOpen,
      backgroundColor: isHovered ? '#fb923c' : '#f97316', // Lighter orange on hover
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={buttonStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <CloseIcon /> : <ChatbotIcon />}
            </button>

            {isOpen && (
                <div style={chatbotContainer}>
                    <header style={{ backgroundColor: 'rgba(44, 44, 44, 0.5)', padding: '1rem', borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem', borderBottom: '1px solid #2c2c2c' }}>
                        <h3 style={{ fontWeight: 700, color: '#f5f5f5', fontSize: '1.125rem' }}>AI Assistant</h3>
                        <p style={{ color: '#a3a3a3', fontSize: '0.75rem' }}>Ask me about {resumeData.name}'s experience!</p>
                    </header>
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ maxWidth: '80%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: msg.role === 'user' ? '#f97316' : '#2c2c2c', color: msg.role === 'user' ? '#fff' : '#f5f5f5' }}>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{ backgroundColor: '#2c2c2c', color: '#f5f5f5', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: '#a3a3a3', borderRadius: '9999px', animation: 'pulse 1.5s infinite 0.075s' }}></span>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: '#a3a3a3', borderRadius: '9999px', animation: 'pulse 1.5s infinite 0.15s' }}></span>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: '#a3a3a3', borderRadius: '9999px', animation: 'pulse 1.5s infinite 0.3s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid #2c2c2c', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(26, 26, 26, 0.8)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your question..."
                            style={{ flex: 1, backgroundColor: '#2c2c2c', color: '#f5f5f5', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid transparent', outline: 'none' }}
                        />
                        <button onClick={handleSend} style={{ marginLeft: '0.5rem', padding: '0.5rem', color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }} disabled={isLoading}>
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;