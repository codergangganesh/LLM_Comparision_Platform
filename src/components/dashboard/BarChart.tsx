'use client'

import React from 'react'

interface BarChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  unit?: string
}

const BarChart: React.FC<BarChartProps> = ({ data, title, unit = '' }) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value), 0)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 dark:text-gray-300 truncate">{item.name}</div>
            <div className="flex-1 ml-2">
              <div className="flex items-center">
                <div 
                  className="h-6 rounded-md" 
                  style={{ 
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: item.color
                  }}
                ></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {item.value}{unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarChart