'use client'

import React from 'react'

interface ResponseTimeDistributionProps {
  data: { name: string; value: number; color: string }[]
  title: string
  unit?: string
}

const ResponseTimeDistribution: React.FC<ResponseTimeDistributionProps> = ({ data, title, unit = '' }) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value), 0)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <div className="w-1/4 text-sm font-medium text-gray-500 dark:text-gray-400">Model</div>
            <div className="w-1/4 text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</div>
            <div className="w-2/4 text-sm font-medium text-gray-500 dark:text-gray-400">Distribution</div>
          </div>
          
          {/* Data rows */}
          {data.map((item, index) => (
            <div key={index} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-1/4">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
              </div>
              <div className="w-1/4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.value}{unit}
                </span>
              </div>
              <div className="w-2/4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResponseTimeDistribution