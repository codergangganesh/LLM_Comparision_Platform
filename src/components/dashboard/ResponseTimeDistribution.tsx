'use client'

import React, { useState } from 'react'
import { Clock, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react'

interface ResponseTimeDistributionProps {
  data: { name: string; value: number; color: string }[]
  title: string
  unit?: string
  chartId?: string
  isExpanded?: boolean
  onToggleExpand?: () => void
}

const ResponseTimeDistribution: React.FC<ResponseTimeDistributionProps> = ({ 
  data, 
  title, 
  unit = '',
  chartId,
  isExpanded = false,
  onToggleExpand
}) => {
  // Show only first 4 items by default, unless expanded
  const displayedData = isExpanded ? data : data.slice(0, 4)
  
  // Find the maximum value for scaling
  const maxValue = displayedData.length > 0 ? Math.max(...displayedData.map(item => item.value), 0) : 1
  
  // Calculate average response time
  const averageTime = displayedData.length > 0 ? displayedData.reduce((sum, item) => sum + item.value, 0) / displayedData.length : 0
  
  const [hoveredItem, setHoveredItem] = useState<{name: string, value: number, percentage: number} | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  
  const handleItemHover = (e: React.MouseEvent, item: {name: string, value: number}) => {
    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
    setHoveredItem({
      name: item.name,
      value: item.value,
      percentage
    })
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }
  
  const handleItemLeave = () => {
    setHoveredItem(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        {data.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              <Clock className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                Avg: {averageTime.toFixed(2)}{unit}
              </span>
            </div>
            {data.length > 4 && onToggleExpand && (
              <button 
                onClick={onToggleExpand}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={isExpanded ? `Show fewer ${title}` : `Show all ${title}`}
              >
                {isExpanded ? (
                  <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      {displayedData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
              <div className="w-1/4 text-sm font-medium text-gray-500 dark:text-gray-400">Model</div>
              <div className="w-1/4 text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</div>
              <div className="w-2/4 text-sm font-medium text-gray-500 dark:text-gray-400">Distribution</div>
            </div>
            
            {/* Data rows */}
            {displayedData.map((item, index) => {
              // Calculate difference from average
              const diffFromAvg = averageTime > 0 ? ((item.value - averageTime) / averageTime) * 100 : 0
              const isAboveAverage = diffFromAvg > 0
              
              return (
                <div 
                  key={index} 
                  className="flex items-center py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-2 transition-colors"
                  onMouseEnter={(e) => handleItemHover(e, item)}
                  onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={handleItemLeave}
                >
                  <div className="w-1/4">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 cursor-pointer hover:opacity-80" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div className="w-1/4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.value}{unit}
                      </span>
                      {diffFromAvg !== 0 && (
                        <div className={`ml-2 flex items-center text-xs ${isAboveAverage ? 'text-red-500' : 'text-green-500'}`}>
                          {isAboveAverage ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          <span>{Math.abs(diffFromAvg).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-2/4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500 ease-out cursor-pointer hover:opacity-90" 
                        style={{ 
                          width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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

export default ResponseTimeDistribution