'use client'

import ModernAuthForm from '@/components/auth/ModernAuthForm'
import AuthIllustration from '@/components/auth/AuthIllustration'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to chat
  useEffect(() => {
    if (user) {
      router.push('/chat')
    }
  }, [user, router])

  if (user) {
    return null // or a loading spinner while redirecting
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background with image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image with animation */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 animate-pulse-slow"
          style={{ 
            backgroundImage: "url('/image.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: 'zoomPan 20s infinite alternate'
          }}
        ></div>
        
        {/* Overlay with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-black/70 to-fuchsia-900/40 animate-gradient-rotate"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                background: `rgba(${Math.random() > 0.5 ? '139, 92, 246' : '217, 70, 239'}, ${Math.random() * 0.4 + 0.1})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating card with enhanced glowing edges */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Illustration */}
          <div className="hidden lg:block">
            <AuthIllustration />
          </div>

          {/* Auth Form - Modern sleek design with enhanced glowing effect */}
          <div className="relative bg-gradient-to-br from-black via-gray-900/80 to-black rounded-3xl p-8 shadow-2xl border border-violet-500/20 backdrop-blur-xl transform transition-all duration-500 hover:scale-[1.02]">
            {/* Enhanced multi-layered glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl blur opacity-40 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-800/30 via-purple-800/20 to-fuchsia-800/30 rounded-3xl blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Inner content with sleek design */}
            <div className="relative bg-black/90 backdrop-blur-2xl rounded-2xl p-8 border border-violet-500/30 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse-glow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent animate-text-glow">
                    AI Fiesta
                  </h1>
                </Link>
                
                <Link 
                  href="/" 
                  className="text-violet-300 hover:text-violet-200 text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-violet-900/20 border border-violet-500/20 animate-border-glow"
                >
                  Back to Home
                </Link>
              </div>

              <ModernAuthForm />
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes zoomPan {
          0% {
            transform: scale(1) translate(0, 0);
            background-position: center;
          }
          25% {
            transform: scale(1.05) translate(1%, 1%);
            background-position: 55% 45%;
          }
          50% {
            transform: scale(1.1) translate(-1%, 1%);
            background-position: 45% 55%;
          }
          75% {
            transform: scale(1.05) translate(1%, -1%);
            background-position: 55% 45%;
          }
          100% {
            transform: scale(1) translate(0, 0);
            background-position: center;
          }
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(180deg);
            opacity: 0.6;
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
            opacity: 0.2;
          }
        }
        
        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse 8s infinite alternate;
        }
        
        .animate-gradient-rotate {
          background-size: 200% 200%;
          animation: gradient-rotate 15s ease infinite;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse 3s infinite;
        }
        
        .animate-text-glow {
          animation: pulse 4s infinite;
        }
        
        .animate-border-glow {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}