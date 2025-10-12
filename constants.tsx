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
  title: "Process Engineer | Data Analytics & Machine Learning for Process Improvement | Semiconductor & Sustainability",
  contact: {
    email: "enson.kokyang.chong@gmail.com",
    github: "https://github.com/Ctechky",
    githubSchool: "https://github.com/cky09002",
    telegram: "https://t.me/cky1130",
    linkedin: "https://www.linkedin.com/in/kok-yang-chong/",
  },
  about: "Year 4 Chemical Engineering student at Nanyang Technological University (NTU), specializing in applying Machine Learning & Data Analytics to improve manufacturing processes. President of AIChE NTU Student Chapter and Vice President of Machine Learning & Data Analytics Club. Kuok Foundation Scholar experienced in analyzing existing processes, identifying inefficiencies through data-driven approaches, and formulating optimization strategies. Proven track record in semiconductor process optimization (URECA lithography research) and developing analytics solutions for process improvement. Seeking Process Engineer, Data Analyst, or Machine Learning Engineer positions to leverage technical expertise for continuous process enhancement in semiconductor or sustainability-focused industries.",
  resumeUrl: "/Resume.pdf",
  projects: [
    // 2025 Projects (Most Recent)
    {
      title: "TypeScript Floor Plan Generator",
      link: "https://github.com/Ctechky/Floor-generator",
      year: "2025",
      description: "Systematic approach to floor plan optimization, formulating space utilization problems and developing data-driven solutions. Analyzes layout constraints and develops optimization algorithms to maximize space efficiency and workflow productivity.",
      image: "proj_1",
      status: "ongoing",
    },
    {
      title: "SC2002 Internship Placement System",
      link: "https://github.com/cky09002/SC2002-Internship-Placement-System",
      year: "2025",
      description: "Data-driven system for internship placement optimization. Formulates matching problems based on student skills and company requirements, using systematic analysis to improve placement efficiency and satisfaction rates.",
      image: "proj_2",
      status: "completed",
    },
    {
      title: "Image Segmentation - Pytorch Attention U-Net",
      link: "https://github.com/cky09002/Image-Segmentation-Pytorch-Attention-U-Net",
      year: "2025",
      description: "Systematic approach to image analysis and segmentation. Formulates computer vision problems for automated quality inspection and process monitoring, developing data-driven solutions for manufacturing applications.",
      image: "proj_3",
      status: "maintenance",
    },
    {
      title: "AIChE NTU Student Chapter Official Website",
      link: "https://github.com/cky09002/AIChE-NTU.github.io",
      year: "2025",
      description: "Modern, responsive website for the American Institute of Chemical Engineers NTU Student Chapter showcasing events and resources.",
      image: "proj_4",
      status: "ongoing",
    },
    {
      title: "SC1003 Battleship Game (Pygame)",
      link: "https://github.com/cky09002/SC1003--Battleship-Pygame",
      year: "2025",
      description: "Interactive Battleship game built with Pygame featuring AI opponent, graphical interface, and strategic gameplay mechanics.",
      image: "proj_7",
      status: "completed",
    },
    {
      title: "Pandemic Simulation Game",
      link: "https://github.com/cky09002/Pandemic-Simulation-Game",
      year: "2025",
      description: "Epidemiological modeling and simulation system. Formulates disease spread dynamics problems using statistical analysis and simulation frameworks to understand and predict pandemic behavior.",
      image: "proj_8",
      status: "maintenance",
    },
    {
      title: "Covid-19 Data Analytics",
      link: "https://github.com/cky09002/Covid-19-data-analytics",
      year: "2025",
      description: "Comprehensive data analysis project examining COVID-19 trends and patterns. Formulates time-series forecasting problems using statistical modeling and data visualization to extract meaningful insights from pandemic data.",
      image: "proj_9",
      status: "completed",
    },
    {
      title: "TF2 Deep FloorPlan Recognition",
      link: "https://github.com/cky09002/TF2DeepFloorplan",
      year: "2025",
      description: "Deep learning system for architectural pattern recognition. Formulates computer vision problems using neural networks for automated floor plan analysis and facility management applications.",
      image: "proj_10",
      status: "archived",
    },
    // 2024 Projects
    {
      title: "OneArena 2024 Robotics Competition",
      link: "https://github.com/cky09002/OneArena-2024",
      year: "2024",
      description: "Robotic navigation system development for maze solving. Formulates pathfinding optimization problems using systematic algorithms and real-time decision making for autonomous robot control.",
      image: "proj_6",
      status: "completed",
    },
    // 2023-2024 Research
    {
      title: "URECA: Optimization of 3D SU-8 Microstructures using Mask-less Lithography",
      link: "https://github.com/cky09002",
      year: "2023-2024",
      description: "Process optimization research in semiconductor manufacturing. Formulates lithography parameter optimization problems using systematic data analysis to improve yield and reduce defects in wafer fabrication processes.",
      image: "proj_5",
      status: "completed",
    }
  ],
  experience: [
    {
      role: "Technical Services Specialist, Intern",
      company: "Keppel, Real Estate Division",
      period: "June 2025 - August 2025",
      description: [
        "Rebuilt cost databases using SQLite/MySQL with relational models.",
        "Developed TypeScript floor plan generator producing top 10 optimized layouts; added AutoCAD DXF export.",
        "Applied Python Library (NumPy, PyTorch) linear regression for cost prediction (90% accuracy).",
        "Automated PDF data extraction with Power Apps AI Builder + Python."
      ]
    },
    {
      role: "Quality Management Specialist, Intern",
      company: "Skyworks Solutions Inc. (Semiconductor Manufacturing)",
      period: "December 2024 - May 2025",
      description: [
        "Extracted key insights from semiconductor production data using advanced analytics and machine learning (Random Forest) for defect root cause analysis.",
        "Built Power BI dashboards with text analytics to detect 100 hidden mishandling cases in semiconductor manufacturing, reducing losses by $300K.",
        "Automated scrap case reviews via Power Automate/Apps, achieving 95% closure rate for process engineering optimization.",
        "Created Python + Azure data parser to extract key semiconductor event data from reports/emails for process improvement.",
        "Optimized semiconductor manufacturing workflows with US IT team, cutting data entry error rate 15% and report time 20%."
      ]
    },
    {
      role: "Research Assistant (URECA Program)",
      company: "Nanyang Technological University",
      period: "September 2023 - June 2024",
      description: [
        "Conducted semiconductor process engineering research on optimization of 3D SU-8 microstructures using mask-less lithography.",
        "Extracted key process parameters and analyzed fabrication data to reduce microstructure size to 27 μm and print time by 30% via automation.",
        "Improved wafer fabrication process efficiency by 20% through data-driven optimization; enhanced imaging resolution 4× with SEM and oil immersion microscopy.",
        "Applied advanced data analytics and process optimization methods for semiconductor manufacturing, combining process engineering expertise with machine learning techniques."
      ]
    }
  ],
  leadership: [
    {
      role: "President",
      organization: "American Institute of Chemical Engineers (AIChE), NTU Student Chapter",
      period: "September 2024 - Present",
      description: [
        "Founded official NTU chapter, fostering professional development and industry connections.",
        "Organized industry workshops and networking events to enhance technical skills.",
        "Planned sustainability-driven hydrogen-fuel E-car competition using iodine-clock reaction."
      ]
    },
    {
      role: "Vice-President",
      organization: "Analytics and Data Science Club, School of Chemistry, Chemical Engineering and Biotechnology",
      period: "September 2025 - Present",
      description: [
        "Analyzing semiconductor, chemical, and biomedical datasets on Kaggle using Python, SQL, and MATLAB, building predictive models.",
        "Conducting machine learning experiments and sharing results in student-accessible workshops and seasonal showcases."
      ]
    },
    {
      role: "Head Programmer",
      organization: "NTU One Arena 2024, College of Engineering",
      period: "October 2023 - June 2024",
      description: [
        "Led 15-member team, developed robot use tutorials, and resolved technical issues for 130 participants from 24 schools.",
        "Built Python-coded robotic maze and competition schedule, reducing event transitions by 3 minutes."
      ]
    },
    {
      role: "Event Chairperson",
      organization: "Chinese Cultural Camp, NTU Chinese Society",
      period: "September 2023 - June 2024",
      description: [
        "Managed a committee team of 30 members, ensuring efforts remained organized and coordinated.",
        "Oversaw budget planning, cutting down initial budget by $3000 while assuring cultural promotion objectives are met.",
        "Devised alternative activities format to ensure event continuity during participant shortages, preventing event cancellation."
      ]
    },
    {
      role: "Programmer",
      organization: "Freshman Orientation Activities, AMCISA",
      period: "August 2023 - August 2024",
      description: [
        "Planned and executed interactive games using JavaScript and Google Apps Script, with integrated Google Sheets formulas for real-time tracking.",
        "Coordinated with different portfolios to ensure smooth procedures and seamless execution of events."
      ]
    }
  ],
  education: [
    {
        degree: "Bachelor of Engineering (Chemical and Biomolecular Engineering)",
        institution: "Nanyang Technological University, Singapore",
        period: "August 2022 - Present (Year 4)",
        details: [
            "Specialization: Machine Learning & Data Analytics",
            "Minor: Machine Learning & Data Analytics",
            "Expected Honors (Higher Distinction)",
            "Kuok Foundation Scholarship Recipient",
            "Relevant Courses: Machine Learning, Data Analytics, Thermodynamics, Reaction Engineering, Plant Safety"
        ]
    }
  ],
  skills: [
    {
      title: "Process Engineering",
      skills: ["Semiconductor Manufacturing", "Wafer Fabrication", "Lithography Process Optimization", "Quality Management Systems", "Process Control", "Root Cause Analysis", "SEM Microscopy"]
    },
    {
      title: "Data Analytics & ML",
      skills: ["Predictive Analytics", "Machine Learning", "Statistical Analysis", "Data Mining", "Text Analytics", "PyTorch", "Scikit-Learn", "Power BI", "Python", "SQL"]
    },
    {
      title: "Semiconductor & Energy Tools",
      skills: ["AVEVA Process Simulation", "Aspen HYSYS", "DWSIM", "SEM Microscopy", "Process Automation", "Quality Control Systems"]
    },
    {
      title: "Programming & Databases",
      skills: ["Python", "SQL", "MATLAB", "JavaScript", "TypeScript", "Database Design", "SQLite", "MySQL", "Django ORM"]
    },
    {
      title: "Automation & Platforms",
      skills: ["Microsoft Power Platform", "Power Automate", "Power Apps", "Azure", "Data Visualization", "Dashboard Development"]
    },
    {
      title: "Languages",
      skills: ["English (Proficient)", "Chinese (Proficient)", "Malay (Proficient)", "Spanish (Conversant)"]
    },
    {
      title: "Awards & Certifications",
      skills: ["Kuok Foundation Scholarship", "IMONST Bronze Award (2018)", "IChONST Honourable Mention (2018)", "Python Certifications (Coursera)"]
    }
  ],
  hobbies: [
    {
      name: "Building Personal Tools",
      image: "hobby_coding",
      description: "Creating small automation tools and utilities"
    },
    {
      name: "Debate",
      image: "hobby_debate",
      description: "Engaging in intellectual discussions and arguments"
    },
    {
      name: "Watching Movies",
      image: "hobby_movies",
      description: "Enjoying films and cinematic storytelling"
    },
    {
      name: "Ping Pong",
      image: "hobby_pingpong",
      description: "Fast-paced table tennis for quick reflexes"
    },
    {
      name: "Running",
      image: "hobby_running",
      description: "Staying active and building endurance"
    },
    {
      name: "Mahjong",
      image: "hobby_mahjong",
      description: "Strategic tile game with friends and family"
    },
    {
      name: "Reading",
      image: "hobby_reading",
      description: "Technical books and industry insights"
    }
  ]
};