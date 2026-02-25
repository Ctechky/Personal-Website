import React, { useState, useMemo } from 'react';
import type { Project } from '../types';
import { getImageUrl } from '../utils/imageProtection';
import { CONFIG } from '../config';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const getStatusLabel = (status?: string): string => {
        if (!status) return '';
        return CONFIG.content.projectStatus[status as keyof typeof CONFIG.content.projectStatus] || status;
    };

    const cardContent = (
        <>
            {project.image && (
                <div className="project-card-image-container">
                    <img 
                        src={getImageUrl(project.image)} 
                        alt={project.title}
                        className="project-card-image protected-image"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    {project.period && <span className="project-card-year-badge">{project.period}</span>}
                    {project.status && (
                        <span className={`project-card-status-badge project-status-${project.status}`}>
                            {getStatusLabel(project.status)}
                        </span>
                    )}
                </div>
            )}
            <div className="project-card-content">
                <h3 className="project-card-title">
                    {project.title}
                    {project.status && (
                        <span className={`project-status-tab project-status-tab-${project.status}`}>
                            {getStatusLabel(project.status)}
                        </span>
                    )}
                </h3>
                {project.description && (
                    <p className="project-card-description">{project.description}</p>
                )}
            </div>
        </>
    );

    if (!project.link || project.link === '#') {
        return (
            <div className="card-sheet project-card">
                {cardContent}
            </div>
        );
    }

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-sheet project-card project-card-link"
        >
            {cardContent}
        </a>
    );
};

const MONTH_ORDER: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

/** Extract a numeric sort key (year * 100 + month) from a period string like "June 2025 - August 2025" or "Dec 2025 - 2026". */
const periodSortKey = (period?: string): number => {
    if (!period) return 0;
    // Take the part after the last " - " as the end date
    const parts = period.split(' - ');
    const end = (parts[parts.length - 1] ?? '').trim();
    const tokens = end.split(' ');
    if (tokens.length === 1) {
        // Just a year e.g. "2026"
        return parseInt(tokens[0], 10) * 100 + 12; // treat as December of that year
    }
    const month = MONTH_ORDER[tokens[0].toLowerCase()] ?? 0;
    const year  = parseInt(tokens[1], 10) || 0;
    return year * 100 + month;
};

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed' | 'maintenance'>('all');

    // Sort by latest end date, then filter by status
    const filteredProjects = useMemo(() => {
        const sorted = [...projects].sort((a, b) => periodSortKey(b.period) - periodSortKey(a.period));
        if (filter === 'all') return sorted;
        return sorted.filter(project => project.status === filter);
    }, [projects, filter]);

    return (
        <div className="projects-wrapper">
            <div className="projects-filter-toggle">
                <button
                    className={`filter-toggle-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-toggle-btn ${filter === 'ongoing' ? 'active' : ''}`}
                    onClick={() => setFilter('ongoing')}
                >
                    In Progress
                </button>
                <button
                    className={`filter-toggle-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
                <button
                    className={`filter-toggle-btn ${filter === 'maintenance' ? 'active' : ''}`}
                    onClick={() => setFilter('maintenance')}
                >
                    Maintenance
                </button>
            </div>

            <div className="projects-container">
                {filteredProjects.map((project, index) => (
                    <ProjectCard key={`${project.title}-${project.period || index}`} project={project} />
                ))}
                {filteredProjects.length === 0 && (
                    <p className="no-results-message">No projects found for this filter.</p>
                )}
            </div>
        </div>
    );
};

export default Projects;