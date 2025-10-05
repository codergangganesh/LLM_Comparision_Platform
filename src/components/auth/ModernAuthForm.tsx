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
    <div className="w-full">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-purple-100 to-fuchsia-200 bg-clip-text text-transparent mb-3">
          {isLogin ? 'Welcome Back!' : 'Join AI Fiesta!'}
        </h2>
        <p className="text-violet-300/80">
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
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-violet-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
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
              className="w-full pl-12 pr-4 py-4 bg-black/40 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 text-violet-100 placeholder:text-violet-300/50 backdrop-blur-sm hover:bg-black/50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
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
              className="w-full pl-12 pr-12 py-4 bg-black/40 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 text-violet-100 placeholder:text-violet-300/50 backdrop-blur-sm hover:bg-black/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-violet-400 hover:text-violet-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field - Only for Signup */}
        {!isLogin && (
          <div>
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
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200 text-violet-100 placeholder:text-violet-300/50 backdrop-blur-sm hover:bg-black/50"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/30 transform hover:scale-[1.02] active:scale-[0.98] border border-violet-500/50 shadow-md"
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
        <div className="relative">
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
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-black/40 border border-violet-500/20 rounded-xl hover:bg-violet-900/20 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group"
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
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-black/40 border border-violet-500/20 rounded-xl hover:bg-violet-900/20 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group"
          >
            <Github className="w-5 h-5 text-violet-300 group-hover:text-violet-200" />
            <span className="text-violet-200 font-medium group-hover:text-violet-100">GitHub</span>
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <div className="text-center pt-4">
          <p className="text-violet-300/80">
            {isLogin ? 'New to AI Fiesta? Join our community of learners and' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccessMessage('')
              }}
              className="text-violet-400 hover:text-violet-300 font-semibold hover:underline transition-colors duration-200"
            >
              {isLogin ? 'start your AI journey today!' : 'Sign in here'}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}