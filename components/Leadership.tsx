import React, { useMemo } from 'react';
import type { LeadershipExperience } from '../types';

const LeadershipItem: React.FC<{ item: LeadershipExperience }> = ({ item }) => (
    <div className="card-sheet">
        <p className="timeline-period">{item.period}</p>
        <h3 className="timeline-title">{item.role}</h3>
        <p className="timeline-subtitle">
            {item.website ? (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="organization-link">
                    {item.organization}
                </a>
            ) : (
                item.organization
            )}
        </p>
        <ul className="timeline-description">
            {item.description.map((desc, i) => (
                <li key={i}>{desc}</li>
            ))}
        </ul>
    </div>
);

const Leadership: React.FC<{ leadership: LeadershipExperience[] }> = ({ leadership }) => {
    // Extract year from period (get the start year)
    const getYear = (period: string): number => {
        const match = period.match(/\b(20\d{2})\b/);
        return match ? parseInt(match[1]) : new Date().getFullYear();
    };

    // Group leadership by year
    const groupedLeadership = useMemo(() => {
        // Group by year
        const grouped = leadership.reduce((acc, item) => {
            const year = getYear(item.period);
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {} as Record<number, LeadershipExperience[]>);

        // Sort years in descending order
        return Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a)
            .map(year => ({
                year,
                items: grouped[year]
            }));
    }, [leadership]);

    return (
        <div className="timeline-container">
            {groupedLeadership.map(({ year, items }) => (
                <div key={year} className="year-group">
                    <h3 className="year-subheader">{year}</h3>
                    {items.map(item => (
                        <div key={item.role + item.organization} className="timeline-item">
                            <LeadershipItem item={item} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Leadership;