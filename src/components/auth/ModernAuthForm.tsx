'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Sparkles } from 'lucide-react'

import AIFiestaLogo from '@/components/landing/AIFiestaLogo'
import EnhancedAuthLogo from '@/components/auth/EnhancedAuthLogo'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function ModernAuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { signIn, signUp, signInWithGoogle, signInWithGithub } = useAuth()
  const router = useOptimizedRouter()
  const searchParams = useSearchParams()
  const { darkMode } = useDarkMode()

  // Check for success message from URL params
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(decodeURIComponent(message))
      // Clear the message from URL after displaying
      window.history.replaceState({}, document.title, '/auth')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          router.push('/chat')
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        
        const { error } = await signUp(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          // After successful signup, reset form and show success message
          setFormData({
            email: '',
            password: '',
            confirmPassword: ''
          })
          setIsLogin(true)
          setSuccessMessage('Account created successfully. Please sign in.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')
      await signInWithGoogle()
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.')
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')
      await signInWithGithub()
    } catch (err) {
      setError('Failed to sign in with GitHub. Please try again.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`absolute -inset-2 rounded-full blur opacity-70 animate-pulse ${darkMode ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-gradient-to-r from-violet-400 to-purple-400'}`}></div>
            <div className={`relative rounded-full p-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              {/* Using the new enhanced logo */}
              <EnhancedAuthLogo className="w-12 h-12" />
            </div>
          </div>
        </div>
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'bg-gradient-to-r from-violet-200 via-purple-100 to-fuchsia-200 bg-clip-text text-transparent' : 'bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-600 bg-clip-text text-transparent'}`}>
          {isLogin ? 'Welcome Back!' : 'Join AI Fiesta!'}
        </h2>
        <p className={`text-lg max-w-md mx-auto ${darkMode ? 'text-violet-300/80' : 'text-violet-600/80'}`}>
          {isLogin 
            ? 'Sign in to continue your AI journey and compare models'
            : 'Create your account and start comparing AI models instantly'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Success Message */}
        {successMessage && (
          <div className={`rounded-2xl text-sm backdrop-blur-sm animate-fade-in ${darkMode ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200' : 'bg-gradient-to-r from-green-200/50 to-emerald-200/50 border border-green-300/50 text-green-700'}`}>
            <div className="flex items-center px-6 py-4">
              <div className={`w-2 h-2 rounded-full mr-3 ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`rounded-2xl text-sm backdrop-blur-sm animate-fade-in ${darkMode ? 'bg-gradient-to-r from-red-500/20 to-violet-500/20 border border-red-500/30 text-red-200' : 'bg-gradient-to-r from-red-200/50 to-violet-200/50 border border-red-300/50 text-red-700'}`}>
            <div className="flex items-center px-6 py-4">
              <div className={`w-2 h-2 rounded-full mr-3 ${darkMode ? 'bg-red-400' : 'bg-red-500'}`}></div>
              {error}
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-violet-200' : 'text-violet-700'}`}>
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${darkMode ? 'text-violet-400' : 'text-violet-500'}`} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className={`w-full pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm hover:bg-opacity-70 group-hover:border-opacity-100 ${
                darkMode 
                  ? 'bg-gray-800/50 border border-violet-500/30 focus:ring-violet-500/50 focus:border-violet-500 text-violet-100 placeholder:text-violet-300/50 hover:bg-gray-800/70 group-hover:border-violet-500/50' 
                  : 'bg-gray-100/70 border border-violet-300/50 focus:ring-violet-400/50 focus:border-violet-400 text-gray-800 placeholder:text-violet-400/70 hover:bg-gray-100/90 group-hover:border-violet-400/70'
              }`}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-violet-200' : 'text-violet-700'}`}>
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${darkMode ? 'text-violet-400' : 'text-violet-500'}`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={`w-full pl-14 pr-14 py-5 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm hover:bg-opacity-70 group-hover:border-opacity-100 ${
                darkMode 
                  ? 'bg-gray-800/50 border border-violet-500/30 focus:ring-violet-500/50 focus:border-violet-500 text-violet-100 placeholder:text-violet-300/50 hover:bg-gray-800/70 group-hover:border-violet-500/50' 
                  : 'bg-gray-100/70 border border-violet-300/50 focus:ring-violet-400/50 focus:border-violet-400 text-gray-800 placeholder:text-violet-400/70 hover:bg-gray-100/90 group-hover:border-violet-400/70'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-5 flex items-center transition-colors duration-200 ${
                darkMode ? 'text-violet-400 hover:text-violet-300' : 'text-violet-500 hover:text-violet-600'
              }`}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field - Only for Signup */}
        {!isLogin && (
          <div>
            <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-violet-200' : 'text-violet-700'}`}>
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${darkMode ? 'text-violet-400' : 'text-violet-500'}`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className={`w-full pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm hover:bg-opacity-70 group-hover:border-opacity-100 ${
                  darkMode 
                    ? 'bg-gray-800/50 border border-violet-500/30 focus:ring-violet-500/50 focus:border-violet-500 text-violet-100 placeholder:text-violet-300/50 hover:bg-gray-800/70 group-hover:border-violet-500/50' 
                    : 'bg-gray-100/70 border border-violet-300/50 focus:ring-violet-400/50 focus:border-violet-400 text-gray-800 placeholder:text-violet-400/70 hover:bg-gray-100/90 group-hover:border-violet-400/70'
                }`}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-3 px-8 py-5 font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl group relative overflow-hidden ${
            darkMode 
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/30' 
              : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border border-violet-400/50 hover:shadow-2xl hover:shadow-violet-400/30'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            darkMode ? 'from-white/20 to-transparent' : 'from-white/30 to-transparent'
          }`}></div>
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>{isLogin ? 'Sign In to Your Account' : 'Create Your Account'}</span>
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full ${darkMode ? 'border-t border-violet-500/20' : 'border-t border-violet-300/50'}`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-6 font-medium backdrop-blur-sm rounded-full ${
              darkMode 
                ? 'bg-gray-900/80 text-violet-300 border border-gray-700/50' 
                : 'bg-white/80 text-violet-600 border border-gray-200/50'
            }`}>
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`flex items-center justify-center space-x-3 px-6 py-5 rounded-2xl transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group relative overflow-hidden ${
              darkMode 
                ? 'bg-gray-800/50 border border-violet-500/30 hover:bg-violet-900/20' 
                : 'bg-gray-100/70 border border-violet-300/50 hover:bg-violet-100/50'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              darkMode ? 'from-white/10 to-transparent' : 'from-white/20 to-transparent'
            }`}></div>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className={`font-semibold group-hover:text-opacity-100 ${
              darkMode 
                ? 'text-violet-200 group-hover:text-violet-100' 
                : 'text-violet-600 group-hover:text-violet-700'
            }`}>Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading}
            className={`flex items-center justify-center space-x-3 px-6 py-5 rounded-2xl transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group relative overflow-hidden ${
              darkMode 
                ? 'bg-gray-800/50 border border-violet-500/30 hover:bg-violet-900/20' 
                : 'bg-gray-100/70 border border-violet-300/50 hover:bg-violet-100/50'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              darkMode ? 'from-white/10 to-transparent' : 'from-white/20 to-transparent'
            }`}></div>
            <Github className={`w-6 h-6 group-hover:opacity-100 ${
              darkMode 
                ? 'text-violet-300 group-hover:text-violet-200' 
                : 'text-violet-500 group-hover:text-violet-600'
            }`} />
            <span className={`font-semibold group-hover:text-opacity-100 ${
              darkMode 
                ? 'text-violet-200 group-hover:text-violet-100' 
                : 'text-violet-600 group-hover:text-violet-700'
            }`}>GitHub</span>
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <div className="text-center pt-6">
          <p className={`text-lg ${
            darkMode ? 'text-violet-300/80' : 'text-violet-600/80'
          }`}>
            {isLogin ? "New to AI Fiesta? Join our community of AI enthusiasts and" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccessMessage('')
              }}
              className={`font-bold hover:underline transition-colors duration-200 ${
                darkMode 
                  ? 'text-violet-400 hover:text-violet-300' 
                  : 'text-violet-600 hover:text-violet-700'
              }`}
            >
              {isLogin ? 'start your AI journey today!' : 'Sign in here'}
            </button>
          </p>
        </div>
      </form>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}