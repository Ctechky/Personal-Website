import React from 'react';
import Header from './components/Header';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Leadership from './components/Leadership';
import Education from './components/Education';
import Skills from './components/Skills';
import Chatbot from './components/Chatbot';
import DeploymentGuide from './components/DeploymentGuide';
import TopNav from './components/TopNav';
import { RESUME_DATA } from './constants';

const App: React.FC = () => {
  return (
    <>
      <TopNav />
      <div className="container">
        <div className="main-layout">
          <header id="left-column">
            <Header 
              name={RESUME_DATA.name}
              title={RESUME_DATA.title}
              about={RESUME_DATA.about}
              contact={RESUME_DATA.contact}
              resumeUrl={RESUME_DATA.resumeUrl}
            />
          </header>
          <main id="right-column">
            <section id="experience" className="content-section">
              <h2 className="section-heading">Experience</h2>
              <Experience experiences={RESUME_DATA.experience} />
            </section>
             <section id="leadership" className="content-section">
              <h2 className="section-heading">Leadership</h2>
              <Leadership leadership={RESUME_DATA.leadership} />
            </section>
            <section id="projects" className="content-section">
               <h2 className="section-heading">Projects</h2>
              <Projects projects={RESUME_DATA.projects} />
            </section>
            <section id="education" className="content-section">
              <h2 className="section-heading">Education</h2>
              <Education education={RESUME_DATA.education} />
            </section>
            <section id="skills" className="content-section">
              <h2 className="section-heading">Skills</h2>
              <Skills skillCategories={RESUME_DATA.skills} />
            </section>
             <section id="deploy" className="content-section">
              <h2 className="section-heading">How to Deploy</h2>
              <DeploymentGuide />
            </section>
          </main>
        </div>
      </div>
      <Chatbot resumeData={RESUME_DATA} />
    </>
  );
};

export default App;