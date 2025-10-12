import React, { useState } from 'react';
import { getImageUrl } from '../utils/imageProtection';

interface ProfileCardProps {
    theme: 'light' | 'dark';
}

const ProfileCard: React.FC<ProfileCardProps> = ({ theme }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // In dark mode: white front, chill behind
    // In light mode: black front, chill behind
    const frontImage = theme === 'dark' ? getImageUrl('profile_white') : getImageUrl('profile_black');
    const backImage = getImageUrl('profile_chill');

    return (
        <div className="profile-card-wrapper">
            <div className="profile-card-container" onClick={handleFlip}>
                <div className={`profile-card ${isFlipped ? 'flipped' : ''}`}>
                    <div className="profile-card-front">
                        <img 
                            src={frontImage} 
                            alt="Profile"
                            className="protected-image"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = getImageUrl('profile_black');
                            }} 
                        />
                        <div className="flip-hint">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            <span>Click to flip</span>
                        </div>
                    </div>
                    <div className="profile-card-back">
                        <img 
                            src={backImage} 
                            alt="Chill mode"
                            className="protected-image"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                        <div className="flip-hint">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                            <span>Click to flip back</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;

