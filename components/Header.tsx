import React from 'react';
import { GithubIcon, MailIcon, TelegramIcon, LinkedInIcon, DownloadIcon } from '../constants';

interface HeaderProps {
    name: string;
    title: string;
    about: string;
    contact: {
        email: string;
        github: string;
        telegram?: string;
        linkedin?: string;
    };
    resumeUrl: string;
}

const Header: React.FC<HeaderProps> = ({ name, title, about, contact, resumeUrl }) => {
    const titleParts = title.split(' | ');
    
    return (
        <div className="header-content">
            <div>
                <h1 className="header-name">{name}</h1>
                <div className="header-title">
                    {titleParts.map((part, index) => (
                        <span key={index} className="header-title-item">{part}</span>
                    ))}
                </div>

                <div className="header-actions">
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="download-resume-button">
                        <DownloadIcon />
                        Download CV
                    </a>
                    <div className="social-links">
                        {contact.linkedin && (
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <LinkedInIcon />
                            </a>
                        )}
                        <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <GithubIcon />
                        </a>
                        <a href={`mailto:${contact.email}`} aria-label="Email">
                            <MailIcon />
                        </a>
                        {contact.telegram && (
                            <a href={contact.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <TelegramIcon />
                            </a>
                        )}
                    </div>
                </div>
                
                <p className="header-about">{about}</p>
            </div>
        </div>
    );
};

export default Header;