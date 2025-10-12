# Personal Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Features an AI-powered chatbot using Google's Gemini API, dark/light theme support, and easy customization through JSON configuration files.

## 🚀 Quick Start

**Prerequisites:** Node.js (v18 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Customize your information:**
   - Edit JSON files in the `config/` directory:
     - `personal.json` - Your basic info (name, title, contact details)
     - `projects.json` - Your projects and portfolio items
     - `experience.json` - Work experience and internships
     - `leadership.json` - Leadership roles and organizations
     - `education.json` - Educational background
     - `skills.json` - Technical skills and competencies
     - `hobbies.json` - Personal interests and hobbies
   - Replace `public/Resume.pdf` with your own resume PDF
   - Update `index.html` title and meta tags with your information

3. **Set up the AI chatbot (optional):**
   - Create a `.env` file in the root directory
   - Add your Gemini API key: `VITE_API_KEY=your_api_key_here`
   - Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - The chatbot will work without API key but will show fallback contact information

4. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📝 Customization Guide

### Configuration Files
All personal data is stored in JSON files in the `config/` directory for easy editing:

- **`config/personal.json`** - Basic information (name, title, contact, resume)
- **`config/projects.json`** - Portfolio projects with links and descriptions
- **`config/experience.json`** - Work experience with company websites
- **`config/leadership.json`** - Leadership roles and organization links
- **`config/education.json`** - Educational background with institution links
- **`config/skills.json`** - Technical skills organized by categories
- **`config/hobbies.json`** - Personal interests with images and descriptions

### Update Images
- Replace images in `public/images/` directories:
  - `profile/` - Profile pictures
  - `projects/` - Project screenshots
  - `hobbies/` - Hobby-related images
- Update image references in JSON config files

### Customize Styling & Colors
All styles are centralized in `styles.css`. Customize the theme by editing CSS variables at the top:
- **Colors:** Change `--accent-primary`, `--bg-color`, `--text-*` colors
- **Spacing:** Adjust `--section-gap`, `--card-gap`
- **Typography:** Change font family in `--font-sans`
- **Layout:** Modify margins, padding, and grid layouts throughout the file

## 🚢 Deployment on Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Add environment variable `VITE_API_KEY` if using the chatbot
   - Deploy automatically

3. **Custom Domain (optional):**
   - Add your domain in Vercel dashboard
   - Update DNS settings as instructed

## 🛠️ Tech Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite 7** - Fast build tool and dev server
- **Google Gemini API** - AI chatbot integration
- **CSS Variables** - Dynamic theming system
- **JSON Configuration** - Easy content management

## ✨ Features

- 🌓 **Dark/Light Theme Toggle** - Automatic theme detection with manual toggle
- 🤖 **AI-Powered Chatbot** - Interactive assistant using Google Gemini (optional)
- 📱 **Fully Responsive** - Beautiful on all devices (mobile, tablet, desktop)
- 🎨 **Easy Customization** - JSON-based configuration system
- ⚡ **Fast & Modern** - Built with Vite and React 19
- 🔗 **Clickable Links** - Direct links to company websites and projects
- 🛡️ **Image Protection** - Obfuscated image URLs with download protection
- 📊 **Project Status** - Visual indicators for project states (ongoing, completed, etc.)
- 🎯 **SEO Optimized** - Meta tags and structured data for search engines

## 📁 Project Structure

```
├── config/                 # JSON configuration files
│   ├── personal.json      # Basic information
│   ├── projects.json      # Portfolio projects
│   ├── experience.json    # Work experience
│   ├── leadership.json    # Leadership roles
│   ├── education.json     # Educational background
│   ├── skills.json        # Technical skills
│   ├── hobbies.json       # Personal interests
│   └── index.ts           # Configuration loader
├── components/            # React components
├── public/               # Static assets
│   ├── images/          # Image files
│   └── Resume.pdf       # Your resume
├── styles.css           # Global styles and themes
├── utils/               # Utility functions
└── types.ts            # TypeScript type definitions
```

## 🔧 Development

- **Test Gemini Models:** `node test-gemini-models.js` (requires API key)
- **Lint Code:** `npm run lint`
- **Type Check:** `npm run type-check`

## 📄 License

Feel free to use this template for your own portfolio! Star the repo if you find it helpful.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.