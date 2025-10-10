import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code style={{backgroundColor: '#2c2c2c', color: '#f97316', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.9em', fontFamily: 'monospace'}}>{children}</code>
);

const DeploymentGuide: React.FC = () => {
    const linkStyle: React.CSSProperties = {
        color: '#f97316', // accent-primary
        fontWeight: 500,
        textDecoration: 'underline'
    };
    return (
        <div style={{backgroundColor: 'rgba(26, 26, 26, 0.5)', padding: '1.5rem', borderRadius: '0.5rem', color: '#a3a3a3', lineHeight: 1.7}}>
            <p style={{marginBottom: '1rem'}}>You can deploy your own version of this portfolio for free using Vercel. Follow these steps:</p>
            <ol style={{listStyle: 'decimal', listStylePosition: 'inside', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <li>
                    <strong>Fork & Clone this Repository:</strong> First, create your own copy of this code on GitHub.
                </li>
                 <li>
                    <strong>Install Dependencies:</strong> Open your terminal in the project folder and run <CodeBlock>npm install</CodeBlock>.
                </li>
                <li>
                    <strong>Create a Gemini API Key:</strong> Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google AI Studio</a> to create your API key for the chatbot.
                </li>
                 <li>
                    <strong>Create <CodeBlock>.env</CodeBlock> file:</strong> In the root of your project, create a file named <CodeBlock>.env</CodeBlock>. Inside this file, add your API key like this: <CodeBlock>VITE_API_KEY=YOUR_API_KEY_HERE</CodeBlock>.
                </li>
                 <li>
                    <strong>Run Locally (Optional):</strong> Run <CodeBlock>npm run dev</CodeBlock> to see your portfolio locally at <CodeBlock>http://localhost:5173</CodeBlock>.
                </li>
                <li>
                    <strong>Deploy to Vercel:</strong> Push your code to GitHub, then go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Vercel</a> and import your repository. Vercel will automatically detect it's a Vite project.
                </li>
                <li>
                    <strong>Configure Vercel Environment Variable:</strong> In your Vercel project settings, go to "Environment Variables". Add a new variable with the name <CodeBlock>VITE_API_KEY</CodeBlock> and paste your Gemini API key as the value. Re-deploy if necessary.
                </li>
            </ol>
            <p style={{paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #2c2c2c'}}>
                Remember to edit the <CodeBlock>constants.tsx</CodeBlock> file with your personal information before deploying.
            </p>
        </div>
    );
};

export default DeploymentGuide;