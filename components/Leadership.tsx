import React from 'react';
import type { LeadershipExperience } from '../types';

const LeadershipItem: React.FC<{ item: LeadershipExperience }> = ({ item }) => (
    <div className="card-sheet">
        <p className="timeline-period">{item.period}</p>
        <h3 className="timeline-title">{item.role}</h3>
        <p className="timeline-subtitle">{item.organization}</p>
        <ul className="timeline-description">
            {item.description.map((desc, i) => (
                <li key={i}>{desc}</li>
            ))}
        </ul>
    </div>
);

const Leadership: React.FC<{ leadership: LeadershipExperience[] }> = ({ leadership }) => {
    return (
        <div className="timeline-container">
            {leadership.map(item => (
                <div key={item.role + item.organization} className="timeline-item">
                    <LeadershipItem item={item} />
                </div>
            ))}
        </div>
    );
};

export default Leadership;