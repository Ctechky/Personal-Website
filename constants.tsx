import React from 'react';
import type { ResumeData } from './types';

export const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

export const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);


// ==================================================================================
// This data is now based on the provided resume.
// ==================================================================================
export const RESUME_DATA: ResumeData = {
  name: "Chong Kok Yang",
  title: "Ex-Technical Engineer @ Keppel | Ex-Quality Engineer @ Skyworks | Chem & Biomolecular Eng Student (ML & DA)",
  contact: {
    email: "cky1130@gmail.com",
    github: "https://github.com/kokyangchong", // Placeholder, as it was not in the resume
    telegram: "https://t.me/kokyangg", // Placeholder for Telegram
    linkedin: "https://www.linkedin.com/in/kok-yang-chong/",
  },
  about: "A detail-oriented Chemical Engineering student specializing in Machine Learning and Data Analytics. Passionate about leveraging DSAI and automation for sustainable practices, and a collaborative leader focused on driving impactful innovation.",
  resumeUrl: "#", // Placeholder for actual resume URL
  projects: [
    {
      title: "Automated Real Estate Cost Database System",
      link: "#",
      year: "2025",
    },
    {
      title: "End-to-End Quality Event Analysis Platform",
      link: "#",
      year: "2025",
    },
    {
      title: "Hydrogen Storage Process Design Competition",
      link: "#",
      year: "2025",
    }
  ],
  experience: [
     {
      role: "Technical Service",
      company: "Keppel Ltd.",
      period: "May 2025 - August 2025 (4 months)",
      description: [
        "Proposed and implemented automation solutions to streamline workflows.",
        "Rebuilt real estate cost databases using SQL and Django ORM, improving data reliability.",
        "Modeled OCR systems with Python and PyTorch to extract structured data from unstructured quotations.",
        "Developed data visualizations using Power BI and Python-driven dashboards.",
        "Managed end-to-end workflows: automation → preprocessing → database → mining → visualization → LLM fine-tuning."
      ]
    },
    {
      role: "Quality Management Specialist",
      company: "Skyworks Solutions, Inc.",
      period: "December 2024 - May 2025 (6 months)",
      description: [
        "Assisted in end-to-end defect and root cause analysis using Scikit Learn (Random Forest).",
        "Built interactive Power BI dashboards and Power Apps for real-time tracking of scrap cases.",
        "Automated documentation and enquiry flow for MRB/PLD reviews using Power Automate, achieving 95% closure rate.",
        "Integrated a text analytics algorithm with LLM to analyze scrap comments, reducing losses by $300K.",
        "Collaborated with the U.S. IT team to enhance internal defect reporting workflows, reducing data entry errors by 15%."
      ]
    },
    {
      role: "Trainee",
      company: "AVEVA",
      period: "January 2025 - May 2025 (5 months)",
      description: [
        "Participated in a MCH hydrogen storage system process design competition.",
        "Utilized AVEVA Process Simulation software for mass and heat balance (MHB) and process control simulation.",
        "Applied industrial ISO standards for design to ensure 100% compliance on safety perspective."
      ]
    }
  ],
  leadership: [
    {
      role: "President / Vice President (External)",
      organization: "AIChE - American Institute of Chemical Engineers, NTU Chapter",
      period: "September 2024 - Present",
      description: [
        "Founding the official AIChE NTU Student Chapter.",
        "Initiated NTU-NUS Exchange Day, industry talks, and networking events."
      ]
    },
    {
      role: "Head Programmer, OneArena 2024",
      organization: "NTU OneArena, College of Engineering",
      period: "September 2023 - June 2024 (10 months)",
      description: [
        "Led the One Arena Robotic Challenge, developing robotics coding tutorials for students using DJI RoboMaster.",
        "Managed 130 participants, designing and coding a complex robotic maze for the competition.",
        "Used PID control, infrared sensor, and motion sensors to generate robotic dance performances."
      ]
    },
     {
      role: "Chairperson, Chinese Cultural Camp 2024",
      organization: "NTU Chinese Society",
      period: "August 2023 - July 2024 (1 year)",
      description: [
        "Managed a committee team of 60 members.",
        "Oversaw budget planning, cutting down the initial budget by $20,000 (30%).",
        "Planned to revive the cultural ambience after six years of off-site camp."
      ]
    },
    {
        role: "Student Ambassador",
        organization: "Nanyang Technological University, College of Engineering",
        period: "September 2023 - Present",
        description: [
            "Selected as a student ambassador to promote the NTU engineering course."
        ]
    }
  ],
  education: [
    {
        degree: "Bachelor of Engineering - BE, Chemical and Biomolecular Engineering",
        institution: "Nanyang Technological University Singapore",
        period: "August 2022 - May 2026 (Expected)",
        details: [
            "Specialization in Machine Learning and Data Analytics.",
            "Kuok Scholar, Scholarship Recipient."
        ]
    },
     {
        degree: "Physical Sciences (STPM)",
        institution: "SMK Tasek Utara, Malaysia",
        period: "July 2020 - June 2022",
        details: []
    },
    {
        degree: "Physical Sciences",
        institution: "SMK Mutiara Rini, Malaysia",
        period: "January 2015 - November 2019",
        details: []
    }
  ],
  skills: [
    {
      title: "Data Science & Machine Learning",
      skills: ["Machine Learning", "Python", "PyTorch", "Scikit-Learn", "SQL", "Database Design", "Power BI", "LangChain", "LLM Fine-Tuning", "Data Visualization"]
    },
    {
      title: "Software & Automation",
      skills: ["Power Automate", "Power Apps", "Django ORM", "AVEVA Process Simulation", "JavaScript", "HTML/CSS", "Google Apps Script"]
    },
    {
      title: "Certifications",
      skills: ["Using Python to Access Web Data", "Using Databases with Python", "Programming for Everybody", "Python Data Structures"]
    },
    {
      title: "Languages",
      skills: ["English (Native/Bilingual)", "Chinese (Native/Bilingual)", "Malay (Native/Bilingual)", "Indonesian (Professional)", "Hokkien (Professional)", "Cantonese (Limited)", "Spanish (Limited)"]
    }
  ]
};