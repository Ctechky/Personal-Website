import React from 'react';
import type { Education } from '../types';

const EducationItem: React.FC<{ item: Education }> = ({ item }) => (
     <div className="card-sheet">
        <p className="timeline-period">{item.period}</p>
        <h3 className="timeline-title">{item.degree}</h3>
        <p className="timeline-subtitle">{item.institution}</p>
        <ul className="timeline-description">
            {item.details.map((detail, i) => (
                <li key={i}>{detail}</li>
            ))}
        </ul>
    </div>
);


const Education: React.FC<{ education: Education[] }> = ({ education }) => {
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