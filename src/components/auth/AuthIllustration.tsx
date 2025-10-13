'use client'

import React from 'react'

const AuthIllustration = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      {/* Website information section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent mb-4">
          AI Fiesta
        </h1>
        <blockquote className="text-lg italic text-violet-200/90 max-w-md mx-auto mb-6 border-l-2 border-violet-500/50 pl-6">
          &quot;Where AI Models Compete, Innovation Ignites&quot;
        </blockquote>
        <div className="text-violet-300/80 max-w-lg mx-auto space-y-4">
          <p>
            AI Fiesta is a cutting-edge platform that allows you to compare and evaluate different AI models side-by-side. 
            Experience the power of artificial intelligence as various models compete to provide the best responses to your queries.
          </p>
          <p>
            Our platform offers real-time comparisons, detailed performance analytics, and an intuitive interface designed for 
            researchers, developers, and AI enthusiasts to explore the capabilities of modern AI technologies.
          </p>
        </div>
      </div>

      {/* Illustration container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glowing background elements with violet-black theme */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/30 to-purple-500/30 blur-2xl animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-500/40 to-fuchsia-500/40 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Holographic panels with violet theme */}
        <div className="absolute w-32 h-32 border border-violet-400/50 rounded-xl transform rotate-45 backdrop-blur-sm">
          <div className="absolute inset-0 border border-violet-300/30 rounded-xl"></div>
        </div>
        
        <div className="absolute w-24 h-24 border border-purple-400/50 rounded-lg transform -rotate-12 backdrop-blur-sm">
          <div className="absolute inset-0 border border-purple-300/30 rounded-lg"></div>
        </div>
        
        {/* Floating lock icon with violet theme */}
        <div className="relative z-10 w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl transform rotate-12 animate-float-subtle shadow-lg shadow-violet-500/30"></div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>
        
        {/* Glowing lines with violet theme */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent bottom-8 animate-pulse"></div>
        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent left-8 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Particles with violet theme */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-10 right-4 w-1 h-1 bg-fuchsia-300 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  )
}

export default AuthIllustration