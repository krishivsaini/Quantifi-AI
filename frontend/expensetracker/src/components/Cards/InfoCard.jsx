import React from 'react'
import { 
  HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCurrencyDollar,
  HiOutlineCash, HiOutlineCreditCard, HiOutlineChartBar
} from 'react-icons/hi'

// Icon mapping
const ICON_MAP = {
  'balance': HiOutlineCurrencyDollar,
  'income': HiOutlineTrendingUp,
  'expense': HiOutlineTrendingDown,
  'cash': HiOutlineCash,
  'credit': HiOutlineCreditCard,
  'chart': HiOutlineChartBar,
}

const InfoCard = ({ icon, label, value, color = 'primary', trend, trendValue }) => {
  const colorClasses = {
    primary: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      gradient: 'from-primary to-primary-light'
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      gradient: 'from-success to-success-light'
    },
    danger: {
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
      gradient: 'from-danger to-danger-light'
    }
  }

  const colors = colorClasses[color] || colorClasses.primary

  // Get the icon component
  const IconComponent = ICON_MAP[icon] || HiOutlineCurrencyDollar

  return (
    <div className={`stat-card ${color}`}>
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4`}>
        <IconComponent className={`text-2xl ${colors.iconColor}`} />
      </div>
      
      {/* Label */}
      <p className='text-sm text-text-tertiary font-medium mb-1'>{label}</p>
      
      {/* Value */}
      <h3 className='text-3xl font-bold text-text-primary tabular-nums mb-2'>
        {value}
      </h3>
      
      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-1.5 text-sm ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
          {trend === 'up' ? (
            <HiOutlineTrendingUp className='text-lg' />
          ) : (
            <HiOutlineTrendingDown className='text-lg' />
          )}
          <span className='font-medium'>{trendValue}</span>
          <span className='text-text-tertiary'>vs last month</span>
        </div>
      )}
    </div>
  )
}

export default InfoCard
