'use client'

import React from 'react'
import { dashboardService } from '@/services/dashboard.service'
import { AI_MODELS } from '@/config/ai-models'

interface LineChartProps {
  data: { period: string; [key: string]: string | number }[]
  title: string
  metrics: string[]
  metricLabels: Record<string, string>
}

const LineChart: React.FC<LineChartProps> = ({ data, title, metrics, metricLabels }) => {
  // Find min and max values for scaling
  let allValues: number[] = []
  metrics.forEach(metric => {
    data.forEach(d => {
      if (typeof d[metric] === 'number') {
        allValues.push(d[metric] as number)
      }
    })
  })
  
  const minValue = allValues.length > 0 ? Math.min(...allValues, 0) : 0
  const maxValue = allValues.length > 0 ? Math.max(...allValues, 0) : 1
  const range = maxValue - minValue || 1 // Avoid division by zero
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 && metrics.length > 0 ? (
        <div className="h-64">
          {/* Simple line chart representation */}
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{maxValue.toFixed(1)}</span>
              <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
              <span>{minValue.toFixed(1)}</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-8 h-full">
              {/* Grid lines */}
              <div className="absolute inset-0 ml-8 border-l border-b border-gray-200 dark:border-gray-700">
                {[0, 1, 2, 3, 4].map(i => (
                  <div 
                    key={i} 
                    className="absolute left-0 right-0 h-px bg-gray-100 dark:bg-gray-700"
                    style={{ top: `${(i / 4) * 100}%` }}
                  ></div>
                ))}
              </div>
              
              {/* Lines for each metric */}
              {metrics.map((metric, metricIndex) => {
                // Get distinct color for this model
                const model = AI_MODELS.find(m => m.displayName === metric);
                const color = dashboardService.getModelColor(model?.id || metric);
                
                return (
                  <div key={metric} className="absolute inset-0 ml-8">
                    {/* Points and lines */}
                    {data.map((point, index) => {
                      if (typeof point[metric] !== 'number') return null
                      
                      const value = point[metric] as number
                      const x = (index / (data.length - 1 || 1)) * 100
                      const y = 100 - ((value - minValue) / range) * 100
                      
                      // Convert hex color to Tailwind-compatible class
                      const getColorClass = (hexColor: string) => {
                        // Simple mapping of hex colors to Tailwind classes
                        const colorMap: Record<string, string> = {
                          '#3B82F6': 'bg-blue-500',
                          '#8B5CF6': 'bg-purple-500',
                          '#10B981': 'bg-green-500',
                          '#F59E0B': 'bg-amber-500',
                          '#EF4444': 'bg-red-500',
                          '#06B6D4': 'bg-cyan-500',
                          '#EC4899': 'bg-pink-500',
                          '#6366F1': 'bg-indigo-500',
                          '#14B8A6': 'bg-teal-500',
                          '#F97316': 'bg-orange-500',
                          '#A855F7': 'bg-violet-500',
                          '#0EA5E9': 'bg-sky-500',
                          '#22C55E': 'bg-emerald-500',
                          '#EAB308': 'bg-yellow-500',
                          '#F43F5E': 'bg-rose-500',
                          '#0D9488': 'bg-teal-600',
                          '#C026D3': 'bg-fuchsia-500',
                          '#4F46E5': 'bg-indigo-600',
                          '#DC2626': 'bg-red-600'
                        }
                        return colorMap[hexColor] || 'bg-gray-500'
                      }
                      
                      const colorClass = getColorClass(color)
                      
                      return (
                        <React.Fragment key={index}>
                          {/* Line to next point */}
                          {index < data.length - 1 && typeof data[index + 1][metric] === 'number' && (
                            <div
                              className={`absolute h-0.5 ${colorClass}`}
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: `${(1 / (data.length - 1 || 1)) * 100}%`,
                                transform: 'translateY(-50%)'
                              }}
                            ></div>
                          )}
                          
                          {/* Point */}
                          <div
                            className={`absolute w-3 h-3 rounded-full ${colorClass} border-2 border-white dark:border-gray-800`}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          ></div>
                        </React.Fragment>
                      )
                    })}
                  </div>
                )
              })}
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                {data.map((point, index) => (
                  <span key={index}>{point.period}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            {metrics.map((metric) => {
              // Get distinct color for this model
              const model = AI_MODELS.find(m => m.displayName === metric);
              const color = dashboardService.getModelColor(model?.id || metric);
              
              // Convert hex color to Tailwind-compatible class for legend
              const getColorClass = (hexColor: string) => {
                const colorMap: Record<string, string> = {
                  '#3B82F6': 'bg-blue-500',
                  '#8B5CF6': 'bg-purple-500',
                  '#10B981': 'bg-green-500',
                  '#F59E0B': 'bg-amber-500',
                  '#EF4444': 'bg-red-500',
                  '#06B6D4': 'bg-cyan-500',
                  '#EC4899': 'bg-pink-500',
                  '#6366F1': 'bg-indigo-500',
                  '#14B8A6': 'bg-teal-500',
                  '#F97316': 'bg-orange-500',
                  '#A855F7': 'bg-violet-500',
                  '#0EA5E9': 'bg-sky-500',
                  '#22C55E': 'bg-emerald-500',
                  '#EAB308': 'bg-yellow-500',
                  '#F43F5E': 'bg-rose-500',
                  '#0D9488': 'bg-teal-600',
                  '#C026D3': 'bg-fuchsia-500',
                  '#4F46E5': 'bg-indigo-600',
                  '#DC2626': 'bg-red-600'
                }
                return colorMap[hexColor] || 'bg-gray-500'
              }
              
              const colorClass = getColorClass(color)
              
              return (
                <div key={metric} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    {metricLabels[metric] || metric}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">No data available<br/><span className="text-sm">History has been cleared</span></p>
        </div>
      )}
    </div>
  )
}

export default LineChart