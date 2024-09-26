import React from 'react';

interface LoadingSpinnerProps {
    size?: string; 
    color?: string;   
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "text-lg", color = "text-primary" }) => {
    return (
        <span className={`loading loading-spinner ${size} ${color}`}>
           
        </span>
    );
};

export default LoadingSpinner;
