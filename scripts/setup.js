#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up your personal portfolio...\n');

// Check if config directory exists
const configDir = './config';
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
  console.log('✅ Created config directory');
}

// Check if .env file exists
const envFile = '.env';
if (!fs.existsSync(envFile)) {
  const envContent = `# Add your Gemini API key here (optional)
# Get your free API key from: https://aistudio.google.com/app/apikey
VITE_API_KEY=your_api_key_here
`;
  fs.writeFileSync(envFile, envContent);
  console.log('✅ Created .env file with API key placeholder');
}

// Check if Resume.pdf exists
const resumeFile = './public/Resume.pdf';
if (!fs.existsSync(resumeFile)) {
  console.log('⚠️  Please add your resume as public/Resume.pdf');
}

console.log('\n📝 Next steps:');
console.log('1. Edit config/*.json files with your information');
console.log('2. Add your resume as public/Resume.pdf');
console.log('3. Add your Gemini API key to .env (optional)');
console.log('4. Run: npm run dev');
console.log('\n🎉 Happy coding!');
