'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import SharedSidebar from '@/components/layout/SharedSidebar'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'

import {
  User,
  Bell,
  Shield,
  Palette,
  Camera,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function DashboardProfileRedirect() {
  const router = useOptimizedRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { setPageLoading } = useOptimizedLoading()
  
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

  return <ProfileContent user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
}

function ProfileContent({ user, darkMode, toggleDarkMode }: { 
  user: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null, 
  darkMode: boolean, 
  toggleDarkMode: () => void 
}) {
  // Form data state
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    joinDate: 'January 2024',
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
      language: 'en'
    }
  })

  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      joinDate: 'January 2024',
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
        language: 'en'
      }
    })
  }, [user, darkMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  }

  const handleSaveNotifications = () => {
    setSaveStatus({type: 'success', message: 'Notification preferences updated!'})
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  const handleSaveSecurity = () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setSaveStatus({type: 'error', message: 'New passwords do not match.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    setSaveStatus({type: 'success', message: 'Password updated successfully!'})
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  const handleSaveAppearance = () => {
    // Handle theme change
    if (formData.appearance.theme === 'dark' && !darkMode) {
      toggleDarkMode()
    } else if (formData.appearance.theme === 'light' && darkMode) {
      toggleDarkMode()
    }
    
    setSaveStatus({type: 'success', message: 'Appearance settings updated!'})
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  // Function to get user display name
  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User')
  }

  // Function to get user avatar or initial
  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return (
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className="w-24 h-24 rounded-full object-cover"
        />
      )
    }
    
    const displayName = getUserDisplayName()
    const initial = displayName.charAt(0).toUpperCase()
    
    return (
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
        <span className="text-2xl font-bold text-white">
          {initial}
        </span>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <SharedSidebar />
      
      {/* Adjusted layout to match chat interface with flex and responsive margins */}
      <div className="lg:ml-80 ml-16 transition-all duration-300">
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <h1 className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Profile Settings
            </h1>
            <p className={`mt-1 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Manage your profile information and preferences
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    {getUserAvatar()}
                    <button className="absolute bottom-4 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors">
                      <Camera className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                    </button>
                  </div>
                  <h2 className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {getUserDisplayName()}
                  </h2>
                  <p className={`text-sm transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Member since {formData.joinDate}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                {/* Save Status Notification */}
                {saveStatus.type && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                    saveStatus.type === 'success' 
                      ? darkMode 
                        ? 'bg-green-900/30 border border-green-700/50 text-green-300' 
                        : 'bg-green-50 border border-green-200 text-green-700'
                      : darkMode 
                        ? 'bg-red-900/30 border border-red-700/50 text-red-300' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{saveStatus.message}</span>
                  </div>
                )}

                {/* Profile Section */}
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Profile Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className={`my-8 h-px ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-200/50'
                }`}></div>

                {/* Notifications Section */}
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Notifications
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium transition-colors duration-200 ${
                          darkMode ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          Email Notifications
                        </h3>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Receive email notifications about your account
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
                        <div className={`w-11 h-6 rounded-full peer ${
                          darkMode 
                            ? 'bg-gray-700 peer-checked:bg-blue-600' 
                            : 'bg-slate-300 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium transition-colors duration-200 ${
                          darkMode ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          Product Updates
                        </h3>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Get notified about new features and updates
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
                        <div className={`w-11 h-6 rounded-full peer ${
                          darkMode 
                            ? 'bg-gray-700 peer-checked:bg-blue-600' 
                            : 'bg-slate-300 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium transition-colors duration-200 ${
                          darkMode ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          Security Alerts
                        </h3>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Important notifications about your account security
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
                        <div className={`w-11 h-6 rounded-full peer ${
                          darkMode 
                            ? 'bg-gray-700 peer-checked:bg-blue-600' 
                            : 'bg-slate-300 peer-checked:bg-blue-600'
                        } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleSaveNotifications}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className={`my-8 h-px ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-200/50'
                }`}></div>

                {/* Security Section */}
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Security
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                        placeholder="Enter your current password"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                        placeholder="Enter your new password"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleSaveSecurity}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className={`my-8 h-px ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-200/50'
                }`}></div>

                {/* Appearance Section */}
                <div>
                  <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Appearance
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Theme
                      </label>
                      <select
                        name="appearance.theme"
                        value={formData.appearance.theme}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Language
                      </label>
                      <select
                        name="appearance.language"
                        value={formData.appearance.language}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600/50 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400' 
                            : 'bg-white border-slate-200/50 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400'
                        }`}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleSaveAppearance}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Appearance</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
