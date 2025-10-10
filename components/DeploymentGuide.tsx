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
                    <strong>Sign up for Vercel:</strong> Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Vercel</a> and sign up using your GitHub account.
                </li>
                <li>
                    <strong>Create a Gemini API Key:</strong> Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google AI Studio</a> to create your API key for the chatbot.
                </li>
                <li>
                    <strong>Create a New Vercel Project:</strong> In your Vercel dashboard, click "Add New... &gt; Project". Import the GitHub repository you created in step 1.
                </li>
                <li>
                    <strong>Configure Environment Variable:</strong> In the project settings, go to the "Environment Variables" section. Add a new variable with the name <CodeBlock>API_KEY</CodeBlock> and paste the Gemini API key you got in step 3 as the value.
                </li>
                 <li>
                    <strong>Deploy:</strong> Click the "Deploy" button. Vercel will build and deploy your site. Once it's finished, you'll have a live URL for your new portfolio!
                </li>
            </ol>
            <p style={{paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #2c2c2c'}}>
                Remember to edit the <CodeBlock>constants.tsx</CodeBlock> file with your personal information before deploying.
            </p>
        </div>
    );
};

export default DeploymentGuide;