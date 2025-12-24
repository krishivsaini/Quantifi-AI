import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { HiOutlineX } from 'react-icons/hi'

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={pickerRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary 
                   flex items-center justify-center text-3xl bg-surface-secondary
                   hover:bg-primary/5 transition-all duration-300'
      >
        {icon || '😀'}
      </button>
      
      {isOpen && (
        <div className='absolute top-20 left-0 z-50 animate-scale-in'>
          <div className='relative'>
            <button
              onClick={() => setIsOpen(false)}
              className='absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg
                         flex items-center justify-center text-text-secondary hover:text-danger z-10'
            >
              <HiOutlineX />
            </button>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                onSelect(emojiData.emoji)
                setIsOpen(false)
              }}
              theme='light'
              searchDisabled={false}
              skinTonesDisabled
              width={320}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default EmojiPickerPopup
