import React from 'react';
import type { Project } from '../types';
import { getImageUrl } from '../utils/imageProtection';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
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
                    {project.year && <span className="project-card-year-badge">{project.year}</span>}
                    {project.status && (
                        <span className={`project-card-status-badge project-status-${project.status}`}>
                            {project.status}
                        </span>
                    )}
                </div>
            )}
            <div className="project-card-content">
                <h3 className="project-card-title">{project.title}</h3>
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
    return (
        <div className="projects-container">
            {projects.map((project, index) => (
                <ProjectCard key={`${project.title}-${project.year || index}`} project={project} />
            ))}
        </div>
    );
};

export default Projects;