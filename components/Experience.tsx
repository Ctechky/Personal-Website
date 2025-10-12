
import React from 'react';
import type { ExperienceType } from '../types';

const ExperienceItem: React.FC<{ item: ExperienceType }> = ({ item }) => (
    <div className="card-sheet">
        <p className="timeline-period">{item.period}</p>
        <h3 className="timeline-title">{item.role}</h3>
        <p className="timeline-subtitle">
            {item.website ? (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="organization-link">
                    {item.company}
                </a>
            ) : (
                item.company
            )}
        </p>
        <ul className="timeline-description">
            {item.description.map((desc, i) => (
                <li key={i}>{desc}</li>
            ))}
        </ul>
    </div>
);

const Experience: React.FC<{ experiences: ExperienceType[] }> = ({ experiences }) => {
    return (
        <div className="timeline-container">
            {experiences.map(exp => (
                <div key={exp.role + exp.company} className="timeline-item">
                    <ExperienceItem item={exp} />
                </div>
            ))}
        </div>
    );
};

export default Experience;