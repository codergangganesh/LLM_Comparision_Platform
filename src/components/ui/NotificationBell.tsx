'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, User, MessageSquare, Settings, CreditCard } from 'lucide-react'

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new response from GPT-4",
      time: "2 minutes ago",
      icon: MessageSquare,
      read: false
    },
    {
      id: 2,
      title: "Account updated",
      description: "Your profile information has been updated",
      time: "1 hour ago",
      icon: User,
      read: true
    },
    {
      id: 3,
      title: "Payment successful",
      description: "Your subscription payment was processed successfully",
      time: "1 day ago",
      icon: CreditCard,
      read: true
    },
    {
      id: 4,
      title: "Settings changed",
      description: "Dark mode has been enabled on your account",
      time: "2 days ago",
      icon: Settings,
      read: true
    }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="p-2 rounded-lg hover:bg-gray-700/10 dark:hover:bg-gray-700/30 transition-colors duration-200 relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-5 h-5 text-slate-700 dark:text-white-200" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl transition-all duration-300 transform origin-top-right bg-white border-slate-200/50 dark:bg-gray-800 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden z-50">
          <div className="py-2">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200/30 dark:border-gray-700/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Notifications
              </h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-slate-500 dark:text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 border-b border-slate-100/50 dark:border-gray-700/30 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          !notification.read 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            !notification.read 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-xs mt-1 ${
                            !notification.read 
                              ? 'text-slate-600 dark:text-gray-400' 
                              : 'text-slate-500 dark:text-gray-500'
                          }`}>
                            {notification.description}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-200/30 dark:border-gray-700/50">
              <button 
                className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                onClick={() => setShowNotifications(false)}
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell