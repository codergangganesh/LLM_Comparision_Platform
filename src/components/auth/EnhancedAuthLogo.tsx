'use client'

import React from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface EnhancedAuthLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function EnhancedAuthLogo({ 
  size = 'md', 
  className = ''
}: EnhancedAuthLogoProps) {
  const { darkMode } = useDarkMode()

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const iconSize = {
    sm: '20',
    md: '24',
    lg: '32',
    xl: '40'
  }

  // Create unique IDs for gradients to prevent conflicts
  const bgGradientId = `enhanced-auth-bg-${Math.random().toString(36).substr(2, 9)}`
  const leftModelGradientId = `left-model-${Math.random().toString(36).substr(2, 9)}`
  const rightModelGradientId = `right-model-${Math.random().toString(36).substr(2, 9)}`
  const comparisonGradientId = `comparison-${Math.random().toString(36).substr(2, 9)}`
  const sparkleGradientId = `sparkle-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg 
        width={iconSize[size]} 
        height={iconSize[size]} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={bgGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#8B5CF6" : "#7C3AED"} />
            <stop offset="50%" stopColor={darkMode ? "#A78BFA" : "#8B5CF6"} />
            <stop offset="100%" stopColor={darkMode ? "#C4B5FD" : "#A78BFA"} />
          </linearGradient>
          
          <linearGradient id={leftModelGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#60A5FA" : "#3B82F6"} />
            <stop offset="100%" stopColor={darkMode ? "#3B82F6" : "#2563EB"} />
          </linearGradient>
          
          <linearGradient id={rightModelGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#10B981" : "#059669"} />
            <stop offset="100%" stopColor={darkMode ? "#059669" : "#047857"} />
          </linearGradient>
          
          <linearGradient id={comparisonGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} />
            <stop offset="100%" stopColor={darkMode ? "#F59E0B" : "#D97706"} />
          </linearGradient>
          
          <linearGradient id={sparkleGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? "#FDE68A" : "#FBBF24"} />
            <stop offset="100%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} />
          </linearGradient>
        </defs>
        
        {/* Background circle with gradient */}
        <circle cx="20" cy="20" r="19" fill={`url(#${bgGradientId})`} />
        <circle cx="20" cy="20" r="18" fill="none" stroke={darkMode ? "white" : "white"} strokeWidth="0.5" opacity={darkMode ? "0.3" : "0.2"} />
        
        {/* Left AI Model - Blue */}
        <g transform="translate(8, 12)">
          <rect x="0" y="0" width="10" height="16" rx="2" fill={`url(#${leftModelGradientId})`} />
          <rect x="1" y="1" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.7" : "0.8"} />
          <rect x="1" y="4" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.5" : "0.6"} />
          <rect x="1" y="7" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.5" : "0.6"} />
          <rect x="1" y="10" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.3" : "0.4"} />
          <rect x="1" y="13" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.3" : "0.4"} />
        </g>
        
        {/* Right AI Model - Green */}
        <g transform="translate(22, 12)">
          <rect x="0" y="0" width="10" height="16" rx="2" fill={`url(#${rightModelGradientId})`} />
          <rect x="1" y="1" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.7" : "0.8"} />
          <rect x="1" y="4" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.5" : "0.6"} />
          <rect x="1" y="7" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.5" : "0.6"} />
          <rect x="1" y="10" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.3" : "0.4"} />
          <rect x="1" y="13" width="8" height="2" rx="1" fill="white" opacity={darkMode ? "0.3" : "0.4"} />
        </g>
        
        {/* Comparison Arrows */}
        <path 
          d="M18 15L22 20L18 25" 
          stroke={`url(#${comparisonGradientId})`} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M22 15L18 20L22 25" 
          stroke={`url(#${comparisonGradientId})`} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Central comparison node */}
        <circle cx="20" cy="20" r="3" fill={`url(#${comparisonGradientId})`} />
        <circle cx="20" cy="20" r="3" fill="none" stroke="white" strokeWidth="0.5" opacity={darkMode ? "0.5" : "0.3"} />
        
        {/* Sparkles for celebration effect */}
        <circle cx="5" cy="5" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="35" cy="5" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="5" cy="35" r="1" fill={`url(#${sparkleGradientId})`} />
        <circle cx="35" cy="35" r="1" fill={`url(#${sparkleGradientId})`} />
        
        {/* Outer glow effect */}
        <circle cx="20" cy="20" r="20" fill="none" stroke={`url(#${comparisonGradientId})`} strokeWidth="0.5" opacity={darkMode ? "0.2" : "0.1"} />
      </svg>
    </div>
  )
}