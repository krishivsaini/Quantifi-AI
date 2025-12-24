import React, { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi'
import moment from 'moment'

// Compact tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload
    const balance = (data?.income || 0) - (data?.expense || 0)
    
    return (
      <div 
        className='rounded-lg shadow-lg p-2 text-xs'
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          border: '1px solid var(--color-border)',
          minWidth: '120px'
        }}
      >
        <p className='font-medium mb-1' style={{ color: 'var(--color-text-primary)' }}>{label}</p>
        
        {payload.map((entry, index) => (
          <div key={index} className='flex items-center justify-between gap-2 mb-0.5'>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-full' style={{ backgroundColor: entry.color }} />
              <span style={{ color: 'var(--color-text-tertiary)' }}>{entry.name}</span>
            </div>
            <span className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>
              ₹{(entry.value/1000).toFixed(1)}k
            </span>
          </div>
        ))}
        
        <div className='pt-1 mt-1' style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className='flex items-center justify-between'>
            <span style={{ color: 'var(--color-text-tertiary)' }}>Net</span>
            <span className={`font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {balance >= 0 ? '+' : ''}₹{(balance/1000).toFixed(1)}k
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}


const FinanceChart = ({ incomeData = [], expenseData = [] }) => {
  const [viewMode, setViewMode] = useState('balance') // 'balance', 'both', 'income', 'expense'

  // Process data with balance analysis
  const { chartData, insights } = useMemo(() => {
    const dataMap = new Map()
    const thirtyDaysAgo = moment().subtract(30, 'days')
    
    // Filter to last 30 days and process income
    incomeData
      .filter(item => moment(item.date).isAfter(thirtyDaysAgo))
      .forEach(item => {
        const date = moment(item.date).format('MMM DD')
        const rawDate = moment(item.date)
        if (dataMap.has(date)) {
          dataMap.get(date).income += item.amount
          dataMap.get(date).incomeCount++
          dataMap.get(date).incomeSources.push(item.source)
        } else {
          dataMap.set(date, { 
            date, 
            rawDate,
            income: item.amount, 
            expense: 0,
            incomeCount: 1,
            expenseCount: 0,
            incomeSources: [item.source],
            expenseCategories: []
          })
        }
      })
    
    // Filter to last 30 days and process expenses
    expenseData
      .filter(item => moment(item.date).isAfter(thirtyDaysAgo))
      .forEach(item => {
        const date = moment(item.date).format('MMM DD')
        const rawDate = moment(item.date)
        if (dataMap.has(date)) {
          dataMap.get(date).expense += item.amount
          dataMap.get(date).expenseCount++
          dataMap.get(date).expenseCategories.push(item.category)
        } else {
          dataMap.set(date, { 
            date, 
            rawDate,
            income: 0, 
            expense: item.amount,
            incomeCount: 0,
            expenseCount: 1,
            incomeSources: [],
            expenseCategories: [item.category]
          })
        }
      })
    
    // Sort by date and calculate running balance
    const sorted = Array.from(dataMap.values()).sort((a, b) => 
      a.rawDate.valueOf() - b.rawDate.valueOf()
    )
    
    let runningBalance = 0
    let prevBalance = 0
    const processed = sorted.map((day, index) => {
      prevBalance = runningBalance
      const dayBalance = day.income - day.expense
      runningBalance += dayBalance
      
      // Generate balance reason
      let balanceReason = ''
      if (day.income > 0 && day.expense > 0) {
        if (day.income > day.expense) {
          balanceReason = `[+] Income (${day.incomeSources[0]}) exceeded expenses`
        } else {
          balanceReason = `[-] Expenses (${day.expenseCategories[0]}) exceeded income`
        }
      } else if (day.income > 0) {
        balanceReason = `Income: +₹${day.income.toLocaleString('en-IN')} from ${day.incomeSources[0]}`
      } else if (day.expense > 0) {
        balanceReason = `Expense: -₹${day.expense.toLocaleString('en-IN')} on ${day.expenseCategories[0]}`
      }
      
      return {
        ...day,
        balance: runningBalance,
        dayBalance,
        balanceChange: runningBalance - prevBalance,
        balanceReason,
        isPositive: dayBalance >= 0,
        isHighIncome: day.income > day.expense * 2,
        isHighExpense: day.expense > day.income * 2
      }
    })
    
    // Calculate insights
    const totalIncome = processed.reduce((acc, d) => acc + d.income, 0)
    const totalExpense = processed.reduce((acc, d) => acc + d.expense, 0)
    const netChange = totalIncome - totalExpense
    const positiveDays = processed.filter(d => d.dayBalance >= 0).length
    const negativeDays = processed.filter(d => d.dayBalance < 0).length
    
    // Find biggest income/expense days
    const biggestIncomeDay = processed.reduce((max, d) => d.income > max.income ? d : max, { income: 0, date: '-' })
    const biggestExpenseDay = processed.reduce((max, d) => d.expense > max.expense ? d : max, { expense: 0, date: '-' })
    
    return {
      chartData: processed,
      insights: {
        totalIncome,
        totalExpense,
        netChange,
        positiveDays,
        negativeDays,
        biggestIncomeDay,
        biggestExpenseDay,
        trend: netChange >= 0 ? 'up' : 'down'
      }
    }
  }, [incomeData, expenseData])

  if (chartData.length === 0) {
    return (
      <div className='chart-container'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-text-primary'>Financial Overview</h3>
            <p className='text-sm text-text-tertiary'>Last 30 days</p>
          </div>
        </div>
        <div className='h-[300px] flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3'>
              <HiOutlineChartBar className='text-3xl text-primary' />
            </div>
            <p className='text-text-tertiary'>No data to display yet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='chart-container'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Financial Overview</h3>
          <p className='text-sm text-text-tertiary'>Last 30 days</p>
        </div>
        
        {/* Toggle Buttons */}
        <div className='flex items-center bg-surface-secondary rounded-xl p-1'>
          <button
            onClick={() => setViewMode('balance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'balance' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Balance
          </button>
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'both' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            Both
          </button>
          <button
            onClick={() => setViewMode('income')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'income' 
                ? 'bg-success text-white shadow-sm' 
                : 'text-text-tertiary hover:text-success'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setViewMode('expense')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              viewMode === 'expense' 
                ? 'bg-danger text-white shadow-sm' 
                : 'text-text-tertiary hover:text-danger'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Insights Summary - Compact */}
      <div className='grid grid-cols-4 gap-2 mb-3'>
        <div className='rounded-lg p-2' style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <p className='text-[10px] text-text-tertiary'>Net</p>
          <p className={`text-sm font-bold ${insights.netChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {insights.netChange >= 0 ? '+' : ''}₹{(insights.netChange/1000).toFixed(0)}k
          </p>
        </div>
        <div className='rounded-lg p-2' style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <p className='text-[10px] text-text-tertiary'>+ Days</p>
          <p className='text-sm font-bold text-success'>{insights.positiveDays}</p>
        </div>
        <div className='rounded-lg p-2' style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <p className='text-[10px] text-text-tertiary'>- Days</p>
          <p className='text-sm font-bold text-danger'>{insights.negativeDays}</p>
        </div>
        <div className='rounded-lg p-2' style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <p className='text-[10px] text-text-tertiary'>Top Spend</p>
          <p className='text-xs font-bold text-danger truncate'>{insights.biggestExpenseDay.date}</p>
        </div>
      </div>

      {/* Legend */}
      <div className='flex items-center gap-4 mb-3'>
        {viewMode === 'balance' && (
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-primary'></div>
            <span className='text-sm text-text-secondary'>Running Balance</span>
          </div>
        )}
        {(viewMode === 'both' || viewMode === 'income') && (
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-success'></div>
            <span className='text-sm text-text-secondary'>Income</span>
          </div>
        )}
        {(viewMode === 'both' || viewMode === 'expense') && (
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-danger'></div>
            <span className='text-sm text-text-secondary'>Expense</span>
          </div>
        )}
      </div>
      
      <ResponsiveContainer width='100%' height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id='incomeGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='expenseGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ef4444' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='balanceGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#6366f1' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#6366f1' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' vertical={false} />
          <XAxis 
            dataKey='date' 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            dy={10}
            interval='preserveStartEnd'
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={(value) => `₹${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Balance View */}
          {viewMode === 'balance' && (
            <Area 
              type='monotone' 
              dataKey='balance' 
              name='Balance'
              stroke='#6366f1' 
              strokeWidth={2}
              fill='url(#balanceGradient)' 
            />
          )}
          
          {/* Income Area */}
          {(viewMode === 'both' || viewMode === 'income') && (
            <Area 
              type='monotone' 
              dataKey='income' 
              name='Income'
              stroke='#10b981' 
              strokeWidth={2}
              fill='url(#incomeGradient)' 
            />
          )}
          
          {/* Expense Area */}
          {(viewMode === 'both' || viewMode === 'expense') && (
            <Area 
              type='monotone' 
              dataKey='expense' 
              name='Expense'
              stroke='#ef4444' 
              strokeWidth={2}
              fill='url(#expenseGradient)' 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinanceChart
