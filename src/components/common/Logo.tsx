import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  showTagline = false 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const taglineSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  };

  // DNA Helix SVG Icon
  const DNAIcon = () => (
    <svg 
      className={`${sizeClasses[size]} w-auto`}
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* DNA Helix Background Circle */}
      <circle cx="20" cy="20" r="20" fill="url(#gradient)" />
      
      {/* DNA Strands */}
      <path 
        d="M12 8C16 12 16 16 12 20C16 24 16 28 12 32" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M28 8C24 12 24 16 28 20C24 24 24 28 28 32" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* DNA Base Pairs */}
      <line x1="14" y1="10" x2="26" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="14" x2="24" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="18" x2="26" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="22" x2="24" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="26" x2="26" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="30" x2="24" y2="30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Lab Flask SVG Icon (Alternative)
  const FlaskIcon = () => (
    <svg 
      className={`${sizeClasses[size]} w-auto`}
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="url(#gradient2)" />
      
      {/* Flask Body */}
      <path 
        d="M15 12V16L10 28C9.5 29 10.2 30 11.5 30H28.5C29.8 30 30.5 29 30 28L25 16V12H23V10H17V12H15Z" 
        fill="white"
      />
      
      {/* Flask Content (DNA Sample) */}
      <path 
        d="M12 26C12 26 16 24 20 26C24 28 28 26 28 26V28C28 28.5 27.5 29 27 29H13C12.5 29 12 28.5 12 28V26Z" 
        fill="#3B82F6" 
        opacity="0.7"
      />
      
      {/* Flask Neck */}
      <rect x="17" y="10" width="6" height="2" fill="white" />
      
      {/* DNA Particles */}
      <circle cx="16" cy="24" r="1" fill="#1D4ED8" />
      <circle cx="20" cy="22" r="1" fill="#1D4ED8" />
      <circle cx="24" cy="24" r="1" fill="#1D4ED8" />
      
      <defs>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <DNAIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={`font-bold text-secondary-900 ${textSizeClasses[size]}`}>
          DNA Testing VN
        </span>
        {showTagline && (
          <span className={`text-secondary-600 font-medium ${taglineSizeClasses[size]}`}>
            Chuyên nghiệp • Uy tín • Chính xác
          </span>
        )}
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <DNAIcon />
      <div className="flex flex-col">
        <span className={`font-bold text-secondary-900 ${textSizeClasses[size]}`}>
          DNA Testing VN
        </span>
        {showTagline && (
          <span className={`text-secondary-600 font-medium ${taglineSizeClasses[size]}`}>
            Chuyên nghiệp • Uy tín • Chính xác
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
