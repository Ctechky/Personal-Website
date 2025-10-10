import React from 'react';
import type { Project } from '../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const cardContent = (
        <>
            {project.year && <p className="project-card-year">{project.year}</p>}
            <h3 className="project-card-title">{project.title}</h3>
        </>
    );

    if (!project.link || project.link === '#') {
        return (
            <div className="card-sheet project-card-simple">
                {cardContent}
            </div>
        );
    }

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-sheet project-card-simple"
        >
            {cardContent}
        </a>
    );
};

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
    return (
        <div className="projects-container">
            {projects.map(project => (
                <ProjectCard key={project.title} project={project} />
            ))}
        </div>
    );
};

export default Projects;