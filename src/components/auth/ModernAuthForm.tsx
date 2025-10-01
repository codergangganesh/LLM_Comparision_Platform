'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github } from 'lucide-react'

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
  const router = useRouter()
  const searchParams = useSearchParams()

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
    <div className="w-full animate-fade-in">
      {/* Form Header */}
      <div className="text-center mb-8 animate-slide-in-top">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-purple-100 to-fuchsia-200 bg-clip-text text-transparent mb-3 animate-text-glow">
          {isLogin ? 'Welcome Back!' : 'Join AI Fiesta!'}
        </h2>
        <p className="text-violet-300/80 animate-fade-in delay-100">
          {isLogin 
            ? 'Sign in to continue your AI journey'
            : 'Create your account and start comparing AI models'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm animate-fade-in-down">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-violet-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm animate-shake">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="animate-fade-in-up delay-200">
          <label className="block text-sm font-semibold text-violet-200 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-violet-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full pl-12 pr-4 py-4 bg-black/40 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 text-violet-100 placeholder:text-violet-300/50 backdrop-blur-sm hover:bg-black/50 animate-border-glow"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="animate-fade-in-up delay-300">
          <label className="block text-sm font-semibold text-violet-200 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-violet-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full pl-12 pr-12 py-4 bg-black/40 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 text-violet-100 placeholder:text-violet-300/50 backdrop-blur-sm hover:bg-black/50 animate-border-glow"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-violet-400 hover:text-violet-300 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field - Only for Signup */}
        {!isLogin && (
          <div className="animate-fade-in-up delay-400">
            <label className="block text-sm font-semibold text-violet-200 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-violet-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 text-violet-100 placeholder:text-violet-300/50 backdrop-blur-sm hover:bg-black/50 animate-border-glow"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-[1.02] active:scale-[0.98] border border-violet-500/50 shadow-md animate-pulse-glow"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative animate-fade-in delay-500">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-violet-500/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black/40 text-violet-300 font-medium backdrop-blur-sm rounded-full">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-600">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-black/40 border border-violet-500/20 rounded-xl hover:bg-violet-900/20 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group animate-border-glow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-violet-200 font-medium group-hover:text-violet-100">Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-black/40 border border-violet-500/20 rounded-xl hover:bg-violet-900/20 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group animate-border-glow"
          >
            <Github className="w-5 h-5 text-violet-300 group-hover:text-violet-200" />
            <span className="text-violet-200 font-medium group-hover:text-violet-100">GitHub</span>
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <div className="text-center pt-4 animate-fade-in delay-700">
          <p className="text-violet-300/80">
            {isLogin ? 'New to AI Fiesta? Join our community of learners and' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccessMessage('')
              }}
              className="text-violet-400 hover:text-violet-300 font-semibold hover:underline transition-colors duration-200 animate-text-glow"
            >
              {isLogin ? 'start your AI journey today!' : 'Sign in here'}
            </button>
          </p>
        </div>
      </form>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes slide-in-top {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
          }
        }
        
        @keyframes border-glow {
          0% {
            border-color: rgba(139, 92, 246, 0.2);
          }
          50% {
            border-color: rgba(139, 92, 246, 0.5);
          }
          100% {
            border-color: rgba(139, 92, 246, 0.2);
          }
        }
        
        @keyframes text-glow {
          0% {
            text-shadow: 0 0 2px rgba(139, 92, 246, 0.3);
          }
          50% {
            text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
          }
          100% {
            text-shadow: 0 0 2px rgba(139, 92, 246, 0.3);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-in-top {
          animation: slide-in-top 0.6s ease-out;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.4s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  )
}