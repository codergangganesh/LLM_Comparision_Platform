'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useLoading } from '@/contexts/LoadingContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Key, 
  Lock, 
  Smartphone, 
  Mail, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone as MobileIcon,
  Tablet
} from 'lucide-react'

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { showLoading, hideLoading } = useLoading()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: 'friends'
    },
    appearance: {
      theme: darkMode ? 'dark' : 'light',
      language: 'en'
    }
  })
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})

  // Redirect unauthenticated users to the auth page
  if (loading || !user) {
    return null
  }

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
      } else if (name.startsWith('privacy.')) {
        const privacyType = name.split('.')[1]
        setFormData({
          ...formData,
          privacy: {
            ...formData.privacy,
            [privacyType]: value
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

  const handleSaveProfile = async () => {
    showLoading('Saving profile...')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus({type: 'success', message: 'Profile updated successfully!'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update profile. Please try again.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } finally {
      hideLoading()
    }
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
    
    showLoading('Updating password...')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus({type: 'success', message: 'Password updated successfully!'})
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      })
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update password. Please try again.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } finally {
      hideLoading()
    }
  }

  const handleSaveNotifications = async () => {
    showLoading('Saving notification preferences...')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus({type: 'success', message: 'Notification preferences updated!'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update notifications. Please try again.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } finally {
      hideLoading()
    }
  }

  const handleSaveAppearance = async () => {
    showLoading('Saving appearance settings...')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus({type: 'success', message: 'Appearance settings updated!'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update appearance. Please try again.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } finally {
      hideLoading()
    }
  }

  const handleSavePrivacy = async () => {
    showLoading('Saving privacy settings...')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveStatus({type: 'success', message: 'Privacy settings updated!'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update privacy settings. Please try again.'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
    } finally {
      hideLoading()
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showLoading('Deleting account...')
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        await signOut()
        router.push('/auth')
      } catch (error) {
        setSaveStatus({type: 'error', message: 'Failed to delete account. Please try again.'})
        setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
        hideLoading()
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Lock }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      {/* Adjusted layout to match chat interface with flex and responsive margins */}
      <div className="lg:ml-80 ml-0 transition-all duration-300 pt-16 lg:pt-0">
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <h1 className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Settings
            </h1>
            <p className={`mt-1 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Manage your account preferences and security settings
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-indigo-500 text-white shadow-md'
                            : `${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-slate-700 hover:bg-slate-100'}`
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
                
                {/* Security Tips Section */}
                {activeTab === 'security' && (
                  <div className={`mt-6 p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/30' : 'bg-blue-50'
                  }`}>
                    <h3 className={`font-bold mb-2 flex items-center ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      <Shield className="w-4 h-4 mr-2" />
                      Security Tips
                    </h3>
                    <ul className={`text-sm space-y-1 ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Regularly review account activity</li>
                    </ul>
                  </div>
                )}
                
                {/* Usage Insights */}
                {activeTab === 'profile' && (
                  <div className={`mt-6 p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/30' : 'bg-green-50'
                  }`}>
                    <h3 className={`font-bold mb-2 flex items-center ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Account Status
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Your account is verified and secure.
                    </p>
                  </div>
                )}
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
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Profile Information
                    </h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Full Name
                          </label>
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
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled
                              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                darkMode 
                                  ? 'bg-gray-700/50 border-gray-600 text-gray-400' 
                                  : 'bg-slate-50 border-slate-200 text-slate-500'
                              }`}
                            />
                            <Mail className={`absolute right-3 top-3.5 w-5 h-5 ${
                              darkMode ? 'text-gray-500' : 'text-slate-400'
                            }`} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={handleSaveProfile}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Security Settings
                    </h2>
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl ${
                        darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                      }`}>
                        <h3 className={`font-bold mb-4 flex items-center ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          <Key className="w-5 h-5 mr-2" />
                          Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
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
                        </div>
                        <div className="mt-4">
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
                        <div className="flex justify-end mt-6">
                          <button 
                            onClick={handleSaveSecurity}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow hover:shadow-md"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                      
                      <div className={`p-6 rounded-xl border ${
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
                        <button 
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Notification Preferences
                    </h2>
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl ${
                        darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                      }`}>
                        <h3 className={`font-bold mb-4 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          Communication Channels
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail className={`w-5 h-5 mr-3 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`} />
                              <div>
                                <p className={`font-medium ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  Email Notifications
                                </p>
                                <p className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                  Receive updates and alerts via email
                                </p>
                              </div>
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
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone className={`w-5 h-5 mr-3 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`} />
                              <div>
                                <p className={`font-medium ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  Push Notifications
                                </p>
                                <p className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                  Receive real-time alerts on your device
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications.push"
                                checked={formData.notifications.push}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone className={`w-5 h-5 mr-3 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`} />
                              <div>
                                <p className={`font-medium ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  SMS Notifications
                                </p>
                                <p className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-slate-600'
                                }`}>
                                  Receive important alerts via text message
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications.sms"
                                checked={formData.notifications.sms}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
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
                
                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Appearance Settings
                    </h2>
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl ${
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
                              toggleDarkMode()
                              setFormData({
                                ...formData,
                                appearance: {
                                  ...formData.appearance,
                                  theme: 'dark'
                                }
                              })
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              darkMode
                                ? 'border-indigo-500 bg-indigo-500/20'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 mb-2"></div>
                              <span className={`font-medium ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                Dark
                              </span>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (darkMode) toggleDarkMode()
                              setFormData({
                                ...formData,
                                appearance: {
                                  ...formData.appearance,
                                  theme: 'light'
                                }
                              })
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              !darkMode
                                ? 'border-indigo-500 bg-indigo-500/20'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-2"></div>
                              <span className={`font-medium ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                Light
                              </span>
                            </div>
                          </button>
                          
                          <div className={`p-4 rounded-xl border-2 border-dashed ${
                            darkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}>
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 mb-2"></div>
                              <span className={`font-medium ${
                                darkMode ? 'text-gray-400' : 'text-slate-400'
                              }`}>
                                System
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-6 rounded-xl ${
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
                
                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Privacy Settings
                    </h2>
                    <div className="space-y-6">
                      <div className={`p-6 rounded-xl ${
                        darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                      }`}>
                        <h3 className={`font-bold mb-4 flex items-center ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          <Lock className="w-5 h-5 mr-2" />
                          Profile Visibility
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-slate-700'
                            }`}>
                              Who can see your profile?
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                formData.privacy.profileVisibility === 'public'
                                  ? 'bg-indigo-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700/50 text-gray-300' 
                                    : 'bg-slate-200 text-slate-700'
                              }`}>
                                <input
                                  type="radio"
                                  name="privacy.profileVisibility"
                                  value="public"
                                  checked={formData.privacy.profileVisibility === 'public'}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div>
                                  <p className="font-medium">Public</p>
                                  <p className={`text-xs ${
                                    formData.privacy.profileVisibility === 'public'
                                      ? 'text-indigo-100'
                                      : darkMode 
                                        ? 'text-gray-400' 
                                        : 'text-slate-500'
                                  }`}>
                                    Anyone can see your profile
                                  </p>
                                </div>
                              </label>
                              
                              <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                formData.privacy.profileVisibility === 'friends'
                                  ? 'bg-indigo-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700/50 text-gray-300' 
                                    : 'bg-slate-200 text-slate-700'
                              }`}>
                                <input
                                  type="radio"
                                  name="privacy.profileVisibility"
                                  value="friends"
                                  checked={formData.privacy.profileVisibility === 'friends'}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div>
                                  <p className="font-medium">Friends</p>
                                  <p className={`text-xs ${
                                    formData.privacy.profileVisibility === 'friends'
                                      ? 'text-indigo-100'
                                      : darkMode 
                                        ? 'text-gray-400' 
                                        : 'text-slate-500'
                                  }`}>
                                    Only friends can see your profile
                                  </p>
                                </div>
                              </label>
                              
                              <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                formData.privacy.profileVisibility === 'private'
                                  ? 'bg-indigo-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700/50 text-gray-300' 
                                    : 'bg-slate-200 text-slate-700'
                              }`}>
                                <input
                                  type="radio"
                                  name="privacy.profileVisibility"
                                  value="private"
                                  checked={formData.privacy.profileVisibility === 'private'}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div>
                                  <p className="font-medium">Private</p>
                                  <p className={`text-xs ${
                                    formData.privacy.profileVisibility === 'private'
                                      ? 'text-indigo-100'
                                      : darkMode 
                                        ? 'text-gray-400' 
                                        : 'text-slate-500'
                                  }`}>
                                    Only you can see your profile
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-6 rounded-xl ${
                        darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
                      }`}>
                        <h3 className={`font-bold mb-4 flex items-center ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          <Monitor className="w-5 h-5 mr-2" />
                          Activity Status
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-slate-700'
                            }`}>
                              Show your activity status to others
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                formData.privacy.activityStatus === 'everyone'
                                  ? 'bg-indigo-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700/50 text-gray-300' 
                                    : 'bg-slate-200 text-slate-700'
                              }`}>
                                <input
                                  type="radio"
                                  name="privacy.activityStatus"
                                  value="everyone"
                                  checked={formData.privacy.activityStatus === 'everyone'}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div>
                                  <p className="font-medium">Everyone</p>
                                  <p className={`text-xs ${
                                    formData.privacy.activityStatus === 'everyone'
                                      ? 'text-indigo-100'
                                      : darkMode 
                                        ? 'text-gray-400' 
                                        : 'text-slate-500'
                                  }`}>
                                    Show when you're online
                                  </p>
                                </div>
                              </label>
                              
                              <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                formData.privacy.activityStatus === 'friends'
                                  ? 'bg-indigo-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700/50 text-gray-300' 
                                    : 'bg-slate-200 text-slate-700'
                              }`}>
                                <input
                                  type="radio"
                                  name="privacy.activityStatus"
                                  value="friends"
                                  checked={formData.privacy.activityStatus === 'friends'}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div>
                                  <p className="font-medium">Friends Only</p>
                                  <p className={`text-xs ${
                                    formData.privacy.activityStatus === 'friends'
                                      ? 'text-indigo-100'
                                      : darkMode 
                                        ? 'text-gray-400' 
                                        : 'text-slate-500'
                                  }`}>
                                    Only friends see when you're online
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={handleSavePrivacy}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                          Save Privacy Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}