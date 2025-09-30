'use client'

import React from 'react'
import { Bell } from 'lucide-react'

const NotificationBell = () => {
  return (
    <button className="p-2 rounded-lg hover:bg-gray-700/10 dark:hover:bg-gray-700/30 transition-colors duration-200 relative">
      <Bell className="w-5 h-5 text-slate-700 dark:text-gray-300" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
  )
}

export default NotificationBell