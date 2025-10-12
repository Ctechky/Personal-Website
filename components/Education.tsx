
import React from 'react';
import type { EducationType } from '../types';

const EducationItem: React.FC<{ item: EducationType }> = ({ item }) => (
     <div className="card-sheet">
        <p className="timeline-period">{item.period}</p>
        <h3 className="timeline-title">{item.degree}</h3>
        <p className="timeline-subtitle">
            {item.website ? (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="organization-link">
                    {item.institution}
                </a>
            ) : (
                item.institution
            )}
        </p>
        <ul className="timeline-description">
            {item.details.map((detail, i) => (
                <li key={i}>{detail}</li>
            ))}
        </ul>
    </div>
);


const Education: React.FC<{ education: EducationType[] }> = ({ education }) => {
    return (
        <div className="timeline-container">
            {education.map(edu => (
                <div key={edu.degree} className="timeline-item">
                    <EducationItem item={edu} />
                </div>
            ))}
        </div>
    );
};

export default Education;