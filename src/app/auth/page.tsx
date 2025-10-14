'use client'

import ModernAuthForm from '@/components/auth/ModernAuthForm'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'
import AIFiestaLogo from '@/components/landing/AIFiestaLogo'
import EnhancedAuthLogo from '@/components/auth/EnhancedAuthLogo'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function AuthPage() {
  const { user, loading } = useAuth()
  const router = useOptimizedRouter()
  const { setPageLoading } = useOptimizedLoading()
  const { darkMode } = useDarkMode()

  // Redirect authenticated users to chat
  useEffect(() => {
    if (user) {
      setPageLoading(true, "Redirecting to chat...");
      router.push('/chat')
    } else if (!user && !loading) {
      setPageLoading(false);
    }
  }, [user, router, loading, setPageLoading])

  // Show loading while checking auth status
  if (loading) {
    return <OptimizedPageTransitionLoader message="Loading authentication..." />;
  }

  if (user) {
    return null // or a loading spinner while redirecting
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden relative ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'}`}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,rgba(255,255,255,0)_70%)]'}`}></div>
        
        {/* Floating particles */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-violet-500/10' : 'bg-violet-300/20'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'}`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-3/4 left-1/2 w-48 h-48 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-fuchsia-500/10' : 'bg-fuchsia-300/20'}`} style={{ animationDelay: '4s' }}></div>
        
        {/* Geometric shapes */}
        <div className={`absolute top-1/3 right-1/3 w-16 h-16 rounded-lg rotate-45 animate-bounce ${darkMode ? 'bg-violet-500/20' : 'bg-violet-300/30'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-1/3 left-1/5 w-12 h-12 rounded-full animate-bounce ${darkMode ? 'bg-purple-500/20' : 'bg-purple-300/30'}`} style={{ animationDelay: '3s' }}></div>
        
        {/* New floating neural network elements */}
        <div className="absolute top-1/5 left-1/5 w-32 h-32">
          <div className={`absolute w-full h-full rounded-full animate-ping ${darkMode ? 'border-2 border-violet-500/20' : 'border-2 border-violet-300/30'}`} style={{ animationDuration: '4s' }}></div>
          <div className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-violet-500' : 'bg-violet-400'}`}></div>
          <div className={`absolute top-0 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-float-subtle ${darkMode ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
          <div className={`absolute top-1/2 left-0 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-float-subtle ${darkMode ? 'bg-fuchsia-500' : 'bg-fuchsia-400'}`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-0 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-float-subtle ${darkMode ? 'bg-indigo-500' : 'bg-indigo-400'}`} style={{ animationDelay: '2s' }}></div>
          <div className={`absolute top-1/2 right-0 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-float-subtle ${darkMode ? 'bg-violet-400' : 'bg-violet-300'}`} style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="absolute bottom-1/5 right-1/3 w-24 h-24">
          <div className={`absolute w-full h-full rounded-full animate-ping ${darkMode ? 'border-2 border-purple-500/20' : 'border-2 border-purple-300/30'}`} style={{ animationDuration: '5s' }}></div>
          <div className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
          <div className={`absolute top-0 left-0 w-3 h-3 rounded-full animate-float-subtle ${darkMode ? 'bg-fuchsia-500' : 'bg-fuchsia-400'}`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full animate-float-subtle ${darkMode ? 'bg-violet-400' : 'bg-violet-300'}`} style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Floating card with enhanced glowing edges */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Illustration Section - Enhanced with full-page elements */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-10">
            <div className="relative w-full max-w-lg">
              {/* Main illustration with glowing effect */}
              <div className="relative z-10">
                <div className={`rounded-3xl p-12 backdrop-blur-xl shadow-2xl ${darkMode ? 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30' : 'bg-gradient-to-br from-violet-200/30 to-purple-200/30 border border-violet-300/50'}`}>
                  <div className={`rounded-2xl p-8 border ${darkMode ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-100/50 to-purple-100/50 border-violet-300/30'}`}>
                    {/* Modern AI illustration */}
                    <div className="relative">
                      {/* Central brain with connections */}
                      <div className={`relative mx-auto w-48 h-48 rounded-full flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30' : 'bg-gradient-to-br from-violet-200/50 to-purple-200/50 border border-violet-300/50'}`}>
                        <div className={`absolute inset-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20' : 'bg-gradient-to-br from-violet-100/70 to-purple-100/70 border border-violet-300/40'}`}>
                          {/* Using the new enhanced logo */}
                          <EnhancedAuthLogo size="xl" />
                        </div>
                        
                        {/* Connecting lines */}
                        <div className={`absolute top-0 left-1/2 w-1 h-12 bg-gradient-to-b transform -translate-x-1/2 ${darkMode ? 'from-violet-500/50 to-transparent' : 'from-violet-400/50 to-transparent'}`}></div>
                        <div className={`absolute bottom-0 left-1/2 w-1 h-12 bg-gradient-to-t transform -translate-x-1/2 ${darkMode ? 'from-violet-500/50 to-transparent' : 'from-violet-400/50 to-transparent'}`}></div>
                        <div className={`absolute left-0 top-1/2 w-12 h-1 bg-gradient-to-r transform -translate-y-1/2 ${darkMode ? 'from-violet-500/50 to-transparent' : 'from-violet-400/50 to-transparent'}`}></div>
                        <div className={`absolute right-0 top-1/2 w-12 h-1 bg-gradient-to-l transform -translate-y-1/2 ${darkMode ? 'from-violet-500/50 to-transparent' : 'from-violet-400/50 to-transparent'}`}></div>
                        
                        {/* Corner nodes */}
                        <div className={`absolute top-4 left-4 w-4 h-4 rounded-full animate-pulse ${darkMode ? 'bg-violet-500' : 'bg-violet-400'}`}></div>
                        <div className={`absolute top-4 right-4 w-4 h-4 rounded-full animate-pulse ${darkMode ? 'bg-purple-500' : 'bg-purple-400'}`} style={{ animationDelay: '0.5s' }}></div>
                        <div className={`absolute bottom-4 left-4 w-4 h-4 rounded-full animate-pulse ${darkMode ? 'bg-fuchsia-500' : 'bg-fuchsia-400'}`} style={{ animationDelay: '1s' }}></div>
                        <div className={`absolute bottom-4 right-4 w-4 h-4 rounded-full animate-pulse ${darkMode ? 'bg-indigo-500' : 'bg-indigo-400'}`} style={{ animationDelay: '1.5s' }}></div>
                      </div>
                      
                      {/* Orbiting elements */}
                      <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full animate-spin-slow ${darkMode ? 'border border-violet-500/20' : 'border border-violet-300/40'}`} style={{ animationDuration: '20s' }}>
                        <div className={`absolute top-0 left-1/2 w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-violet-500' : 'bg-violet-400'}`}>
                          <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-100'}`}></div>
                        </div>
                      </div>
                      
                      <div className={`absolute top-1/2 left-1/2 w-80 h-80 rounded-full animate-spin-slow ${darkMode ? 'border border-purple-500/20' : 'border border-purple-300/40'}`} style={{ animationDuration: '25s' }}>
                        <div className={`absolute bottom-0 left-1/2 w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'}`}>
                          <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-100'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements around illustration */}
              <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-2xl rotate-12 animate-float-subtle backdrop-blur-sm ${darkMode ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-violet-200/40 border border-violet-300/50'}`}></div>
              <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full -rotate-12 animate-float-subtle backdrop-blur-sm ${darkMode ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-200/40 border border-purple-300/50'}`} style={{ animationDelay: '1s' }}></div>
              <div className={`absolute top-1/3 -right-12 w-16 h-16 rounded-lg rotate-45 animate-float-subtle backdrop-blur-sm ${darkMode ? 'bg-fuchsia-500/20 border border-fuchsia-500/30' : 'bg-fuchsia-200/40 border border-fuchsia-300/50'}`} style={{ animationDelay: '2s' }}></div>
            </div>
            
            {/* Website description */}
            <div className="text-center max-w-2xl">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'}`}>
                Compare AI Models Instantly
              </h2>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI Fiesta is your ultimate platform for comparing the performance, speed, and accuracy of leading AI models. 
                Test multiple models side-by-side with a single prompt and discover which one delivers the best results for your needs.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className={`rounded-xl p-4 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/70 border border-gray-200/50'}`}>
                  <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>9+</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Models</div>
                </div>
                <div className={`rounded-xl p-4 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/70 border border-gray-200/50'}`}>
                  <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>&lt;1s</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Response</div>
                </div>
                <div className={`rounded-xl p-4 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/70 border border-gray-200/50'}`}>
                  <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}>Free</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Access</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form - Modern sleek design with enhanced glowing effect */}
          <div className={`relative rounded-3xl p-10 shadow-2xl backdrop-blur-2xl transform transition-all duration-500 hover:scale-[1.01] ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-violet-500/20' : 'bg-gradient-to-br from-white via-gray-50 to-white border border-violet-300/50'}`}>
            {/* Enhanced multi-layered glowing border effect */}
            {darkMode ? (
              <>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl blur opacity-40 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-800/30 via-purple-800/20 to-fuchsia-800/30 rounded-3xl blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </>
            ) : (
              <>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 rounded-3xl blur opacity-30 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-200/40 via-purple-200/30 to-fuchsia-200/40 rounded-3xl blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </>
            )}
            
            {/* Inner content with sleek design */}
            <div className={`relative rounded-2xl p-10 shadow-2xl ${darkMode ? 'bg-gradient-to-br from-gray-900/90 to-black/90 border border-violet-500/30' : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-violet-300/50'}`}>
              <div className="flex justify-between items-center mb-10">
                <Link href="/" className="flex items-center space-x-3">
                  {/* Using the new enhanced logo in the header */}
                  <EnhancedAuthLogo size="xl" />
                  <h1 className={`text-4xl font-bold ${darkMode ? 'bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-600 bg-clip-text text-transparent'}`}>
                    AI Fiesta
                  </h1>
                </Link>
                
                <Link 
                  href="/" 
                  className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-xl backdrop-blur-sm ${darkMode ? 'text-violet-300 hover:text-violet-200 border border-violet-500/20 hover:bg-violet-900/20' : 'text-violet-600 hover:text-violet-700 border border-violet-300/50 hover:bg-violet-100/50'}`}
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
            transform: translateY(-20px) rotate(2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-float-subtle {
          animation: float-subtle 6s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .animate-spin-slow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: spin-slow linear infinite;
        }
      `}</style>
    </div>
  )
}