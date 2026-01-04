import React, { useState, useEffect } from 'react';

const navItems = [
    { href: '#education', label: 'Education' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#leadership', label: 'Leadership' },
    { href: '#skills', label: 'Skills' },
    { href: '#hobbies', label: 'Hobbies' },
    { href: '#contact', label: 'Contact' },
];

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const HamburgerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const CloseIcon = () => (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

interface TopNavProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        const sections = navItems.map(item => document.getElementById(item.href.substring(1)));

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            let currentSectionId = '';
            
            sections.forEach(section => {
                if (section && section.offsetTop <= scrollPosition) {
                    currentSectionId = `#${section.id}`;
                }
            });

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
                const lastSection = sections[sections.length - 1];
                if (lastSection) {
                    currentSectionId = `#${lastSection.id}`;
                }
            }
            
            setActiveLink(currentSectionId);
        };
        
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.slice(1);
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
        setIsMenuOpen(false);
    };


    return (
        <nav className="top-nav">
            <div className="container nav-container">
                <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
                    {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                </button>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {navItems.map(item => (
                        <li key={item.href}>
                            <a 
                                href={item.href}
                                className={activeLink === item.href ? 'active' : ''}
                                onClick={(e) => handleNavClick(e, item.href)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <button 
                    className="theme-toggle" 
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </nav>
    );
};

export default TopNav;