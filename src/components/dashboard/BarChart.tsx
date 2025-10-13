'use client'

import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'

interface BarChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  unit?: string
}

const BarChart: React.FC<BarChartProps> = ({ data, title, unit = '' }) => {
  // Find the maximum value for scaling
  const maxValue = data.length > 0 ? Math.max(...data.map(item => item.value), 0) : 1
  
  // Calculate average value for comparison
  const averageValue = data.length > 0 ? data.reduce((sum, item) => sum + item.value, 0) / data.length : 0
  
  const [hoveredItem, setHoveredItem] = useState<{name: string, value: number, percentage: number} | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  
  const handleMouseEnter = (e: React.MouseEvent, item: {name: string, value: number}) => {
    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
    setHoveredItem({
      name: item.name,
      value: item.value,
      percentage
    })
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }
  
  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        {data.length > 0 && (
          <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400 mr-1">Avg:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {averageValue.toFixed(2)}{unit}
            </span>
          </div>
        )}
      </div>
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item, index) => {
            // Calculate percentage difference from average
            const diffFromAvg = averageValue > 0 ? ((item.value - averageValue) / averageValue) * 100 : 0
            const isAboveAverage = diffFromAvg > 0
            
            return (
              <div 
                key={index} 
                className="flex items-center"
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-24 text-sm text-gray-600 dark:text-gray-300 truncate">{item.name}</div>
                <div className="flex-1 ml-2">
                  <div className="flex items-center">
                    <div 
                      className="h-6 rounded-md transition-all duration-500 ease-out cursor-pointer hover:opacity-90" 
                      style={{ 
                        width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {item.value}{unit}
                    </span>
                    {diffFromAvg !== 0 && (
                      <div className={`ml-2 flex items-center text-xs ${isAboveAverage ? 'text-green-500' : 'text-red-500'}`}>
                        {isAboveAverage ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        <span>{Math.abs(diffFromAvg).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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
      
      {/* Tooltip */}
      {hoveredItem && (
        <div 
          className="fixed z-50 bg-gray-900 text-white text-xs rounded py-2 px-3 shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium">{hoveredItem.name}</div>
          <div className="flex items-center mt-1">
            <span>{hoveredItem.value}{unit}</span>
            <span className="ml-2 text-gray-300">
              ({hoveredItem.percentage.toFixed(1)}% of max)
            </span>
          </div>
          <div className="absolute bottom-0 left-4 w-3 h-3 bg-gray-900 transform rotate-45 translate-y-1/2"></div>
        </div>
      )}
    </div>
  )
}

export default BarChart