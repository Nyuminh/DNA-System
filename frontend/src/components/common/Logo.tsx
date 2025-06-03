import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  useCustomLogo?: boolean;
  customLogoPath?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  showTagline = false,
  useCustomLogo = false,
  customLogoPath = '/images/logo.jpg'
}) => {  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };const imageSizeMapping = {
    sm: { width: 40, height: 32 },
    md: { width: 50, height: 40 },
    lg: { width: 60, height: 48 },
    xl: { width: 80, height: 64 }
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

  // Custom Image Logo
  const CustomImageLogo = () => (
    <div className={`${sizeClasses[size]} w-auto flex items-center`}>
      <Image
        src={customLogoPath}
        alt="DNA Testing VN Logo"
        width={imageSizeMapping[size].width}
        height={imageSizeMapping[size].height}
        className="object-contain"
        priority
      />
    </div>
  );

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
    </svg>  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        {useCustomLogo ? <CustomImageLogo /> : <DNAIcon />}
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
      {useCustomLogo ? <CustomImageLogo /> : <DNAIcon />}
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
