# Personal Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Features an AI-powered chatbot using Google's Gemini API.

## 🚀 Quick Start

**Prerequisites:** Node.js (v18 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Customize your information:**
   - Edit `constants.tsx` - Update all personal information (name, email, experience, projects, etc.)
   - Replace `public/Resume.pdf` with your own resume PDF

3. **Set up the chatbot API key:**
   - Create a `.env` file in the root directory
   - Add your Gemini API key: `VITE_API_KEY=your_api_key_here`
   - Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

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

### Update Personal Information
All personal data is centralized in `constants.tsx`. Update the `RESUME_DATA` object with your:
- Name, title, and contact information
- Projects (with GitHub links)
- Work experience
- Leadership roles
- Education
- Skills

### Update Resume PDF
Replace the file `public/Resume.pdf` with your own resume

### Customize Styling & Colors
All styles are centralized in `styles.css`. Customize the theme by editing CSS variables at the top:
- **Colors:** Change `--accent-primary`, `--bg-color`, `--text-*` colors
- **Spacing:** Adjust `--section-gap`, `--card-gap`
- **Typography:** Change font family in `--font-sans`
- **Layout:** Modify margins, padding, and grid layouts throughout the file

## 🚢 Deployment

See `components/DeploymentGuide.tsx` for detailed deployment instructions to Vercel or other platforms.

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite 7
- Google Gemini API
- CSS Variables for theming

## ✨ Features

- 🌓 **Dark/Light Theme Toggle** - Automatic theme detection with manual toggle
- 🤖 **AI-Powered Chatbot** - Interactive assistant using Google Gemini
- 📱 **Fully Responsive** - Beautiful on all devices
- 🎨 **Easy Customization** - Centralized data and styling
- ⚡ **Fast & Modern** - Built with Vite and React 19

## 📄 License

Feel free to use this template for your own portfolio!
