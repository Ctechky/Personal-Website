import personalConfig from './personal.json';
import projectsConfig from './projects.json';
import experienceConfig from './experience.json';
import leadershipConfig from './leadership.json';
import educationConfig from './education.json';
import skillsConfig from './skills.json';
import hobbiesConfig from './hobbies.json';

export const CONFIG = {
  personal: personalConfig,
  projects: projectsConfig.projects as any,
  experience: experienceConfig.experience,
  leadership: leadershipConfig.leadership,
  education: educationConfig.education,
  skills: skillsConfig.skills,
  hobbies: hobbiesConfig.hobbies,
};

export default CONFIG;
