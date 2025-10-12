
export interface Project {
  title: string;
  link?: string;
  year?: string;
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

export interface SkillCategory {
  title: string;
  skills: string[];
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