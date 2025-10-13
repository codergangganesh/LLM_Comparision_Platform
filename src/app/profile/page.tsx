'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'
import SharedSidebar from '@/components/layout/SharedSidebar'
import { 
  Camera, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CreditCard, 
  LogOut, 
  Trash2,
  Edit3,
  MessageSquare,
  Heart,
  Share2,
  Settings,
  Sun,
  Moon,
  Grid,
  List,
  Filter,
  Star,
  Award,
  TrendingUp,
  Clock,
  Image,
  Video,
  FileText,
  BarChart3
} from 'lucide-react'
import { dashboardService } from '@/services/dashboard.service'
import { ChatSession } from '@/types/chat'

export default function ModernProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useOptimizedRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { setPageLoading } = useOptimizedLoading()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      setPageLoading(true, "Redirecting to authentication...")
      router.push('/auth')
    } else if (user && !loading) {
      setPageLoading(false)
    }
  }, [user, loading, router, setPageLoading])

  // Show loading while checking auth status
  if (loading) {
    return <OptimizedPageTransitionLoader message="Loading profile..." />
  }

  // Show nothing while redirecting
  if (!user) {
    return null
  }

  // Form data state
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    joinDate: 'January 2024',
    bio: 'AI enthusiast and technology explorer. Passionate about comparing different AI models and sharing insights with the community.',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    notifications: {
      email: true,
      product: false,
      security: true
    },
    appearance: {
      theme: darkMode ? 'dark' : 'light',
      language: 'en',
      accentColor: '#8B5CF6' // Default purple accent
    }
  })

  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})
  const [isEditing, setIsEditing] = useState(false)
  const [editField, setEditField] = useState('')
  const [activityFilter, setActivityFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  
  // Real-time data state
  const [statsData, setStatsData] = useState([
    { label: 'Comparisons', value: '0', icon: Grid, color: 'from-blue-500 to-cyan-500' },
    { label: 'Comments', value: '0', icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
    { label: 'Likes', value: '0', icon: Heart, color: 'from-red-500 to-orange-500' },
    { label: 'Response Time', value: '0ms', icon: Clock, color: 'from-green-500 to-emerald-500' }
  ])
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [modelUsageData, setModelUsageData] = useState<any[]>([])

  // Fetch real-time data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sessions = await dashboardService.getChatSessions() || []
        setChatSessions(sessions)
        
        // Calculate real stats
        const totalComparisons = sessions.length
        const totalComments = sessions.filter(session => session.responses && session.responses.length > 0).length
        const modelUsage = dashboardService.getMessagesTypedData(sessions)
        const responseTimeData = dashboardService.getResponseTimeDistributionData(sessions)
        
        setModelUsageData(modelUsage)
        
        // Update stats with real data
        setStatsData([
          { label: 'Comparisons', value: totalComparisons.toString(), icon: Grid, color: 'from-blue-500 to-cyan-500' },
          { label: 'Comments', value: totalComments.toString(), icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
          { 
            label: 'Top Model', 
            value: modelUsage.length > 0 ? `${modelUsage[0].name} (${modelUsage[0].value})` : 'None', 
            icon: Heart, 
            color: 'from-red-500 to-orange-500' 
          },
          { 
            label: 'Response Time', 
            value: responseTimeData.length > 0 ? `${Math.max(...responseTimeData.map(d => d.value)).toFixed(2)}s` : '0s', 
            icon: Clock, 
            color: 'from-green-500 to-emerald-500' 
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    
    fetchDashboardData()
  }, [])

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      joinDate: 'January 2024',
      bio: 'AI enthusiast and technology explorer. Passionate about comparing different AI models and sharing insights with the community.',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      notifications: {
        email: true,
        product: false,
        security: true
      },
      appearance: {
        theme: darkMode ? 'dark' : 'light',
        language: 'en',
        accentColor: '#8B5CF6'
      }
    })
  }, [user, darkMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name.startsWith('notifications.')) {
        const notificationType = name.split('.')[1]
        setFormData({
          ...formData,
          notifications: {
            ...formData.notifications,
            [notificationType]: checked
          }
        })
      } else if (name.startsWith('appearance.')) {
        const appearanceType = name.split('.')[1]
        setFormData({
          ...formData,
          appearance: {
            ...formData.appearance,
            [appearanceType]: value
          }
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSaveProfile = () => {
    setSaveStatus({type: 'success', message: 'Profile updated successfully!'})
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    setIsEditing(false)
  }

  const handleSaveNotifications = () => {
    setSaveStatus({type: 'success', message: 'Notification preferences updated!'})
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  const handleSaveSecurity = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setSaveStatus({type: 'error', message: 'New passwords do not match.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    if (formData.newPassword.length < 6) {
      setSaveStatus({type: 'error', message: 'Password must be at least 6 characters.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    if (!formData.currentPassword) {
      setSaveStatus({type: 'error', message: 'Please enter your current password.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    try {
      // In a real implementation, you would call your auth service to update the password
      // For now, we'll just simulate the process with a delay
      setSaveStatus({type: 'success', message: 'Password updated successfully! You will be logged out in 3 seconds to re-authenticate.'})
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      })
      
      // Simulate logout after password change
      setTimeout(async () => {
        await signOut()
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      console.error('Error updating password:', error)
      setSaveStatus({type: 'error', message: 'Error updating password. Please try again.'})
    }
    
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  const handleSaveAppearance = () => {
    // Handle theme change
    if (formData.appearance.theme === 'dark' && !darkMode) {
      toggleDarkMode()
    } else if (formData.appearance.theme === 'light' && darkMode) {
      toggleDarkMode()
    }
    
    // Apply accent color globally
    const root = document.documentElement
    root.style.setProperty('--accent-color', formData.appearance.accentColor)
    
    setSaveStatus({type: 'success', message: 'Appearance settings updated!'})
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  // Function to get user display name
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')
  }

  // Function to get user avatar or initial
  const getUserAvatar = (size: 'sm' | 'md' | 'lg' = 'md') => {
    const dimensions = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-24 h-24' : 'w-32 h-32'
    
    if (user?.user_metadata?.avatar_url) {
      return (
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className={`${dimensions} rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg`}
        />
      )
    }
    
    const displayName = getUserDisplayName()
    const initial = displayName.charAt(0).toUpperCase()
    
    return (
      <div className={`${dimensions} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800`}>
        <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl'} font-bold text-white`}>
          {initial}
        </span>
      </div>
    )
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ]

  // Mock activity data
  const activityData = [
    { id: 1, type: 'post', title: 'New AI Model Comparison', content: 'Compared GPT-4 vs Claude 2 for creative writing tasks', time: '2 hours ago', likes: 24, comments: 5 },
    { id: 2, type: 'comment', title: 'Commented on Discussion', content: 'Great insights on the latest AI developments', time: '5 hours ago', likes: 8, comments: 2 },
    { id: 3, type: 'like', title: 'Liked a Comparison', content: 'GPT-4 vs Gemini Pro comparison', time: '1 day ago', likes: 15, comments: 3 },
    { id: 4, type: 'post', title: 'New Analysis Published', content: 'Detailed analysis of AI model performance in coding tasks', time: '2 days ago', likes: 42, comments: 11 },
    { id: 5, type: 'achievement', title: 'Achievement Unlocked', content: 'Completed 50 AI model comparisons', time: '3 days ago', likes: 0, comments: 0 },
    { id: 6, type: 'post', title: 'New Benchmark Results', content: 'Benchmarking open-source models against proprietary ones', time: '1 week ago', likes: 31, comments: 7 }
  ]

  // Filter activity based on selection
  const filteredActivity = activityFilter === 'all' 
    ? activityData 
    : activityData.filter(item => item.type === activityFilter)

  // Mock badges
  const badges = [
    { id: 1, name: 'AI Explorer', icon: Star, color: 'bg-yellow-500' },
    { id: 2, name: 'Model Master', icon: Award, color: 'bg-blue-500' },
    { id: 3, name: 'Community Contributor', icon: Sparkles, color: 'bg-purple-500' }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <SharedSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-80 ml-16 transition-all duration-300">
        {/* Header with gradient background */}
        <div className={`relative overflow-hidden backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700/30' 
            : 'bg-gradient-to-r from-white/60 to-blue-50/60 border-slate-200/30'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
          <div className="relative px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between">
              <div className="flex flex-col items-center md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Profile Picture with normal border */}
                <div className="relative group">
                  {getUserAvatar('lg')}
                  <button 
                    className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 group-hover:scale-110"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5 text-slate-600 dark:text-gray-300" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {getUserDisplayName()}
                  </h1>
                  <p className={`mt-1 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    @{user?.email ? user.email.split('@')[0] : 'username'}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                    {badges.map((badge) => (
                      <span 
                        key={badge.id}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}
                      >
                        <badge.icon className="w-3 h-3 mr-1" />
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex space-x-3">
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-700/70 text-slate-800 dark:text-white font-medium rounded-xl transition-all border border-white/30 dark:border-gray-600 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-6 transition-colors duration-200 sticky top-6 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                            : `${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-slate-700 hover:bg-slate-100'}`
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Account Actions */}
                <div className="mt-6 pt-6 border-t border-gray-700/30">
                  <button
                    onClick={() => {
                      signOut()
                      router.push('/')
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      darkMode 
                        ? 'text-rose-300 hover:bg-rose-900/30' 
                        : 'text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      darkMode 
                        ? 'text-rose-300 hover:bg-rose-900/30' 
                        : 'text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Delete Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Save Status Notification */}
              {saveStatus.type && (
                <div className={`mb-6 p-4 rounded-xl flex items-center ${
                  saveStatus.type === 'success' 
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                }`}>
                  {saveStatus.type === 'success' ? 
                    <CheckCircle className="w-5 h-5 mr-2" /> : 
                    <AlertCircle className="w-5 h-5 mr-2" />
                  }
                  <span>{saveStatus.message}</span>
                </div>
              )}

              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Profile Information
                    </h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Bio Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-medium ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Bio
                        </h3>
                        {isEditing && (
                          <button 
                            onClick={() => {
                              setEditField('bio')
                              handleSaveProfile()
                            }}
                            className="text-sm text-indigo-500 hover:text-indigo-700"
                          >
                            Save
                          </button>
                        )}
                      </div>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      ) : (
                        <p className={`${
                          darkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>
                          {formData.bio}
                        </p>
                      )}
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {statsData.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                          <div 
                            key={index}
                            className={`rounded-2xl p-4 transition-all duration-300 hover:scale-105 ${
                              darkMode 
                                ? 'bg-gray-700/30' 
                                : 'bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-2xl font-bold ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {stat.value}
                                </p>
                                <p className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                  {stat.label}
                                </p>
                              </div>
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600 text-white' 
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          />
                        ) : (
                          <p className={`px-4 py-3 rounded-xl ${
                            darkMode 
                              ? 'bg-gray-700/50 text-white' 
                              : 'bg-slate-50 text-slate-900'
                          }`}>
                            {formData.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Email Address
                        </label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                darkMode 
                                  ? 'bg-gray-700/50 border-gray-600 text-white' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                            />
                          ) : (
                            <p className={`px-4 py-3 rounded-xl ${
                              darkMode 
                                ? 'bg-gray-700/50 text-white' 
                                : 'bg-slate-50 text-slate-900'
                            }`}>
                              {formData.email}
                            </p>
                          )}
                          <Mail className={`absolute right-3 top-3.5 w-5 h-5 ${
                            darkMode ? 'text-gray-500' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Member Since
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.joinDate}
                          disabled
                          className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-gray-400' 
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        />
                        <Calendar className={`absolute right-3 top-3.5 w-5 h-5 ${
                          darkMode ? 'text-gray-500' : 'text-slate-400'
                        }`} />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button 
                          onClick={handleSaveProfile}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Section */}
              {activeSection === 'activity' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Recent Activity
                    </h2>
                    <div className="flex space-x-3">
                      <div className={`flex items-center rounded-xl p-1 ${
                        darkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                      }`}>
                        <button 
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg ${
                            viewMode === 'grid' 
                              ? 'bg-indigo-500 text-white' 
                              : darkMode 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg ${
                            viewMode === 'list' 
                              ? 'bg-indigo-500 text-white' 
                              : darkMode 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative">
                        <select
                          value={activityFilter}
                          onChange={(e) => setActivityFilter(e.target.value)}
                          className={`appearance-none pl-4 pr-10 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        >
                          <option value="all">All Activity</option>
                          <option value="post">Posts</option>
                          <option value="comment">Comments</option>
                          <option value="like">Likes</option>
                          <option value="achievement">Achievements</option>
                        </select>
                        <Filter className={`absolute right-3 top-2.5 w-4 h-4 ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredActivity.map((activity) => (
                        <div 
                          key={activity.id}
                          className={`rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                            darkMode 
                              ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                {activity.type === 'post' && <Grid className="w-4 h-4 text-blue-500 mr-2" />}
                                {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-green-500 mr-2" />}
                                {activity.type === 'like' && <Heart className="w-4 h-4 text-red-500 mr-2" />}
                                {activity.type === 'achievement' && <Award className="w-4 h-4 text-yellow-500 mr-2" />}
                                <span className={`text-sm font-medium ${
                                  darkMode ? 'text-gray-300' : 'text-slate-600'
                                }`}>
                                  {activity.title}
                                </span>
                              </div>
                              <p className={`text-sm mb-3 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {activity.content}
                              </p>
                            </div>
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-slate-400'
                            }`}>
                              {activity.time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex space-x-4">
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 text-red-500 mr-1" />
                                <span className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                  {activity.likes}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="w-4 h-4 text-blue-500 mr-1" />
                                <span className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                  {activity.comments}
                                </span>
                              </div>
                            </div>
                            <button className={`p-1 rounded-full ${
                              darkMode 
                                ? 'text-gray-400 hover:bg-gray-600 hover:text-white' 
                                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                            }`}>
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredActivity.map((activity) => (
                        <div 
                          key={activity.id}
                          className={`flex items-start p-4 rounded-2xl transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          <div className={`mr-4 mt-1 p-2 rounded-lg ${
                            activity.type === 'post' ? 'bg-blue-500/20 text-blue-500' :
                            activity.type === 'comment' ? 'bg-green-500/20 text-green-500' :
                            activity.type === 'like' ? 'bg-red-500/20 text-red-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {activity.type === 'post' && <Grid className="w-5 h-5" />}
                            {activity.type === 'comment' && <MessageSquare className="w-5 h-5" />}
                            {activity.type === 'like' && <Heart className="w-5 h-5" />}
                            {activity.type === 'achievement' && <Award className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className={`font-medium ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {activity.title}
                              </h3>
                              <span className={`text-sm ${
                                darkMode ? 'text-gray-500' : 'text-slate-400'
                              }`}>
                                {activity.time}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 mb-3 ${
                              darkMode ? 'text-gray-400' : 'text-slate-500'
                            }`}>
                              {activity.content}
                            </p>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 text-red-500 mr-1" />
                                <span className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                  {activity.likes}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="w-4 h-4 text-blue-500 mr-1" />
                                <span className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                  {activity.comments}
                                </span>
                              </div>
                              <button className={`flex items-center text-sm ${
                                darkMode 
                                  ? 'text-gray-400 hover:text-white' 
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}>
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Email Notifications
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Receive email updates about your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.email"
                            checked={formData.notifications.email}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Product Updates
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Receive updates about new features
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.product"
                            checked={formData.notifications.product}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Security Alerts
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Get notified about security events
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.security"
                            checked={formData.notifications.security}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={handleSaveNotifications}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Notification Settings
                  </h2>
                  <div className="space-y-4">
                    <div className={`p-6 rounded-2xl text-center ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <Bell className={`w-12 h-12 mx-auto mb-4 ${
                        darkMode ? 'text-gray-500' : 'text-slate-400'
                      }`} />
                      <h3 className={`text-xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Notifications Have Been Simplified
                      </h3>
                      <p className={`mb-4 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        We've streamlined our notification system to reduce clutter and improve your experience. 
                        You'll now receive only the most important updates directly in the app.
                      </p>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                        darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>Essential notifications only</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Security Settings
                  </h2>
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Shield className="w-5 h-5 mr-2" />
                        Change Password
                      </h3>
                      <p className={`mb-4 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Ensure your account security by regularly updating your password.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                darkMode 
                                  ? 'bg-gray-700/50 border-gray-600 text-white' 
                                  : 'bg-white border-slate-200 text-slate-900'
                              }`}
                              placeholder="Enter current password"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3.5"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? 
                                <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`} /> : 
                                <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`} />
                              }
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600 text-white' 
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600 text-white' 
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Password must be at least 6 characters long and should include a mix of letters, numbers, and symbols for better security.
                        </p>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button 
                          onClick={handleSaveSecurity}
                          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow hover:shadow-md"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Shield className="w-5 h-5 mr-2" />
                        Two-Factor Authentication
                      </h3>
                      <p className={`mb-4 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            Two-Factor Authentication
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            Not enabled
                          </p>
                        </div>
                        <button className={`px-4 py-2 rounded-lg font-medium ${
                          darkMode 
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}>
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${
                      darkMode 
                        ? 'bg-red-900/20 border-red-900/30' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <h3 className={`font-bold mb-2 flex items-center ${
                        darkMode ? 'text-red-200' : 'text-red-800'
                      }`}>
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Delete Account
                      </h3>
                      <p className={`text-sm mb-4 ${
                        darkMode ? 'text-red-300' : 'text-red-700'
                      }`}>
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Appearance Settings
                  </h2>
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Palette className="w-5 h-5 mr-2" />
                        Theme Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              appearance: {
                                ...formData.appearance,
                                theme: 'light'
                              }
                            })
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            formData.appearance.theme === 'light'
                              ? 'border-indigo-500 bg-indigo-500/20 shadow-md'
                              : darkMode 
                                ? 'border-gray-600 hover:border-gray-500' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-3 shadow-md"></div>
                            <span className={`font-medium ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              Light
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              appearance: {
                                ...formData.appearance,
                                theme: 'dark'
                              }
                            })
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            formData.appearance.theme === 'dark'
                              ? 'border-indigo-500 bg-indigo-500/20 shadow-md'
                              : darkMode 
                                ? 'border-gray-600 hover:border-gray-500' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 mb-3 shadow-md"></div>
                            <span className={`font-medium ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              Dark
                            </span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              appearance: {
                                ...formData.appearance,
                                theme: 'system'
                              }
                            })
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            formData.appearance.theme === 'system'
                              ? 'border-indigo-500 bg-indigo-500/20 shadow-md'
                              : darkMode 
                                ? 'border-gray-600 hover:border-gray-500' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 mb-3 shadow-md"></div>
                            <span className={`font-medium ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              System
                            </span>
                          </div>
                        </button>
                      </div>
                      <div className="mt-4 text-center">
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {formData.appearance.theme === 'light' && 'Light theme is currently active'}
                          {formData.appearance.theme === 'dark' && 'Dark theme is currently active'}
                          {formData.appearance.theme === 'system' && `System theme is currently active (${darkMode ? 'Dark' : 'Light'} mode)`}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Settings className="w-5 h-5 mr-2" />
                        Accent Color
                      </h3>
                      <p className={`mb-4 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Choose a color that will be used for highlights and interactive elements throughout the application.
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                        {['#8B5CF6', '#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#EC4899'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                appearance: {
                                  ...formData.appearance,
                                  accentColor: color
                                }
                              })
                            }}
                            className={`w-12 h-12 rounded-full border-2 transition-all transform hover:scale-110 ${
                              formData.appearance.accentColor === color
                                ? 'border-white ring-2 ring-offset-2 ring-indigo-500 scale-110'
                                : darkMode 
                                  ? 'border-gray-600' 
                                  : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select ${color} as accent color`}
                          />
                        ))}
                      </div>
                      <div className="mt-4">
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Custom Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={formData.appearance.accentColor}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                appearance: {
                                  ...formData.appearance,
                                  accentColor: e.target.value
                                }
                              })
                            }}
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.appearance.accentColor}
                            onChange={(e) => {
                              // Validate hex color format
                              const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                              if (hexRegex.test(e.target.value) || e.target.value === '') {
                                setFormData({
                                  ...formData,
                                  appearance: {
                                    ...formData.appearance,
                                    accentColor: e.target.value
                                  }
                                })
                              }
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600 text-white' 
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            placeholder="#8B5CF6"
                          />
                        </div>
                      </div>
                      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${formData.appearance.accentColor}20` }}>
                        <p className="text-sm" style={{ color: formData.appearance.accentColor }}>
                          This is a preview of your selected accent color. It will be applied to buttons, links, and other interactive elements throughout the application.
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-2xl ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`font-bold mb-4 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Globe className="w-5 h-5 mr-2" />
                        Language
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Interface Language
                          </label>
                          <select
                            name="appearance.language"
                            value={formData.appearance.language}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                              darkMode 
                                ? 'bg-gray-700/50 border-gray-600 text-white' 
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={handleSaveAppearance}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        Save Appearance
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Billing Information
                  </h2>
                  <div className="space-y-6">
                    {/* Subscription Plan Card */}
                    <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-xl font-bold flex items-center ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Subscription Plan
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Active
                        </span>
                      </div>
                      
                      <div className={`p-5 rounded-xl mb-6 ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white'
                      }`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <h4 className={`text-2xl font-bold mb-2 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              Pro Plan
                            </h4>
                            <p className={`${
                              darkMode ? 'text-gray-300' : 'text-slate-600'
                            }`}>
                              Full access to all features and unlimited usage
                            </p>
                          </div>
                          <div className={`mt-4 md:mt-0 text-right ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            <div className="text-3xl font-bold">$19.99</div>
                            <div className="text-sm">per month</div>
                          </div>
                        </div>
                        
                        <div className={`mt-4 pt-4 border-t ${
                          darkMode ? 'border-gray-600' : 'border-slate-200'
                        }`}>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className={`text-xl font-bold ${
                                darkMode ? 'text-indigo-400' : 'text-indigo-600'
                              }`}>
                                Unlimited
                              </div>
                              <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                Comparisons
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`text-xl font-bold ${
                                darkMode ? 'text-indigo-400' : 'text-indigo-600'
                              }`}>
                                100GB
                              </div>
                              <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                Storage
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`text-xl font-bold ${
                                darkMode ? 'text-indigo-400' : 'text-indigo-600'
                              }`}>
                                Priority
                              </div>
                              <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                Support
                              </div>
                            </div>
                            <div className="text-center">
                              <div className={`text-xl font-bold ${
                                darkMode ? 'text-indigo-400' : 'text-indigo-600'
                              }`}>
                                24/7
                              </div>
                              <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                Access
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow hover:shadow-md">
                          Upgrade Plan
                        </button>
                        <button className={`py-3 px-6 rounded-xl font-medium transition-all ${
                          darkMode 
                            ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                            : 'bg-white hover:bg-gray-50 text-slate-900 border border-slate-200'
                        }`}>
                          View Invoices
                        </button>
                      </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`text-xl font-bold mb-6 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Methods
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Primary Payment Method */}
                        <div className={`p-4 rounded-xl ${
                          darkMode ? 'bg-gray-700/50' : 'bg-white'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-14 h-10 rounded-md flex items-center justify-center ${
                                darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                              }`}>
                                <span className={`font-bold text-lg ${
                                  darkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}>VISA</span>
                              </div>
                              <div>
                                <div className={`font-medium flex items-center ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  Visa ending in 1234
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    darkMode 
                                      ? 'bg-green-900/30 text-green-400' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    Primary
                                  </span>
                                </div>
                                <div className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                  Expires 12/2026
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className={`p-2 rounded-lg ${
                                darkMode 
                                  ? 'text-gray-400 hover:bg-gray-600 hover:text-white' 
                                  : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                              }`}>
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Payment Method */}
                        <div className={`p-4 rounded-xl ${
                          darkMode ? 'bg-gray-700/50' : 'bg-white'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-14 h-10 rounded-md flex items-center justify-center ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                                <span className={`font-bold text-lg ${
                                  darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>MC</span>
                              </div>
                              <div>
                                <div className={`font-medium ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  Mastercard ending in 5678
                                </div>
                                <div className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                  Expires 06/2025
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className={`p-2 rounded-lg ${
                                darkMode 
                                  ? 'text-gray-400 hover:bg-gray-600 hover:text-white' 
                                  : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                              }`}>
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                          darkMode 
                            ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                            : 'bg-white hover:bg-gray-50 text-slate-900 border border-slate-200'
                        }`}>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Add Payment Method
                        </button>
                      </div>
                    </div>
                    
                    {/* Billing History */}
                    <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                    }`}>
                      <h3 className={`text-xl font-bold mb-6 flex items-center ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Billing History
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`${
                              darkMode ? 'text-gray-400' : 'text-slate-600'
                            }`}>
                              <th className="text-left py-3 px-2 text-sm font-medium">Date</th>
                              <th className="text-left py-3 px-2 text-sm font-medium">Description</th>
                              <th className="text-left py-3 px-2 text-sm font-medium">Amount</th>
                              <th className="text-left py-3 px-2 text-sm font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className={`${darkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
                              <td className={`py-3 px-2 ${
                                darkMode ? 'text-gray-300' : 'text-slate-700'
                              }`}>Oct 1, 2025</td>
                              <td className={`py-3 px-2 ${
                                darkMode ? 'text-gray-300' : 'text-slate-700'
                              }`}>Pro Plan Subscription</td>
                              <td className={`py-3 px-2 font-medium ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>$19.99</td>
                              <td className={`py-3 px-2`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  darkMode 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  Paid
                                </span>
                              </td>
                            </tr>
                            <tr className={`${darkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
                              <td className={`py-3 px-2 ${
                                darkMode ? 'text-gray-300' : 'text-slate-700'
                              }`}>Sep 1, 2025</td>
                              <td className={`py-3 px-2 ${
                                darkMode ? 'text-gray-300' : 'text-slate-700'
                              }`}>Pro Plan Subscription</td>
                              <td className={`py-3 px-2 font-medium ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>$19.99</td>
                              <td className={`py-3 px-2`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  darkMode 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  Paid
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className={`py-3 px-2 ${
                                darkMode ? 'text-gray-300' : 'text-slate-700'
                              }`}>Aug 1, 2025</td>
                              <td className={`py-3 px-2 ${
                                darkMode ? 'text-gray-300' : 'text-slate-700'
                              }`}>Pro Plan Subscription</td>
                              <td className={`py-3 px-2 font-medium ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>$19.99</td>
                              <td className={`py-3 px-2`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  darkMode 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  Paid
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}