'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useLoading } from '@/contexts/LoadingContext'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, Brain, LogOut, Moon, Sun, User as UserIcon, Star } from 'lucide-react'
import ModernModelShowcase from './ModernModelShowcase'

import { useEffect, useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

import AllModelsOverlay from './AllModelsOverlay' // Fixed the import path
import AIFiestaLogo from './AIFiestaLogo'
import VideoTutorialPopup from './VideoTutorialPopup'
import HeroSection from './sections/HeroSection'
import FeaturesSection from './sections/FeaturesSection'
import HowItWorksSection from './sections/HowItWorksSection'
import CallToActionSection from './sections/CallToActionSection'
import SiteFooter from './sections/SiteFooter'

export default function LandingPage() {
  const { user, signOut } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const router = useOptimizedRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showAllModels, setShowAllModels] = useState(false)
  const [showVideoTutorial, setShowVideoTutorial] = useState(false)
  const searchParams = useSearchParams()

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
    if (user) {
      router.push('/chat');
    } else {
      router.push('/auth');
    }
  };

  const profilePicture = getProfilePicture();

  // Extract social media links from user profile
  const socialLinks = {
    twitter: 'https://twitter.com/codergangganesh',
    linkedin: 'https://linkedin.com/in/codergangganesh',
    facebook: 'https://facebook.com/codergangganesh',
    github: 'https://github.com/codergangganesh'
  }

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
                          href="/profile"
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? 'text-gray-200 hover:bg-gray-700/80'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}>
                          <UserIcon className="w-4 h-4" />
                          <span>Profile</span>
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
                    }`}>
                   Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <HeroSection 
        darkMode={darkMode} 
        handleGetStarted={handleGetStarted} 
        handleGoToChat={handleGoToChat} 
        user={user} 
      />
      
      <FeaturesSection darkMode={darkMode} />
      
      {/* Modern AI Models Section */}
      <ModernModelShowcase />
      
      <HowItWorksSection 
        darkMode={darkMode} 
        setShowVideoTutorial={setShowVideoTutorial} 
      />
      

      
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
                      name: "Priya Sharma",
                      role: "AI Researcher",
                      company: "IIT Delhi",
                      avatar: "PS",
                      rating: 5,
                      text: "AI Fiesta has revolutionized how I compare model outputs for my research. The side-by-side comparison saves me hours every day.",
                      gradient: "from-blue-500 to-purple-500"
                    },
                    {
                      name: "Rahul Verma",
                      role: "Senior Developer",
                      company: "TCS",
                      avatar: "RV",
                      rating: 5,
                      text: "The universal input feature is a game-changer. I can test prompts across multiple models instantly and find the best responses.",
                      gradient: "from-green-500 to-blue-500"
                    },
                    {
                      name: "Anjali Patel",
                      role: "Product Manager",
                      company: "Infosys",
                      avatar: "AP",
                      rating: 5,
                      text: "Perfect tool for evaluating AI models for our product. The history feature helps us track which models work best for different use cases.",
                      gradient: "from-pink-500 to-purple-500"
                    },
                    {
                      name: "Vikram Singh",
                      role: "Data Scientist",
                      company: "Wipro",
                      avatar: "VS",
                      rating: 5,
                      text: "The analytics dashboard provides incredible insights into model performance. I can now make data-driven decisions about which models to use.",
                      gradient: "from-yellow-500 to-orange-500"
                    },
                    {
                      name: "Meera Reddy",
                      role: "ML Engineer",
                      company: "Accenture",
                      avatar: "MR",
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
                      }`}>
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
                        &quot;{testimonial.text}&quot;
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
      
      <CallToActionSection darkMode={darkMode} user={user} />
      
      <SiteFooter darkMode={darkMode} />
      
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