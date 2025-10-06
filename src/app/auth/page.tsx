'use client'

import ModernAuthForm from '@/components/auth/ModernAuthForm'
import AuthIllustration from '@/components/auth/AuthIllustration'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AIFiestaLogo from '@/components/landing/AIFiestaLogo'

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
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ 
            backgroundImage: "url('/image.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
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
                  <AIFiestaLogo size="lg" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                    AI Fiesta
                  </h1>
                </Link>
                
                <Link 
                  href="/" 
                  className="text-violet-300 hover:text-violet-200 text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-violet-900/20 border border-violet-500/20"
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
        @keyframes float-subtle {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-float-subtle {
          animation: float-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}