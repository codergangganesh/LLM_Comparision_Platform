'use client'

import React from 'react'

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate percentages and cumulative angles
  let cumulativePercentage = 0
  const segments = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const startAngle = cumulativePercentage
    cumulativePercentage += percentage
    const endAngle = cumulativePercentage
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle
    }
  })
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
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
                  className="absolute inset-0 rounded-full border-8"
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
          <div className="ml-6">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded-sm mr-2" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {segment.name} ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}
    </div>
  )
}

export default DonutChart