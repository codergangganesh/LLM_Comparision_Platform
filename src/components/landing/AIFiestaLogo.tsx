'use client'

import React from 'react'

interface AIFiestaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  darkMode?: boolean
  simplified?: boolean
}

export default function AIFiestaLogo({ 
  size = 'md', 
  className = '',
  darkMode = false,
  simplified = false
}: AIFiestaLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const iconSize = {
    sm: '16',
    md: '20',
    lg: '24',
    xl: '32'
  }

  // Create unique IDs for gradients to prevent conflicts
  const bgGradientId = `ai-fiesta-bg-gradient-${Math.random().toString(36).substr(2, 9)}`
  const accentGradientId = `ai-fiesta-accent-gradient-${Math.random().toString(36).substr(2, 9)}`
  const sparkleGradientId = `ai-fiesta-sparkle-gradient-${Math.random().toString(36).substr(2, 9)}`
  const brainGradientId = `ai-fiesta-brain-gradient-${Math.random().toString(36).substr(2, 9)}`

  // Simplified version for smaller sizes
  if (simplified) {
    return (
      <div className={`${sizeClasses[size]} ${className} relative`}>
        <svg 
          width={iconSize[size]} 
          height={iconSize[size]} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={bgGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={darkMode ? "#7C3AED" : "#4F46E5"} />
              <stop offset="50%" stopColor={darkMode ? "#8B5CF6" : "#6366F1"} />
              <stop offset="100%" stopColor={darkMode ? "#A78BFA" : "#8B5CF6"} />
            </linearGradient>
            <linearGradient id={accentGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} />
              <stop offset="100%" stopColor={darkMode ? "#F59E0B" : "#D97706"} />
            </linearGradient>
          </defs>
          
          {/* Simplified background */}
          <circle cx="16" cy="16" r="15" fill={darkMode ? "#111827" : "#F9FAFB"} />
          <circle cx="16" cy="16" r="14" fill={`url(#${bgGradientId})`} />
          
          {/* Simplified brain with gradient */}
          <defs>
            <linearGradient id={brainGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="#F3F4F6" />
            </linearGradient>
          </defs>
          <path 
            d="M16 9C13.5 9 11 10.5 9.5 12.5C8 14.5 8 16.5 9.5 18.5C11 20.5 13.5 22 16 22C18.5 22 21 20.5 22.5 18.5C24 16.5 24 14.5 22.5 12.5C21 10.5 18.5 9 16 9Z" 
            fill={`url(#${brainGradientId})`}
            stroke="white"
            strokeWidth="1"
          />
          
          {/* Central sparkle */}
          <circle cx="16" cy="16" r="2" fill={`url(#${accentGradientId})`} />
        </svg>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg 
        width={iconSize[size]} 
        height={iconSize[size]} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background gradients */}
        <defs>
          <linearGradient id={bgGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#7C3AED" : "#4F46E5"} />
            <stop offset="50%" stopColor={darkMode ? "#8B5CF6" : "#6366F1"} />
            <stop offset="100%" stopColor={darkMode ? "#A78BFA" : "#8B5CF6"} />
          </linearGradient>
          <linearGradient id={accentGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} />
            <stop offset="100%" stopColor={darkMode ? "#F59E0B" : "#D97706"} />
          </linearGradient>
          <linearGradient id={sparkleGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#FDE68A" : "#FBBF24"} />
            <stop offset="100%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} />
          </linearGradient>
          <linearGradient id={brainGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
        </defs>
        
        {/* Main background with subtle shadow */}
        <circle cx="16" cy="16" r="15" fill={darkMode ? "#111827" : "#F9FAFB"} />
        <circle cx="16" cy="16" r="14" fill={`url(#${bgGradientId})`} />
        
        {/* Brain shape with enhanced details and gradient */}
        <path 
          d="M16 7C13 7 10.5 8.5 9 10.5C7.5 12.5 7 14.5 7 16.5C7 18.5 7.5 20.5 9 22.5C10.5 24.5 13 26 16 26C19 26 21.5 24.5 23 22.5C24.5 20.5 25 18.5 25 16.5C25 14.5 24.5 12.5 23 10.5C21.5 8.5 19 7 16 7Z" 
          fill={`url(#${brainGradientId})`}
          opacity="0.9"
        />
        <path 
          d="M16 7C13 7 10.5 8.5 9 10.5C7.5 12.5 7 14.5 7 16.5C7 18.5 7.5 20.5 9 22.5C10.5 24.5 13 26 16 26C19 26 21.5 24.5 23 22.5C24.5 20.5 25 18.5 25 16.5C25 14.5 24.5 12.5 23 10.5C21.5 8.5 19 7 16 7Z" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Enhanced brain details */}
        <path 
          d="M12 12C12.5 10.5 13.5 9.5 15 9.5C16.5 9.5 17.5 10.5 18 12" 
          stroke="#6B7280" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M11 15.5C11.5 14 12.5 13 14 13C15.5 13 16.5 14 17 15.5" 
          stroke="#6B7280" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M12 19C12.5 20.5 13.5 21.5 15 21.5C16.5 21.5 17.5 20.5 18 19" 
          stroke="#6B7280" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Comparison elements - left side */}
        <path 
          d="M5 13L8 16L5 19" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="3" cy="16" r="1.5" fill="white" />
        
        {/* Comparison elements - right side */}
        <path 
          d="M27 13L24 16L27 19" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="29" cy="16" r="1.5" fill="white" />
        
        {/* Celebration sparkles with gradient */}
        <circle cx="4" cy="4" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="28" cy="4" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="4" cy="28" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="28" cy="28" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="16" cy="2" r="1.5" fill={`url(#${sparkleGradientId})`} />
        <circle cx="16" cy="30" r="1.5" fill={`url(#${sparkleGradientId})`} />
        <circle cx="2" cy="16" r="1.5" fill={`url(#${sparkleGradientId})`} />
        <circle cx="30" cy="16" r="1.5" fill={`url(#${sparkleGradientId})`} />
        
        {/* Central sparkle */}
        <circle cx="16" cy="16" r="2" fill={`url(#${accentGradientId})`} />
        
        {/* Outer glow effect */}
        <circle cx="16" cy="16" r="16" fill="none" stroke={`url(#${accentGradientId})`} strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  )
}