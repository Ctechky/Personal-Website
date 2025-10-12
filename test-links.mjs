/**
 * Link Testing Script for Personal Website
 * Tests all external links and local resources
 * 
 * Run with: npm run test:links
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passed = 0;
let failed = 0;
const failures = [];

/**
 * Test external URL
 */
async function testURL(url, name) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (response.ok) {
      console.log(`${colors.green}✓${colors.reset} ${name}`);
      passed++;
      return true;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name} (Status: ${response.status})`);
      failures.push({ name, url, error: `HTTP ${response.status}` });
      failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name} (${error.message})`);
    failures.push({ name, url, error: error.message });
    failed++;
    return false;
  }
}

/**
 * Test local file
 */
function testFile(filePath, name) {
  const fullPath = path.join(__dirname, 'public', filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    passed++;
    return true;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${name} (Not found)`);
    failures.push({ name, path: filePath, error: 'File not found' });
    failed++;
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`\n${colors.cyan}${colors.bold}========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}  Personal Website Link Checker${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}========================================${colors.reset}\n`);

  // Test Contact Links
  console.log(`${colors.blue}${colors.bold}📧 Contact Links${colors.reset}`);
  await testURL('https://github.com/Ctechky', 'GitHub (Ctechky)');
  await testURL('https://github.com/cky09002', 'GitHub (cky09002)');
  await testURL('https://www.linkedin.com/in/kok-yang-chong/', 'LinkedIn');
  await testURL('https://t.me/cky1130', 'Telegram');
  console.log('');

  // Test Resume
  console.log(`${colors.blue}${colors.bold}📄 Resume${colors.reset}`);
  testFile('Resume.pdf', 'Resume PDF');
  console.log('');

  // Test Profile Images
  console.log(`${colors.blue}${colors.bold}👤 Profile Images${colors.reset}`);
  testFile('images/profile/ChongKokYang_Black.png', 'Profile (Black)');
  testFile('images/profile/ChongKokyang_chill.jpeg', 'Profile (Chill)');
  testFile('images/profile/ChongKokYang_White.png', 'Profile (White)');
  console.log('');

  // Test Project Repository Links
  console.log(`${colors.blue}${colors.bold}🔗 Project Repositories${colors.reset}`);
  await testURL('https://github.com/Ctechky/Floor-generator', 'TypeScript Floor Plan Generator');
  await testURL('https://github.com/cky09002/SC2002-Internship-Placement-System', 'SC2002 Internship System');
  await testURL('https://github.com/cky09002/Image-Segmentation-Pytorch-Attention-U-Net', 'Image Segmentation');
  await testURL('https://github.com/cky09002/AIChE-NTU.github.io', 'AIChE NTU Website');
  await testURL('https://github.com/cky09002', 'URECA Project');
  await testURL('https://github.com/cky09002/OneArena-2024', 'OneArena 2024');
  await testURL('https://github.com/cky09002/SC1003--Battleship-Pygame', 'Battleship Game');
  await testURL('https://github.com/cky09002/Pandemic-Simulation-Game', 'Pandemic Simulation');
  await testURL('https://github.com/cky09002/Covid-19-data-analytics', 'COVID-19 Analytics');
  await testURL('https://github.com/cky09002/TF2DeepFloorplan', 'TF2 Deep FloorPlan');
  console.log('');

  // Test Project Images (Unsplash URLs)
  console.log(`${colors.blue}${colors.bold}🖼️  Project Images (External)${colors.reset}`);
  await testURL('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop', 'Floor Plan Generator Image');
  await testURL('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop', 'Internship System Image');
  await testURL('https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop', 'Image Segmentation Image');
  await testURL('https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=250&fit=crop', 'AIChE Website Image');
  await testURL('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=250&fit=crop', 'URECA Image');
  await testURL('https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=250&fit=crop', 'OneArena Image');
  await testURL('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop', 'Battleship Image');
  await testURL('https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop', 'Pandemic Sim Image');
  await testURL('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop', 'COVID Analytics Image');
  await testURL('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop', 'FloorPlan Recognition Image');
  console.log('');

  // Summary
  console.log(`${colors.cyan}${colors.bold}========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}  Summary${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}========================================${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);

  const successRate = ((passed / (passed + failed)) * 100).toFixed(1);
  
  if (successRate === '100.0') {
    console.log(`\n${colors.green}${colors.bold}✨ All tests passed! (${successRate}%)${colors.reset}\n`);
  } else if (successRate >= 80) {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  Most tests passed (${successRate}%)${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}${colors.bold}❌ Many tests failed (${successRate}%)${colors.reset}\n`);
  }

  if (failures.length > 0) {
    console.log(`${colors.red}${colors.bold}Failed Tests:${colors.reset}`);
    failures.forEach((f, i) => {
      console.log(`${i + 1}. ${f.name}`);
      console.log(`   ${f.url || f.path}`);
      console.log(`   ${colors.red}${f.error}${colors.reset}\n`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
console.log(`${colors.cyan}Starting link checker...${colors.reset}`);
runTests().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
