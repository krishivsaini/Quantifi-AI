import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { HiOutlineSparkles, HiOutlineRefresh, HiOutlineLightBulb, HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineInformationCircle, HiOutlineKey, HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineCash, HiOutlineShieldCheck } from 'react-icons/hi'

const iconMap = {
  bulb: HiOutlineLightBulb,
  warning: HiOutlineExclamation,
  check: HiOutlineCheckCircle,
  info: HiOutlineInformationCircle,
  key: HiOutlineKey,
  chart: HiOutlineChartBar,
  trending: HiOutlineTrendingUp,
  cash: HiOutlineCash,
  shield: HiOutlineShieldCheck,
  sparkles: HiOutlineSparkles,
}

const typeStyles = {
  tip: { bg: 'bg-primary/10', border: 'border-primary/20', iconColor: 'text-primary' },
  warning: { bg: 'bg-warning/10', border: 'border-warning/20', iconColor: 'text-warning' },
  success: { bg: 'bg-success/10', border: 'border-success/20', iconColor: 'text-success' },
  info: { bg: 'bg-info/10', border: 'border-info/20', iconColor: 'text-info' }
}

const AIInsights = () => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInsights = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(API_PATHS.AI.GET_INSIGHTS)
      setInsights(response.data)
    } catch (err) {
      console.error('Failed to fetch insights:', err)
      setError('Unable to generate insights. Make sure you have a Gemini API key configured.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  if (loading) {
    return (
      <div className='glass-card p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center'>
            <HiOutlineSparkles className='text-white text-xl animate-pulse' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-text-primary'>AI Insights</h3>
            <p className='text-sm text-text-tertiary'>Analyzing your finances...</p>
          </div>
        </div>
        <div className='space-y-3'>
          {[1, 2, 3].map(i => (
            <div key={i} className='skeleton h-20 rounded-xl'></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='glass-card p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center'>
            <HiOutlineExclamation className='text-danger text-xl' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-text-primary'>AI Insights</h3>
            <p className='text-sm text-danger'>{error}</p>
          </div>
        </div>
        <button onClick={fetchInsights} className='btn-secondary flex items-center gap-2 !w-auto'>
          <HiOutlineRefresh />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='glass-card p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center'>
            <HiOutlineSparkles className='text-white text-xl' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-text-primary'>AI Insights</h3>
            <p className='text-sm text-text-tertiary'>Powered by Google Gemini</p>
          </div>
        </div>
        <button 
          onClick={fetchInsights}
          className='p-2 rounded-lg hover:bg-surface-tertiary transition-colors'
          title='Refresh insights'
        >
          <HiOutlineRefresh className='text-text-tertiary text-lg' />
        </button>
      </div>

      {/* Summary */}
      {insights?.summary && (
        <div className='p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary-light/5 border border-primary/10 mb-4'>
          <p className='text-sm text-text-primary font-medium'>{insights.summary}</p>
        </div>
      )}

      {/* Insights List */}
      <div className='space-y-3'>
        {insights?.insights?.map((insight, index) => {
          const style = typeStyles[insight.type] || typeStyles.info
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-xl ${style.bg} border ${style.border} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='flex items-start gap-3'>
                {(() => {
                  const IconComponent = iconMap[insight.icon] || HiOutlineLightBulb;
                  return <IconComponent className={`text-2xl mt-0.5 flex-shrink-0 ${style.iconColor}`} />;
                })()}
                <div className='flex-1'>
                  <h4 className='font-semibold text-text-primary mb-1'>{insight.title}</h4>
                  <p className='text-sm text-text-secondary'>{insight.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AIInsights
