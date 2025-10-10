
export interface Project {
  title: string;
  link?: string;
  year?: string;
}

export interface ExperienceType {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface LeadershipExperience {
  role: string;
  organization: string;
  period: string;
  description: string[];
}

export interface EducationType {
    degree: string;
    institution: string;
    period: string;
    details: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    github: string;
    telegram?: string;
    linkedin?: string;
  };
  about: string;
  projects: Project[];
  experience: ExperienceType[];
  leadership: LeadershipExperience[];
  education: EducationType[];
  skills: SkillCategory[];
  resumeUrl: string;
}


export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}