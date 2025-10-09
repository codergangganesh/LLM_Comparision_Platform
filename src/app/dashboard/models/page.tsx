'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import SharedSidebar from '@/components/layout/SharedSidebar'
import { useOptimizedRouter } from '@/hooks/useOptimizedRouter'
import OptimizedPageTransitionLoader from '@/components/ui/OptimizedPageTransitionLoader'
import { useOptimizedLoading } from '@/contexts/OptimizedLoadingContext'

export default function ModelsPage() {
  const { user, loading } = useAuth()
  const router = useOptimizedRouter()
  const { darkMode } = useDarkMode()
  const { setPageLoading } = useOptimizedLoading()

  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!loading && !user) {
      setPageLoading(true, "Redirecting to authentication...");
      router.push('/auth')
    } else if (user && !loading) {
      setPageLoading(false);
    }
  }, [user, loading, router, setPageLoading])

  // Show loading while checking auth status
  if (loading) {
    return <OptimizedPageTransitionLoader message="Loading models..." />;
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <SharedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <h1 className={`text-3xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              AI Models
            </h1>
            <p className={`mt-1 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Manage and compare your AI models
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className={`rounded-2xl p-8 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Model Management
            </h2>
            <p className={`transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              This page allows you to manage your AI models, view their specifications, and compare their capabilities.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`rounded-xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/50' 
                  : 'bg-slate-100'
              }`}>
                <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Model Library
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Browse and manage all available AI models in your library.
                </p>
              </div>
              <div className={`rounded-xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/50' 
                  : 'bg-slate-100'
              }`}>
                <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Model Comparison
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Compare different AI models side-by-side based on various metrics.
                </p>
              </div>
              <div className={`rounded-xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700/50' 
                  : 'bg-slate-100'
              }`}>
                <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Model Performance
                </h3>
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  View detailed performance reports for each AI model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}