// src/components/Logo.tsx
import React from 'react';
import VibeCheckLogo from '../public/VibeCheck_logo.png';
import '../styles/Logo.css'

const Logo: React.FC = () => {
    return(
        
        <img src={VibeCheckLogo} 
        alt="VibeCheck Logo" 
        className="vibecheck-logo" 
        />
    );

};

export default Logo;