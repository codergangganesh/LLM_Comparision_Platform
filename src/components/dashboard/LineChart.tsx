'use client'

import React from 'react'

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
  
  const minValue = Math.min(...allValues, 0)
  const maxValue = Math.max(...allValues, 0)
  const range = maxValue - minValue || 1 // Avoid division by zero
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
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
              const colorClasses = [
                'text-blue-500',
                'text-purple-500',
                'text-green-500',
                'text-amber-500',
                'text-pink-500'
              ]
              
              return (
                <div key={metric} className="absolute inset-0 ml-8">
                  {/* Points and lines */}
                  {data.map((point, index) => {
                    if (typeof point[metric] !== 'number') return null
                    
                    const value = point[metric] as number
                    const x = (index / (data.length - 1 || 1)) * 100
                    const y = 100 - ((value - minValue) / range) * 100
                    
                    return (
                      <React.Fragment key={index}>
                        {/* Line to next point */}
                        {index < data.length - 1 && typeof data[index + 1][metric] === 'number' && (
                          <div
                            className={`absolute h-0.5 ${colorClasses[metricIndex % colorClasses.length].replace('text-', 'bg-')}`}
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
                          className={`absolute w-3 h-3 rounded-full ${colorClasses[metricIndex % colorClasses.length].replace('text-', 'bg-')} border-2 border-white dark:border-gray-800`}
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
          {metrics.map((metric, index) => {
            const colorClasses = [
              'bg-blue-500',
              'bg-purple-500',
              'bg-green-500',
              'bg-amber-500',
              'bg-pink-500'
            ]
            
            return (
              <div key={metric} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${colorClasses[index % colorClasses.length]}`}></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {metricLabels[metric] || metric}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LineChart