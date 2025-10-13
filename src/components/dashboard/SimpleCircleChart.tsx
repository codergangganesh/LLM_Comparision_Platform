'use client'

import React, { useState } from 'react'
import { MessageSquare, TrendingUp, TrendingDown } from 'lucide-react'

interface SimpleCircleChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
}

const SimpleCircleChart: React.FC<SimpleCircleChartProps> = ({ data, title }) => {
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate average value
  const average = data.length > 0 ? total / data.length : 0
  
  const [hoveredSegment, setHoveredSegment] = useState<{name: string, value: number, percentage: number} | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  
  const handleSegmentHover = (e: React.MouseEvent, segment: {name: string, value: number}) => {
    const percentage = total > 0 ? (segment.value / total) * 100 : 0
    setHoveredSegment({
      name: segment.name,
      value: segment.value,
      percentage
    })
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }
  
  const handleSegmentLeave = () => {
    setHoveredSegment(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        {data.length > 0 && (
          <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
            <MessageSquare className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              {total} total
            </span>
          </div>
        )}
      </div>
      {data.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center">
          {/* Simple circle with total count */}
          <div className="relative w-40 h-40 flex-shrink-0 mb-6 md:mb-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-full w-32 h-32 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{total}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Messages</span>
              </div>
            </div>
          </div>
          
          {/* Legend on the right side */}
          <div className="ml-0 md:ml-6 w-full">
            {data.map((segment, index) => {
              // Calculate percentage
              const percentage = total > 0 ? (segment.value / total) * 100 : 0
              
              // Calculate difference from average
              const diffFromAvg = average > 0 ? ((segment.value - average) / average) * 100 : 0
              const isAboveAverage = diffFromAvg > 0
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 transition-colors"
                  onMouseEnter={(e) => handleSegmentHover(e, segment)}
                  onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={handleSegmentLeave}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 cursor-pointer hover:opacity-80" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                      {segment.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                      {segment.value}
                    </span>
                    {diffFromAvg !== 0 && (
                      <div className={`flex items-center text-xs ${isAboveAverage ? 'text-green-500' : 'text-red-500'}`}>
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
              )
            })}
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
      
      {/* Tooltip */}
      {hoveredSegment && (
        <div 
          className="fixed z-50 bg-gray-900 text-white text-xs rounded py-2 px-3 shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium">{hoveredSegment.name}</div>
          <div className="flex items-center mt-1">
            <span>{hoveredSegment.value} messages</span>
            <span className="ml-2 text-gray-300">
              ({hoveredSegment.percentage.toFixed(1)}% of total)
            </span>
          </div>
          <div className="absolute bottom-0 left-4 w-3 h-3 bg-gray-900 transform rotate-45 translate-y-1/2"></div>
        </div>
      )}
    </div>
  )
}

export default SimpleCircleChart