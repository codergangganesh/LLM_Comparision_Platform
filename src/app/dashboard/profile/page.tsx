'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Camera, User, Mail, Calendar, Shield, Bell, Palette, Globe } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  
  // Mock user data
  const userData = {
    name: 'User Name',
    email: 'user@example.com',
    joinDate: 'January 2024',
    avatar: '/avatar.png'
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-slate-600 dark:text-gray-400">Manage your profile information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-700/50 p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                    <span className="text-2xl font-bold text-white">UN</span>
                  </div>
                  <button className="absolute bottom-4 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors">
                    <Camera className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{userData.name}</h2>
                <p className="text-slate-600 dark:text-gray-400 text-sm">{userData.email}</p>
              </div>

              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-gray-700/50 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userData.name}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            defaultValue={userData.email}
                            disabled
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                          />
                          <Mail className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                        Member Since
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          defaultValue={userData.joinDate}
                          disabled
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                        />
                        <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Receive email updates about your account</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition"></span>
                        <span className="absolute h-4 w-4 bg-white rounded-full shadow-md top-1 left-1 transition-transform transform translate-x-6"></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Product Updates</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Receive updates about new features</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="opacity-0 w-0 h-0" />
                        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition"></span>
                        <span className="absolute h-4 w-4 bg-white rounded-full shadow-md top-1 left-1 transition-transform"></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Security Alerts</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">Get notified about security events</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition"></span>
                        <span className="absolute h-4 w-4 bg-white rounded-full shadow-md top-1 left-1 transition-transform transform translate-x-6"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-medium text-slate-900 dark:text-white mb-2">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow hover:shadow-md">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
                      <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Appearance Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-4">Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border-2 border-indigo-500 rounded-2xl p-4 cursor-pointer bg-white dark:bg-gray-800">
                          <div className="bg-slate-200 dark:bg-gray-700 h-32 rounded-lg mb-3"></div>
                          <div className="text-center">
                            <div className="font-medium text-slate-900 dark:text-white">Light</div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">Default theme</div>
                          </div>
                        </div>
                        <div className="border-2 border-transparent rounded-2xl p-4 cursor-pointer hover:border-slate-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800">
                          <div className="bg-gray-800 h-32 rounded-lg mb-3"></div>
                          <div className="text-center">
                            <div className="font-medium text-slate-900 dark:text-white">Dark</div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">Reduced eye strain</div>
                          </div>
                        </div>
                        <div className="border-2 border-transparent rounded-2xl p-4 cursor-pointer hover:border-slate-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800">
                          <div className="bg-gradient-to-br from-slate-900 to-slate-700 h-32 rounded-lg mb-3"></div>
                          <div className="text-center">
                            <div className="font-medium text-slate-900 dark:text-white">System</div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">Follow system</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-4">Language</h3>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors appearance-none">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                        <Globe className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
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