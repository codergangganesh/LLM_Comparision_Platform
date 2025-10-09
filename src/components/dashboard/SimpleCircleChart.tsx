'use client'

import React from 'react'

interface SimpleCircleChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
}

const SimpleCircleChart: React.FC<SimpleCircleChartProps> = ({ data, title }) => {
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
        {title}
      </h3>
      {data.length > 0 ? (
        <div className="flex items-center">
          {/* Simple circle with total count */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-full w-32 h-32 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{total}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Messages</span>
              </div>
            </div>
          </div>
          
          {/* Legend on the right side */}
          <div className="ml-6 w-full">
            {data.map((segment, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                    {segment.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {segment.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center font-medium">
            No data available
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-center text-sm mt-1">
            History has been cleared
          </p>
        </div>
      )}
    </div>
  )
}

export default SimpleCircleChart