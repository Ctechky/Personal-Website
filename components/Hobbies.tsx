import React from 'react';
import type { Hobby } from '../types';
import { getImageUrl } from '../utils/imageProtection';

interface HobbiesProps {
  hobbies: Hobby[];
}

const Hobbies: React.FC<HobbiesProps> = ({ hobbies }) => {
  return (
    <div className="hobbies-container">
      {hobbies.map((hobby, index) => (
        <div 
          key={index} 
          className="hobby-card"
          style={hobby.image ? {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getImageUrl(hobby.image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <div className="hobby-content">
            <h3 className="hobby-name">{hobby.name}</h3>
            {hobby.description && (
              <p className="hobby-description">{hobby.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hobbies;

