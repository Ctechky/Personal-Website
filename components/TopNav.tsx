import React, { useState, useEffect } from 'react';

const navItems = [
    { href: '#experience', label: 'Experience' },
    { href: '#leadership', label: 'Leadership' },
    { href: '#projects', label: 'Projects' },
    { href: '#education', label: 'Education' },
    { href: '#skills', label: 'Skills' },
    { href: '#deploy', label: 'Deploy' },
];

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

const TopNav: React.FC = () => {
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
            </div>
        </nav>
    );
};

export default TopNav;