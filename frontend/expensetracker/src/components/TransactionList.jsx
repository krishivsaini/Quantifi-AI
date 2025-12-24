import React from 'react'
import moment from 'moment'
import { HiOutlineTrash, HiOutlineArrowUp, HiOutlineArrowDown, HiOutlinePencil,
         HiOutlineCash, HiOutlineBriefcase, HiOutlineTrendingUp, HiOutlineGift,
         HiOutlineCurrencyDollar, HiOutlineShoppingBag, HiOutlineTruck,
         HiOutlineShoppingCart, HiOutlineFilm, HiOutlineDocumentText,
         HiOutlineHeart, HiOutlineAcademicCap, HiOutlineGlobe,
         HiOutlineDotsCircleHorizontal, HiOutlineHome, HiOutlineLightBulb,
         HiOutlineDesktopComputer, HiOutlinePhone, HiOutlineMusicNote,
         HiOutlinePhotograph, HiOutlinePuzzle, HiOutlineStar,
         HiOutlineSparkles, HiOutlineFire
} from 'react-icons/hi'

// Icon mapping
const ICON_MAP = {
  'cash': HiOutlineCash,
  'briefcase': HiOutlineBriefcase,
  'trending': HiOutlineTrendingUp,
  'gift': HiOutlineGift,
  'dollar': HiOutlineCurrencyDollar,
  'shopping-bag': HiOutlineShoppingBag,
  'truck': HiOutlineTruck,
  'cart': HiOutlineShoppingCart,
  'film': HiOutlineFilm,
  'document': HiOutlineDocumentText,
  'heart': HiOutlineHeart,
  'academic': HiOutlineAcademicCap,
  'globe': HiOutlineGlobe,
  'home': HiOutlineHome,
  'bulb': HiOutlineLightBulb,
  'desktop': HiOutlineDesktopComputer,
  'phone': HiOutlinePhone,
  'music': HiOutlineMusicNote,
  'photo': HiOutlinePhotograph,
  'puzzle': HiOutlinePuzzle,
  'star': HiOutlineStar,
  'sparkles': HiOutlineSparkles,
  'fire': HiOutlineFire,
  'dots': HiOutlineDotsCircleHorizontal,
}

const TransactionIcon = ({ icon, isIncome }) => {
  // Check if it's a React icon id
  if (icon && ICON_MAP[icon]) {
    const IconComponent = ICON_MAP[icon]
    return <IconComponent className='text-2xl' />
  }
  
  // Fallback to emoji if it's an emoji string, or default icon
  if (icon && typeof icon === 'string' && icon.length <= 2) {
    return <span className='text-2xl'>{icon}</span>
  }
  
  // Default icons
  const DefaultIcon = isIncome ? HiOutlineCash : HiOutlineShoppingCart
  return <DefaultIcon className='text-2xl' />
}

const TransactionList = ({ transactions, onDelete, onEdit, showType = false }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className='empty-state'>
        <div className='empty-state-icon'>
          <HiOutlineDocumentText className='text-4xl text-text-tertiary' />
        </div>
        <h4 className='text-lg font-semibold text-text-primary mb-1'>No transactions yet</h4>
        <p className='text-sm text-text-tertiary'>Start tracking your finances by adding income or expenses</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {transactions.map((item, index) => {
        const isIncome = item.type === 'income'
        const displayName = item.source || item.category || 'Transaction'
        
        return (
          <div 
            key={item._id || index} 
            className='transaction-item animate-fade-in'
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon */}
            <div className={`transaction-icon ${isIncome ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              <TransactionIcon icon={item.icon} isIncome={isIncome} />
            </div>
            
            {/* Details */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <h4 className='font-semibold text-text-primary truncate'>
                  {displayName}
                </h4>
                {showType && (
                  <span className={`badge ${isIncome ? 'badge-success' : 'badge-danger'}`}>
                    {isIncome ? (
                      <><HiOutlineArrowUp className='mr-1' />Income</>
                    ) : (
                      <><HiOutlineArrowDown className='mr-1' />Expense</>
                    )}
                  </span>
                )}
              </div>
              <p className='text-sm text-text-tertiary'>
                {moment(item.date).format('MMM DD, YYYY')}
              </p>
            </div>
            
            {/* Amount */}
            <div className='text-right mr-2'>
              <p className={`text-lg font-bold tabular-nums ${isIncome ? 'text-success' : 'text-danger'}`}>
                {isIncome ? '+' : '-'}₹{item.amount?.toLocaleString('en-IN')}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className='flex items-center gap-1'>
              {/* Edit Button */}
              {onEdit && (
                <button 
                  onClick={() => onEdit(item)}
                  className='p-2 rounded-lg text-text-tertiary hover:text-primary hover:bg-primary/10 transition-colors'
                  title='Edit'
                >
                  <HiOutlinePencil className='text-lg' />
                </button>
              )}
              
              {/* Delete Button */}
              {onDelete && (
                <button 
                  onClick={() => onDelete(item._id)}
                  className='p-2 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors'
                  title='Delete'
                >
                  <HiOutlineTrash className='text-lg' />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TransactionList
