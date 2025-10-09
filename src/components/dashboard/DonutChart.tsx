'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate average value
  const average = data.length > 0 ? total / data.length : 0
  
  // Calculate percentages and cumulative angles
  let cumulativePercentage = 0
  const segments = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const startAngle = cumulativePercentage
    cumulativePercentage += percentage
    const endAngle = cumulativePercentage
    
    // Calculate difference from average
    const diffFromAvg = average > 0 ? ((item.value - average) / average) * 100 : 0
    const isAboveAverage = diffFromAvg > 0
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      diffFromAvg,
      isAboveAverage
    }
  })
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="relative w-48 h-48 mb-6 md:mb-0">
            {/* Donut chart */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-100 dark:border-gray-700"></div>
            {segments.map((segment, index) => {
              // Calculate the segment as a portion of the circle
              const segmentPercentage = segment.percentage
              const rotation = (segment.startAngle / 100) * 360
              const skew = 90 - (segmentPercentage / 100) * 360
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full border-8 transition-all duration-500 ease-out"
                  style={{
                    borderColor: segment.color,
                    transform: `rotate(${rotation}deg) skew(${skew}deg)`,
                    transformOrigin: 'center'
                  }}
                ></div>
              )
            })}
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="ml-0 md:ml-6">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-sm mr-2" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                    {segment.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                    {segment.value} ({segment.percentage.toFixed(1)}%)
                  </span>
                  {segment.diffFromAvg !== 0 && (
                    <div className={`flex items-center text-xs ${segment.isAboveAverage ? 'text-green-500' : 'text-red-500'}`}>
                      {segment.isAboveAverage ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      <span>{Math.abs(segment.diffFromAvg).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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

export default DonutChart