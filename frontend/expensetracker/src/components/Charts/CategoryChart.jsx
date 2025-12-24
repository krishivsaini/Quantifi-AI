import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className='bg-white rounded-xl shadow-xl border border-border/50 p-4'>
        <div className='flex items-center gap-2 mb-1'>
          <div 
            className='w-3 h-3 rounded-full' 
            style={{ backgroundColor: data.fill }}
          />
          <span className='font-medium text-text-primary'>{data.name}</span>
        </div>
        <p className='text-lg font-bold text-text-primary'>
          ₹{data.value?.toLocaleString('en-IN')}
        </p>
        <p className='text-sm text-text-tertiary'>
          {data.percentage}% of total
        </p>
      </div>
    )
  }
  return null
}

const CategoryChart = ({ expenses = [] }) => {
  // Process expenses by category
  const processData = () => {
    const categoryMap = new Map()
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other'
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + expense.amount)
      } else {
        categoryMap.set(category, expense.amount)
      }
    })
    
    const total = Array.from(categoryMap.values()).reduce((acc, val) => acc + val, 0)
    
    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
        fill: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
  }

  const chartData = processData()

  if (chartData.length === 0) {
    return (
      <div className='chart-container'>
        <h3 className='text-lg font-semibold text-text-primary mb-4'>Spending by Category</h3>
        <div className='h-[250px] flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-4xl mb-2'>🥧</p>
            <p className='text-text-tertiary'>No expense data to display</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='chart-container'>
      <h3 className='text-lg font-semibold text-text-primary mb-4'>Spending by Category</h3>
      
      <div className='flex flex-col lg:flex-row items-center gap-6'>
        <div className='w-full lg:w-1/2'>
          <ResponsiveContainer width='100%' height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey='value'
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className='w-full lg:w-1/2 space-y-2'>
          {chartData.slice(0, 6).map((item, index) => (
            <div key={index} className='flex items-center justify-between p-2 rounded-lg hover:bg-surface-secondary transition-colors'>
              <div className='flex items-center gap-3'>
                <div 
                  className='w-4 h-4 rounded-full' 
                  style={{ backgroundColor: item.fill }}
                />
                <span className='text-sm text-text-primary font-medium'>{item.name}</span>
              </div>
              <div className='text-right'>
                <p className='text-sm font-semibold text-text-primary'>
                  ₹{item.value.toLocaleString('en-IN')}
                </p>
                <p className='text-xs text-text-tertiary'>{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryChart
