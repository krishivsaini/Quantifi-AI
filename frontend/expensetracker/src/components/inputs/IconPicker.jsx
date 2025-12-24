import React, { useState, useRef, useEffect } from 'react'
import { 
  HiOutlineCash, HiOutlineBriefcase, HiOutlineTrendingUp, HiOutlineGift, 
  HiOutlineCurrencyDollar, HiOutlineShoppingBag, HiOutlineTruck, 
  HiOutlineShoppingCart, HiOutlineFilm, HiOutlineDocumentText, 
  HiOutlineHeart, HiOutlineAcademicCap, HiOutlineGlobe, 
  HiOutlineDotsCircleHorizontal, HiOutlineX, HiOutlineHome,
  HiOutlineLightBulb, HiOutlineDesktopComputer, HiOutlinePhone,
  HiOutlineMusicNote, HiOutlinePhotograph, HiOutlinePuzzle,
  HiOutlineStar, HiOutlineSparkles, HiOutlineFire,
  HiOutlineOfficeBuilding, HiOutlineRefresh, HiOutlineChartBar,
  HiOutlineUserCircle, HiOutlineClipboardList
} from 'react-icons/hi'
import { 
  MdOutlineRestaurant, MdOutlineLocalGroceryStore, MdOutlineHealthAndSafety,
  MdOutlineFlight, MdOutlineDirectionsCar, MdOutlineSpa
} from 'react-icons/md'

const ICON_OPTIONS = [
  // Income icons
  { id: 'cash', icon: HiOutlineCash, color: 'bg-success/10 text-success' },
  { id: 'briefcase', icon: HiOutlineBriefcase, color: 'bg-primary/10 text-primary' },
  { id: 'trending', icon: HiOutlineTrendingUp, color: 'bg-success/10 text-success' },
  { id: 'gift', icon: HiOutlineGift, color: 'bg-pink-100 text-pink-500' },
  { id: 'dollar', icon: HiOutlineCurrencyDollar, color: 'bg-success/10 text-success' },
  { id: 'star', icon: HiOutlineStar, color: 'bg-yellow-100 text-yellow-500' },
  { id: 'building', icon: HiOutlineOfficeBuilding, color: 'bg-blue-100 text-blue-500' },
  { id: 'laptop', icon: HiOutlineDesktopComputer, color: 'bg-gray-100 text-gray-600' },
  { id: 'chart', icon: HiOutlineChartBar, color: 'bg-indigo-100 text-indigo-500' },
  { id: 'refresh', icon: HiOutlineRefresh, color: 'bg-green-100 text-green-500' },
  { id: 'home', icon: HiOutlineHome, color: 'bg-amber-100 text-amber-500' },
  
  // Expense icons
  { id: 'food', icon: MdOutlineRestaurant, color: 'bg-orange-100 text-orange-500' },
  { id: 'car', icon: MdOutlineDirectionsCar, color: 'bg-blue-100 text-blue-500' },
  { id: 'cart', icon: HiOutlineShoppingCart, color: 'bg-purple-100 text-purple-500' },
  { id: 'music', icon: HiOutlineMusicNote, color: 'bg-pink-100 text-pink-500' },
  { id: 'lightbulb', icon: HiOutlineLightBulb, color: 'bg-yellow-100 text-yellow-500' },
  { id: 'health', icon: MdOutlineHealthAndSafety, color: 'bg-red-100 text-red-500' },
  { id: 'book', icon: HiOutlineAcademicCap, color: 'bg-indigo-100 text-indigo-500' },
  { id: 'plane', icon: MdOutlineFlight, color: 'bg-cyan-100 text-cyan-500' },
  { id: 'basket', icon: MdOutlineLocalGroceryStore, color: 'bg-green-100 text-green-500' },
  { id: 'user', icon: MdOutlineSpa, color: 'bg-pink-100 text-pink-500' },
  
  // Other
  { id: 'shopping-bag', icon: HiOutlineShoppingBag, color: 'bg-orange-100 text-orange-500' },
  { id: 'truck', icon: HiOutlineTruck, color: 'bg-blue-100 text-blue-500' },
  { id: 'film', icon: HiOutlineFilm, color: 'bg-red-100 text-red-500' },
  { id: 'heart', icon: HiOutlineHeart, color: 'bg-red-100 text-red-500' },
  { id: 'globe', icon: HiOutlineGlobe, color: 'bg-blue-100 text-blue-500' },
  { id: 'phone', icon: HiOutlinePhone, color: 'bg-green-100 text-green-500' },
  { id: 'sparkles', icon: HiOutlineSparkles, color: 'bg-primary/10 text-primary' },
  { id: 'fire', icon: HiOutlineFire, color: 'bg-orange-100 text-orange-500' },
  { id: 'dots', icon: HiOutlineDotsCircleHorizontal, color: 'bg-gray-100 text-gray-500' },
]

const IconPicker = ({ selectedIcon, onSelect, type = 'income' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef(null)

  // Get the selected icon component
  const getSelectedIconComponent = () => {
    const found = ICON_OPTIONS.find(opt => opt.id === selectedIcon)
    return found || ICON_OPTIONS[0]
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = getSelectedIconComponent()
  const SelectedIconComponent = selected.icon

  return (
    <div className='relative' ref={pickerRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary 
                   flex items-center justify-center ${selected.color}
                   hover:shadow-lg transition-all duration-300`}
      >
        <SelectedIconComponent className='text-3xl' />
      </button>
      
      {isOpen && (
        <div className='absolute top-20 left-0 z-50 animate-scale-in'>
          <div 
            className='relative rounded-2xl shadow-2xl border p-4 w-80'
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className='flex items-center justify-between mb-3'>
              <h4 className='font-semibold' style={{ color: 'var(--color-text-primary)' }}>Choose Icon</h4>
              <button
                onClick={() => setIsOpen(false)}
                className='p-1 rounded-lg hover:bg-surface-tertiary'
              >
                <HiOutlineX className='text-text-tertiary' />
              </button>
            </div>
            
            <div className='grid grid-cols-6 gap-2'>
              {ICON_OPTIONS.map((option) => {
                const IconComponent = option.icon
                const isSelected = selectedIcon === option.id
                
                return (
                  <button
                    key={option.id}
                    type='button'
                    onClick={() => {
                      onSelect(option.id)
                      setIsOpen(false)
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all
                      ${isSelected 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'hover:bg-surface-secondary'
                      } ${option.color}`}
                  >
                    <IconComponent className='text-xl' />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export icon options for use in other components
export { ICON_OPTIONS }
export default IconPicker
