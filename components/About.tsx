import React from 'react';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="about-section-header">{title}</h2>
);

const About: React.FC<{ text: string }> = ({ text }) => {
    return (
        <section id="about">
            <SectionHeader title="About Me" />
            <p className="about-text">
                {text}
            </p>
        </section>
    );
};

export default About;