import React, { useEffect, useRef } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';

const LogoutCard = ({ isOpen, onConfirm, onCancel }) => {
  const cardRef = useRef(null);

  // Close on click outside the card
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onCancel]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in'>
      <div
        ref={cardRef}
        className='w-full max-w-sm mx-4 rounded-3xl p-8 shadow-2xl animate-bounce-in'
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Icon */}
        <div className='flex flex-col items-center text-center'>
          <div
            className='w-20 h-20 rounded-full flex items-center justify-center mb-5 relative'
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.06) 100%)' }}
          >
            {/* Pulsing ring */}
            <div
              className='absolute inset-0 rounded-full animate-ping'
              style={{
                background: 'rgba(239,68,68,0.08)',
                animationDuration: '2s',
              }}
            />
            <HiOutlineLogout className='text-4xl text-danger relative z-10' style={{ transform: 'rotate(180deg)' }} />
          </div>

          {/* Title */}
          <h3
            className='text-2xl font-bold mb-2'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Leaving so soon?
          </h3>

          {/* Description */}
          <p
            className='text-sm leading-relaxed mb-8 max-w-[260px]'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            You'll need to sign in again to access your account and data.
          </p>

          {/* Buttons */}
          <div className='flex gap-3 w-full'>
            <button
              onClick={onCancel}
              className='flex-1 py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              style={{
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Stay
            </button>
            <button
              onClick={onConfirm}
              className='flex-1 py-3.5 px-5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-danger/25 active:scale-[0.98] cursor-pointer'
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutCard;
