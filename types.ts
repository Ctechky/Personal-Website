
export interface Project {
  title: string;
  link?: string;
  period?: string;
  description?: string;
  image?: string;
  status?: 'ongoing' | 'maintenance' | 'completed' | 'archived';
}

export interface ExperienceType {
  role: string;
  company: string;
  period: string;
  website?: string;
  description: string[];
}

export interface LeadershipExperience {
  role: string;
  organization: string;
  period: string;
  website?: string;
  description: string[];
}

export interface EducationType {
    degree: string;
    institution: string;
    period: string;
    website?: string;
    details: string[];
}

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4; // 1: Beginner, 2: Intermediate, 3: Advanced, 4: Expert
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Hobby {
  name: string;
  image?: string;
  description?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    github: string;
    githubSchool?: string;
    telegram?: string;
    linkedin?: string;
  };
  about: string;
  coverLetter?: string[];
  projects: Project[];
  experience: ExperienceType[];
  leadership: LeadershipExperience[];
  education: EducationType[];
  skills: SkillCategory[];
  hobbies?: Hobby[];
  resumeUrl: string;
}


export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}