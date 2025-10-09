'use client'

import React from 'react'

interface BarChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  unit?: string
}

const BarChart: React.FC<BarChartProps> = ({ data, title, unit = '' }) => {
  // Find the maximum value for scaling
  const maxValue = data.length > 0 ? Math.max(...data.map(item => item.value), 0) : 1
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center h-32">
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

export default BarChart