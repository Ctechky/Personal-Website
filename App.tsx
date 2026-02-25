import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Leadership from './components/Leadership';
import Education from './components/Education';
import Skills from './components/Skills';
import Hobbies from './components/Hobbies';
import ContactCTA from './components/ContactCTA';
import Chatbot from './components/Chatbot';
import Blog from './components/Blog';
import TopNav from './components/TopNav';
import { RESUME_DATA } from './constants';
import { CONFIG } from './config';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage, falling back to OS preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme: 'light' | 'dark' = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = savedTheme ?? systemTheme;
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <TopNav theme={theme} toggleTheme={toggleTheme} />
      <div className="container">
        <div className="main-layout">
          <header id="left-column">
            <Header 
              name={RESUME_DATA.name}
              title={RESUME_DATA.title}
              about={RESUME_DATA.about}
              contact={RESUME_DATA.contact}
              resumeUrl={RESUME_DATA.resumeUrl}
              theme={theme}
            />
          </header>
          <main id="right-column">
            <section id="education" className="content-section">
              <h2 className="section-heading">{CONFIG.content.sectionHeadings.education}</h2>
              <Education education={RESUME_DATA.education} />
            </section>
            <section id="experience" className="content-section">
              <h2 className="section-heading">{CONFIG.content.sectionHeadings.experience}</h2>
              <Experience experiences={RESUME_DATA.experience} />
            </section>
            <section id="projects" className="content-section">
              <h2 className="section-heading">{CONFIG.content.sectionHeadings.projects}</h2>
              <Projects projects={RESUME_DATA.projects} />
            </section>
            <section id="leadership" className="content-section">
              <h2 className="section-heading">{CONFIG.content.sectionHeadings.leadership}</h2>
              <Leadership leadership={RESUME_DATA.leadership} />
            </section>
            <section id="skills" className="content-section">
              <h2 className="section-heading">{CONFIG.content.sectionHeadings.skills}</h2>
              <Skills skillCategories={RESUME_DATA.skills} />
            </section>
            {RESUME_DATA.hobbies && RESUME_DATA.hobbies.length > 0 && (
              <section id="hobbies" className="content-section">
                <h2 className="section-heading">{CONFIG.content.sectionHeadings.hobbies}</h2>
                <Hobbies hobbies={RESUME_DATA.hobbies} />
              </section>
            )}
            <section id="blog" className="content-section">
              <h2 className="section-heading">{CONFIG.content.sectionHeadings.blog}</h2>
              <Blog />
            </section>
            <section id="contact" className="content-section">
              <ContactCTA 
                email={RESUME_DATA.contact.email}
                linkedin={RESUME_DATA.contact.linkedin}
                telegram={RESUME_DATA.contact.telegram}
              />
            </section>
          </main>
        </div>
      </div>
      <Chatbot resumeData={RESUME_DATA} theme={theme} />
      <Analytics />
    </>
  );
};

export default App;