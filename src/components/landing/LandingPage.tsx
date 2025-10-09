'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useLoading } from '@/contexts/LoadingContext'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, MessageSquare, Zap, BarChart3, Shield, Clock, Users, Brain, Sparkles, Star, ChevronRight, Play, Globe, TrendingUp, Award, Infinity, Cpu, Layers, GitBranch, Settings as SettingsIcon, LogOut, Moon, Sun, DollarSign, MessageCircle } from 'lucide-react'
import ModernModelShowcase from './ModernModelShowcase'
import ModernFeedbackAndPricing from './ModernFeedbackAndPricing'
import { useEffect, useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import AllModelsOverlay from './AllModelsOverlay' // Fixed the import path
import AIFiestaLogo from './AIFiestaLogo'
import VideoTutorialPopup from './VideoTutorialPopup'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  gradient: string
  stats: string
}

interface Step {
  number: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export default function LandingPage() {
  const { user, signOut } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const router = useOptimizedRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showAllModels, setShowAllModels] = useState(false)
  const [showVideoTutorial, setShowVideoTutorial] = useState(false)
  const searchParams = useSearchParams()

  const features: Feature[] = [
    {
      icon: MessageSquare,
      title: 'Universal Input',
      description: 'One message box sends to all selected AI models simultaneously. No need to repeat yourself.',
      gradient: 'from-blue-500 to-cyan-500',
      stats: '1 Input → 9+ Models'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses from multiple AI models in real-time with optimized parallel processing.',
      gradient: 'from-yellow-500 to-orange-500',
      stats: '<0.5s Response Time'
    },
    {
      icon: BarChart3,
      title: 'Smart Comparison',
      description: 'Side-by-side cards make it easy to compare quality, style, and accuracy of responses.',
      gradient: 'from-green-500 to-emerald-500',
      stats: 'Visual Side-by-Side'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted storage and user authentication.',
      gradient: 'from-purple-500 to-violet-500',
      stats: 'End-to-End Encrypted'
    },
    {
      icon: Clock,
      title: 'Fast Responses',
      description: 'Get instant responses from multiple AI models simultaneously with optimized performance.',
      gradient: 'from-pink-500 to-rose-500',
      stats: 'Under 1 Second'
    },
    {
      icon: Users,
      title: 'Premium Models',
      description: 'Access to cutting-edge AI models including GPT-5, Claude 4, and emerging models.',
      gradient: 'from-indigo-500 to-blue-500',
      stats: '9+ AI Providers'
    }
  ]

  const steps: Step[] = [
    {
      number: '01',
      title: 'Choose Your Models',
      description: 'Select from 9+ premium AI models using our intuitive model selector.',
      icon: Brain
    },
    {
      number: '02',
      title: 'Send One Message',
      description: 'Type your question once and watch it reach all selected models instantly.',
      icon: MessageSquare
    },
    {
      number: '03',
      title: 'Compare & Choose',
      description: 'Review responses side-by-side and mark the best one for future reference.',
      icon: Star
    }
  ]

  // Listen for the custom event to open the overlay
  useEffect(() => {
    const handleOpenAllModelsOverlay = () => {
      setShowAllModels(true)
    }

    window.addEventListener('openAllModelsOverlay', handleOpenAllModelsOverlay)

    return () => {
      window.removeEventListener('openAllModelsOverlay', handleOpenAllModelsOverlay)
    }
  }, [])

  // Check for success message in URL parameters
  useEffect(() => {
    const deleted = searchParams.get('deleted')
    const message = searchParams.get('message')

    if (deleted && message) {
      setPopupMessage(decodeURIComponent(message))
      setShowSuccessPopup(true)

      // Auto-hide the popup after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessPopup(false)
        // Remove the parameters from the URL
        window.history.replaceState({}, document.title, '/')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  }

  const getProfilePicture = () => {
    // Check if avatar_url exists in user_metadata
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    // If not, return null (the avatar_url does not exist directly on the user object)
    return null;
  };

  const handleSignOut = async () => {
    try {
      await signOut(showLoading, hideLoading);
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/chat');
    } else {
      router.push('/auth');
    }
  };

  const handleGoToChat = () => {
    router.push('/chat');
  };

  const profilePicture = getProfilePicture();

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${darkMode
        ? 'bg-gradient-to-br from-gray-900 via-violet-900/90 to-black'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
      {/* Add the AllModelsOverlay component */}
      <AllModelsOverlay
        show={showAllModels}
        onClose={() => setShowAllModels(false)}
        darkMode={darkMode}
      />

      {/* Add the VideoTutorialPopup component */}
      <VideoTutorialPopup
        isOpen={showVideoTutorial}
        onClose={() => setShowVideoTutorial(false)}
      />

      {/* Enhanced Glowing effect overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-violet-500/20' : 'bg-blue-400/30'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse ${darkMode ? 'bg-blue-500/15' : 'bg-pink-400/20'}`} style={{ animationDelay: '2s' }}></div>
        
        {/* Additional ambient lights for more depth */}
        <div className={`absolute top-1/3 right-1/3 w-64 h-64 rounded-full blur-3xl ${darkMode ? 'bg-indigo-500/10' : 'bg-cyan-300/20'}`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full blur-3xl ${darkMode ? 'bg-pink-500/10' : 'bg-orange-300/20'}`} style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Success Message Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-[100] animate-fade-in">
          <div className={`border backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in transform transition-all duration-300 hover:scale-105 ${
            darkMode 
              ? 'bg-gray-800/80 border-gray-700/50 text-green-400' 
              : 'bg-white/80 border-green-200 text-green-700'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <svg className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>Success!</div>
              <div className="text-sm font-medium">{popupMessage}</div>
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className={`ml-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-green-500 hover:text-green-700'}`}
              aria-label="Close notification"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header - Made sticky */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        darkMode
          ? 'bg-gray-900/70 border-gray-800/50 shadow-xl'
          : 'bg-white/70 border-slate-200/50 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo that redirects to Chat section */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <AIFiestaLogo size="md" darkMode={darkMode} simplified />
                <h1 className={`text-2xl font-bold bg-gradient-to-r transition-all duration-300 ${
                  darkMode
                    ? 'from-white to-gray-300'
                    : 'from-slate-900 to-slate-700'
                } bg-clip-text text-transparent`}>
                  AI Fiesta
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Pricing button with modern text design */}
                  <button
                    onClick={openPaymentPopup}
                    className="relative px-4 py-2 rounded-full font-bold transition-all duration-300 group overflow-hidden flex items-center space-x-2 backdrop-blur-sm"
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 rounded-full">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                        darkMode 
                          ? 'from-yellow-500/20 to-amber-600/20' 
                          : 'from-yellow-400/30 to-yellow-600/30'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>

                    {/* Modern text styling */}
                    <span className={`relative text-sm font-semibold bg-gradient-to-r transition-all duration-300 ${
                      darkMode
                        ? 'from-gray-100 to-gray-300 group-hover:from-yellow-300 group-hover:to-yellow-100'
                        : 'from-slate-800 to-slate-900 group-hover:from-yellow-600 group-hover:to-yellow-800'
                    } bg-clip-text text-transparent`}>
                      Pricing
                    </span>
                  </button>

                  {/* Profile icon for logged-in users */}
                  <div className="flex items-center space-x-2">
                    {/* Dark mode toggle button */}
                    <button
                      onClick={toggleDarkMode}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        darkMode
                          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 shadow-lg shadow-gray-900/30'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 shadow-md shadow-gray-300/30'
                      }`}
                      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="relative group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-105 ${
                        darkMode 
                          ? 'bg-gradient-to-br from-violet-600 to-purple-700 ring-2 ring-white/30 shadow-lg shadow-violet-500/20' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
                      }`}
                      >
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className={darkMode ? 'text-white' : 'text-white'}>
                            {getUserInitials()}
                          </span>
                        )}
                      </div>
                      {/* Dropdown menu */}
                      <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-xl ${
                        darkMode
                          ? 'bg-gray-800/90 border border-gray-700/50'
                          : 'bg-white/90 border border-slate-200/50'
                      }`}>
                        <Link
                          href="/chat"
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? 'text-gray-200 hover:bg-gray-700/80'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}>
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? 'text-gray-200 hover:bg-gray-700/80'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}>
                          <SettingsIcon className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <div className={`border-t my-2 ${
                          darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
                        }`}></div>

                        <button
                          onClick={handleSignOut}
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 w-full text-left ${
                            darkMode
                              ? 'text-red-200 hover:bg-red-700/80'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}>
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Dark mode toggle button for non-logged-in users */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      darkMode
                        ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 shadow-lg shadow-gray-900/30'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 shadow-md shadow-gray-300/30'
                    }`}
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Sign in button for non-logged-in users */}
                  <button
                    onClick={handleGoToChat}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                      darkMode
                        ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-500/20'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                    }`}
                  >
                   Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-violet-500/20' : 'bg-blue-400/30'}`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'}`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse ${darkMode ? 'bg-blue-500/15' : 'bg-pink-400/20'}`} style={{ animationDelay: '2s' }}></div>

          {/* Floating geometric shapes */}
          <div className={`absolute top-1/3 right-1/3 w-8 h-8 rounded-lg rotate-45 animate-bounce ${darkMode
              ? 'bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30'
              : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30'
            }`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute bottom-1/3 left-1/5 w-6 h-6 rounded-full animate-bounce ${darkMode
              ? 'bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30'
              : 'bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/30'
            }`} style={{ animationDelay: '1.5s' }}></div>
          <div className={`absolute top-1/2 left-3/4 w-4 h-12 rounded-full animate-pulse ${darkMode
              ? 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
              : 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
            }`} style={{ animationDelay: '0.8s' }}></div>
          
          {/* Additional floating elements for more depth */}
          <div className={`absolute top-1/4 right-1/4 w-6 h-6 rounded-full animate-ping ${darkMode
              ? 'bg-gradient-to-br from-indigo-500 to-blue-500'
              : 'bg-gradient-to-br from-indigo-400 to-blue-400'
            }`} style={{ animationDelay: '2.5s' }}></div>
          <div className={`absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full animate-pulse ${darkMode
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-purple-400 to-pink-400'
            }`} style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge with enhanced glowing effect */}
            <div className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 relative overflow-hidden transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
                : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Sparkles className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Compare 9+ Premium AI Models
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8">
              <span className={`bg-gradient-to-r transition-all duration-500 ${
                darkMode
                  ? 'from-white via-blue-200 to-purple-200'
                  : 'from-slate-900 via-blue-800 to-purple-800'
              } bg-clip-text text-transparent`}>
                AI Model
              </span>
              <br />
              <span className={`bg-gradient-to-r transition-all duration-500 ${
                darkMode
                  ? 'from-blue-400 via-purple-400 to-pink-400'
                  : 'from-blue-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent`}>
                Comparison
              </span>
              <br />
              <span className={`bg-gradient-to-r transition-all duration-500 ${
                darkMode
                  ? 'from-white to-gray-300'
                  : 'from-slate-900 to-slate-700'
              } bg-clip-text text-transparent`}>
                Made Simple
              </span>
            </h1>

            <p className={`text-xl sm:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Send one message to multiple AI models and compare their responses instantly.
              <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Find the perfect AI
              </span> for every task.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={user ? handleGoToChat : handleGetStarted}
                className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 relative overflow-hidden backdrop-blur-sm"
              >
                {/* Enhanced glowing effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Comparing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
              </button>

              <div className={`flex items-center space-x-4 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-gray-900 shadow-lg shadow-blue-500/30' 
                        : 'bg-gradient-to-br from-blue-400 to-purple-500 border-white shadow-lg shadow-blue-500/30'
                    }`}></div>
                  ))}
                </div>
                <span className="text-sm font-semibold">9+ AI Models Available</span>
              </div>
            </div>

            {/* Enhanced Stats with more advanced glowing effect */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                  : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                  darkMode ? 'shadow-blue-500/30' : 'shadow-blue-500/30'
                }`}>
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 relative z-10 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  9+
                </div>
                <div className={`text-sm font-semibold relative z-10 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  AI Models
                </div>
              </div>
              <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                  : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className={`w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                  darkMode ? 'shadow-green-500/30' : 'shadow-green-500/30'
                }`}>
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 relative z-10 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  1
                </div>
                <div className={`text-sm font-semibold relative z-10 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Universal Input
                </div>
              </div>
              <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                  : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className={`w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                  darkMode ? 'shadow-pink-500/30' : 'shadow-pink-500/30'
                }`}>
                  <Infinity className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 relative z-10 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  ∞
                </div>
                <div className={`text-sm font-semibold relative z-10 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Comparisons
                </div>
              </div>
              <div className={`group text-center p-6 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                darkMode
                  ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 shadow-lg shadow-violet-500/10'
                  : 'bg-white/60 border-white/30 hover:bg-white/80 shadow-lg shadow-blue-500/10'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className={`w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10 shadow-lg ${
                  darkMode ? 'shadow-orange-500/30' : 'shadow-orange-500/30'
                }`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold mb-2 relative z-10 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  0.5s
                </div>
                <div className={`text-sm font-semibold relative z-10 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Avg Response
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 relative overflow-hidden transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
                : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Zap className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Powerful Features
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r transition-all duration-500 ${
              darkMode
                ? 'from-white to-gray-300'
                : 'from-slate-900 to-slate-700'
            } bg-clip-text text-transparent mb-6`}>
              Everything You Need
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Built for researchers, developers, and AI enthusiasts who demand the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`group relative backdrop-blur-xl border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                    darkMode
                      ? 'bg-gray-800/60 border-gray-700/50 shadow-lg shadow-violet-500/10'
                      : 'bg-white/70 border-slate-200/50 shadow-lg shadow-blue-500/10'
                  }`}
                >
                  {/* Enhanced glowing effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10 ${
                    darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className={`text-xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <div className={`px-3 py-1 bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold rounded-full opacity-90 shadow ${
                      darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                    }`}>
                      {feature.stats}
                    </div>
                  </div>
                  <p className={`leading-relaxed relative z-10 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    {feature.description}
                  </p>
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Enhanced floating indicator */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modern AI Models Section */}
      <ModernModelShowcase />

      {/* Modern Feedback and Pricing Section */}
      <div className="px-4 sm:px-6">
        <ModernFeedbackAndPricing />
      </div>

      {/* Testimonials Section */}
      <section className={`py-24 relative ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-violet-900/20 to-black'
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl ${
            darkMode ? 'bg-blue-500/10' : 'bg-blue-300/20'
          }`}></div>
          <div className={`absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-2xl ${
            darkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'
          }`}></div>
          
          {/* Additional ambient elements */}
          <div className={`absolute top-1/3 left-1/3 w-48 h-48 rounded-full blur-2xl ${
            darkMode ? 'bg-violet-500/10' : 'bg-indigo-300/20'
          }`}></div>
          <div className={`absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full blur-2xl ${
            darkMode ? 'bg-cyan-500/10' : 'bg-cyan-300/20'
          }`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 relative overflow-hidden transition-all duration-300 ${
              darkMode
                ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
                : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Star className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Trusted by Thousands
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r transition-all duration-500 ${
              darkMode
                ? 'from-white to-gray-300'
                : 'from-slate-900 to-slate-700'
            } bg-clip-text text-transparent mb-6`}>
              What Our Users Say
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Join researchers, developers, and AI enthusiasts who love AI Fiesta
            </p>
          </div>

          {/* Enhanced Flowing Feedback Container */}
          <div className="relative overflow-hidden py-6 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl">
            {/* Enhanced gradient overlays for fade effect */}
            <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-900 via-violet-900/20 to-black/0' 
                : 'bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50/0'
            }`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 ${
              darkMode 
                ? 'bg-gradient-to-l from-gray-900 via-violet-900/20 to-black/0' 
                : 'bg-gradient-to-l from-slate-50 via-blue-50 to-indigo-50/0'
            }`}></div>

            {/* Enhanced Flowing Feedback Track */}
            <div className="flex animate-flowing-feedback">
              {/* Duplicate feedback items for seamless looping */}
              {[...Array(2)].map((_, loopIndex) => (
                <React.Fragment key={loopIndex}>
                  {[
                    {
                      name: "Dr. Sarah Chen",
                      role: "AI Researcher",
                      company: "Stanford University",
                      avatar: "SC",
                      rating: 5,
                      text: "AI Fiesta has revolutionized how I compare model outputs for my research. The side-by-side comparison saves me hours every day.",
                      gradient: "from-blue-500 to-purple-500"
                    },
                    {
                      name: "Marcus Rodriguez",
                      role: "Senior Developer",
                      company: "TechCorp",
                      avatar: "MR",
                      rating: 5,
                      text: "The universal input feature is a game-changer. I can test prompts across multiple models instantly and find the best responses.",
                      gradient: "from-green-500 to-blue-500"
                    },
                    {
                      name: "Emily Zhang",
                      role: "Product Manager",
                      company: "StartupAI",
                      avatar: "EZ",
                      rating: 5,
                      text: "Perfect tool for evaluating AI models for our product. The history feature helps us track which models work best for different use cases.",
                      gradient: "from-pink-500 to-purple-500"
                    },
                    {
                      name: "James Wilson",
                      role: "Data Scientist",
                      company: "DataTech Inc",
                      avatar: "JW",
                      rating: 5,
                      text: "The analytics dashboard provides incredible insights into model performance. I can now make data-driven decisions about which models to use.",
                      gradient: "from-yellow-500 to-orange-500"
                    },
                    {
                      name: "Priya Sharma",
                      role: "ML Engineer",
                      company: "AI Solutions",
                      avatar: "PS",
                      rating: 5,
                      text: "As someone working with multiple AI models daily, AI Fiesta has become an indispensable tool in my workflow. Highly recommended!",
                      gradient: "from-indigo-500 to-blue-500"
                    }
                  ].map((testimonial, index) => (
                    <div 
                      key={`${loopIndex}-${index}`} 
                      className={`flex-shrink-0 w-80 mx-4 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                        darkMode
                          ? 'bg-gray-800/70 border-gray-700/50 shadow-xl shadow-violet-500/10'
                          : 'bg-white/80 border border-slate-200/50 shadow-xl shadow-blue-500/10'
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                          darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                        }`}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className={`font-bold ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {testimonial.name}
                          </div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {testimonial.role}, {testimonial.company}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        "{testimonial.text}"
                      </p>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Enhanced Trust indicators */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className={`text-center p-4 rounded-2xl backdrop-blur-xl ${
                darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50 shadow-lg shadow-violet-500/10'
                  : 'bg-white/70 border border-slate-200/50 shadow-lg shadow-blue-500/10'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  10K+
                </div>
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Active Users
                </div>
              </div>
              <div className={`text-center p-4 rounded-2xl backdrop-blur-xl ${
                darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50 shadow-lg shadow-violet-500/10'
                  : 'bg-white/70 border border-slate-200/50 shadow-lg shadow-blue-500/10'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  500K+
                </div>
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Comparisons Made
                </div>
              </div>
              <div className={`text-center p-4 rounded-2xl backdrop-blur-xl ${
                darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50 shadow-lg shadow-violet-500/10'
                  : 'bg-white/70 border border-slate-200/50 shadow-lg shadow-blue-500/10'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  99.9%
                </div>
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Uptime
                </div>
              </div>
              <div className={`text-center p-4 rounded-2xl backdrop-blur-xl ${
                darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50 shadow-lg shadow-violet-500/10'
                  : 'bg-white/70 border border-slate-200/50 shadow-lg shadow-blue-500/10'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  4.9/5
                </div>
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  User Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div 
              onClick={() => setShowVideoTutorial(true)}
              className={`inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-5 py-2.5 mb-6 relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 ${
                darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-violet-500/10'
                  : 'bg-white/70 border border-slate-200/50 shadow-xl shadow-blue-500/10'
              }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Play className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                How It Works
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r transition-all duration-500 ${
              darkMode
                ? 'from-white to-gray-300'
                : 'from-slate-900 to-slate-700'
            } bg-clip-text text-transparent mb-6`}>
              Three Simple Steps
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Get started with AI model comparison in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative group">
                  {/* Enhanced Connection Line with gradient */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transform translate-x-4 rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-50"></div>
                    </div>
                  )}

                  <div className="text-center relative">
                    {/* Enhanced icon container with animated rings */}
                    <div className="relative mx-auto mb-6">
                      <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl relative overflow-hidden ${
                        darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                      }`}>
                        <Icon className="w-10 h-10 text-white relative z-10" />

                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Enhanced animated rings around icon */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-blue-300/30 animate-ping" style={{ animationDuration: '3s', animationDelay: `${index * 0.5}s` }}></div>
                      <div className="absolute inset-0 rounded-3xl border border-purple-300/20 animate-pulse" style={{ animationDelay: `${index * 0.3}s` }}></div>
                    </div>

                    {/* Enhanced step number */}
                    <div className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-4 shadow-lg ${
                      darkMode ? 'shadow-violet-500/30' : 'shadow-blue-500/30'
                    }`}>
                      {step.number}
                    </div>

                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                      darkMode 
                        ? 'text-white group-hover:text-blue-300' 
                        : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`leading-relaxed max-w-sm mx-auto ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {step.description}
                    </p>

                    {/* Enhanced floating badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className={`py-24 relative overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-br from-violet-900 via-purple-900 to-black'
          : 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
      }`}>
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${darkMode ? 'white' : 'white'} 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Enhanced gradient overlay for depth */}
        <div className={`absolute inset-0 bg-gradient-to-t ${
          darkMode ? 'from-black/30 via-transparent to-transparent' : 'from-black/20 via-transparent to-transparent'
        }`}></div>

        {/* Additional ambient lights */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl ${
          darkMode ? 'bg-blue-500/20' : 'bg-blue-400/30'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl ${
          darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'
        }`}></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Enhanced heading with animated underline */}
          <div className="relative inline-block mb-6">
            <h2 className={`text-4xl sm:text-5xl font-bold relative z-10 transition-all duration-500 ${
              darkMode ? 'text-white' : 'text-white'
            }`}>
              Ready to Compare AI Models?
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
          </div>

          <p className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
            darkMode ? 'text-blue-200' : 'text-blue-100'
          }`}>
            Join thousands of researchers and developers who trust AI Fiesta for their AI model comparisons.
            <span className={`block mt-2 font-bold ${
              darkMode ? 'text-white/90' : 'text-white/90'
            }`}>
              Start your journey to AI excellence today.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              href={user ? "/chat" : "/auth"}
              className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 overflow-hidden backdrop-blur-sm"
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>

              {/* Enhanced glowing effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Start Free Today</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />

              {/* Enhanced shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
            </Link>

            <div className={`text-sm space-y-1 backdrop-blur-sm px-4 py-3 rounded-xl ${
              darkMode ? 'bg-white/10' : 'bg-white/20'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Enhanced Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
            <div className="flex items-center space-x-2 text-white/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/10">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">10K+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`relative overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
      }`}>
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${darkMode ? 'white' : 'white'} 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Additional ambient lights for footer */}
        <div className={`absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl ${
          darkMode ? 'bg-violet-500/10' : 'bg-blue-500/10'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl ${
          darkMode ? 'bg-purple-500/10' : 'bg-purple-500/10'
        }`}></div>

        {/* Main footer content */}
        <div className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
              {/* Brand section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    darkMode 
                      ? 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-violet-500/30' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/30'
                  }`}>
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <span className={`text-2xl font-bold bg-gradient-to-r transition-all duration-500 ${
                    darkMode
                      ? 'from-white to-blue-200'
                      : 'from-white to-blue-200'
                  } bg-clip-text text-transparent`}>
                    AI Fiesta
                  </span>
                </div>
                <p className={`leading-relaxed mb-6 max-w-md ${
                  darkMode ? 'text-gray-400' : 'text-slate-400'
                }`}>
                  The ultimate platform for comparing AI models. Send one message to multiple AI models and find the perfect response for every task.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    <span className={`font-bold ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      10K+
                    </span> active users
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                  Platform
                </h4>
                <ul className="space-y-2">
                  {[
                    { name: 'Compare Models', href: '/chat' },
                    { name: 'View Comparisons', href: '/dashboard' },
                    { name: 'Docs', href: '/docs' }
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 ${
                          darkMode ? 'text-gray-400' : 'text-slate-400'
                        }`}
                      >
                        <ChevronRight className="w-3 h-3" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Models */}
              <div>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                  AI Models
                </h4>
                <ul className="space-y-2">
                  {[
                    'GPT-5',
                    'Claude 4 Sonnet',
                    'Gemini 2.5',
                    'DeepSeek',
                    'Qwen 2.5',
                    'grok',
                    'Llama',
                    'Kimi',
                    'ShisaAI'

                  ].map((model, index) => (
                    <li key={index}>
                      <Link
                        href="/compare"
                        className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 group ${
                          darkMode ? 'text-gray-400' : 'text-slate-400'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full group-hover:bg-blue-300 transition-colors duration-200 ${
                          darkMode ? 'bg-blue-400' : 'bg-blue-400'
                        }`}></div>
                        <span className="hover:underline">{model}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Details removed */}
              <div>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                  Connect
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="mailto:mannamganeshbabu8@gmail.com.com"
                      className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                      <ChevronRight className="w-3 h-3" />
                      <span>E-mail</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
                  Payment Details
                </h4>
                <ul className="space-y-2">
                  {[
                    { name: 'Pricing', href: '/pricing' },
                    // { name: 'Payment Methods', href: '/payment' },
                    // { name: 'Billing', href: '/account-settings#billing' }
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-slate-400'
                          }`}>
                        <ChevronRight className="w-3 h-3" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className={`border-t py-8 ${
          darkMode ? 'border-gray-800/50' : 'border-slate-700/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                  © 2024 AI Fiesta. Built for AI enthusiasts, by AI enthusiasts.
                </div>
                <div className="hidden md:flex items-center space-x-4 text-xs text-slate-500">
                  <Link
                    href="/privacy"
                    className={`hover:text-slate-300 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                    Privacy
                  </Link>
                  <span>•</span>
                  <Link
                    href="/terms"
                    className={`hover:text-slate-300 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                    Terms
                  </Link>
                  <span>•</span>
                  <Link
                    href="/support"
                    className={`hover:text-slate-300 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                    Support
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                  Version 1.0.0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </footer>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes flowing-feedback {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-flowing-feedback {
          display: flex;
          animation: flowing-feedback 30s linear infinite;
          width: max-content;
        }
        
        @keyframes border-glow {
          0% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.5);
          }
        }
        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .scale-[1.02] {
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  )
}