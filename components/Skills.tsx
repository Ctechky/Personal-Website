import React from 'react';
import type { SkillCategory } from '../types';

const Skills: React.FC<{ skillCategories: SkillCategory[] }> = ({ skillCategories }) => {
    return (
        <div className="skills-container">
            {skillCategories.map(category => (
                <div key={category.title} className="card-sheet">
                    <h3 className="skill-category-title">{category.title}</h3>
                    <ul className="skill-list">
                        {category.skills.map(skill => (
                            <li key={skill} className="skill-tag">{skill}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Skills;