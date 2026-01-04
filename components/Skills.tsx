import React, { useMemo } from 'react';
import type { SkillCategory } from '../types';

const Skills: React.FC<{ skillCategories: SkillCategory[] }> = ({ skillCategories }) => {
    const levelMap: Record<1 | 2 | 3 | 4, { label: string; class: string; width: number }> = {
        1: { label: 'Beginner', class: 'beginner', width: 40 },
        2: { label: 'Intermediate', class: 'intermediate', width: 60 },
        3: { label: 'Advanced', class: 'advanced', width: 80 },
        4: { label: 'Expert', class: 'expert', width: 100 }
    };

    const isAwardCategory = (title: string): boolean => {
        return title.toLowerCase().includes('award') || 
               title.toLowerCase().includes('certification');
    };

    // Always sort skills by highest proficiency to lowest
    const sortedSkillCategories = useMemo(() => {
        return skillCategories.map(category => ({
            ...category,
            skills: [...category.skills].sort((a, b) => b.level - a.level) // High to low
        }));
    }, [skillCategories]);

    return (
        <div className="skills-container">
            {sortedSkillCategories.map(category => (
                <div key={category.title} className="card-sheet">
                    <h3 className="skill-category-title">{category.title}</h3>
                    {isAwardCategory(category.title) ? (
                        <ul className="skill-list-awards">
                            {category.skills.map(skill => (
                                <li key={skill.name} className="skill-award-item">
                                    {skill.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="skill-list">
                            {category.skills.map(skill => {
                                const levelInfo = levelMap[skill.level];
                                return (
                                    <div key={skill.name} className="skill-item">
                                        <div className="skill-header">
                                            <span className="skill-name">{skill.name}</span>
                                            <span className={`skill-proficiency-label ${levelInfo.class}`}>
                                                {levelInfo.label}
                                            </span>
                                        </div>
                                        <div className="skill-bar-container">
                                            <div 
                                                className={`skill-bar-fill ${levelInfo.class}`}
                                                style={{ width: `${levelInfo.width}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Skills;