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

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed' | 'maintenance'>('all');

    // Filter projects based on status
    const filteredProjects = useMemo(() => {
        if (filter === 'all') return projects;
        return projects.filter(project => project.status === filter);
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