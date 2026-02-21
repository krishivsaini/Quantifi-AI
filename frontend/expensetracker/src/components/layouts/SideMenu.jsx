import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA } from '../../utils/data'
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import { HiOutlineExclamation } from 'react-icons/hi';
import ProfileModal from '../modals/ProfileModal';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const handleClick = (route) => {
    if (route === '/logout') {
      setShowLogoutConfirm(true);
      return;
    }
    navigate(route);
  }

  const handleLogout = () => {
    localStorage.clear()
    clearUser();
    navigate('/login');
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  }
  
  return (
    <>
      <div 
        className='w-72 h-[calc(100vh-73px)] backdrop-blur-xl border-r p-6 sticky top-[73px] z-20 overflow-y-auto'
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)'
        }}
      >
        {/* User Profile Card */}
        <div 
          onClick={() => setShowProfileModal(true)}
          className='bg-gradient-to-br from-primary/5 to-primary-light/10 rounded-2xl p-5 mb-8 cursor-pointer hover:bg-primary/10 transition-colors duration-300 border border-transparent hover:border-primary/20'
        >
          <div className='flex items-center gap-4'>
            {user?.profileImageUrl ? (
              <img
                src={user?.profileImageUrl || ""}
                alt='Profile'
                className='w-14 h-14 rounded-xl object-cover ring-2 ring-white shadow-lg'
              />
            ) : (
              <CharAvatar
                fullName={user?.name || ""}
                width="w-14"
                height="h-14"
                style="text-lg"
              />
            )}
            <div className='flex-1 min-w-0'>
              <h5 style={{ color: 'var(--color-text-primary)' }} className='font-semibold truncate'>
                {user?.name || ""}
              </h5>
              <p style={{ color: 'var(--color-text-tertiary)' }} className='text-xs truncate'>
                {user?.email || "Welcome back!"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className='space-y-2'>
          <p style={{ color: 'var(--color-text-tertiary)' }} className='text-xs font-semibold uppercase tracking-wider px-4 mb-3'>
            Menu
          </p>
          {SIDE_MENU_DATA.map((item, index) => {
            const isActive = activeMenu === item.label;
            const isLogout = item.label === 'Logout';
            
            return (
              <button
                key={`menu_${index}`}
                className={`w-full flex items-center gap-4 text-[15px] py-3.5 px-4 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25' 
                    : isLogout
                      ? 'text-danger hover:bg-danger/10'
                      : 'hover:bg-surface-tertiary'
                  }`}
                style={!isActive && !isLogout ? { color: 'var(--color-text-secondary)' } : {}}
                onClick={() => handleClick(item.path)}
              >
                <item.icon className={`text-xl ${isActive ? 'text-white' : ''}`} />
                <span className='font-medium'>{item.label}</span>
                {isActive && (
                  <div className='ml-auto w-2 h-2 rounded-full bg-white/50'></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Card */}
        <div className='absolute bottom-6 left-6 right-6'>
          <div className='bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white'>
            <p className='text-sm font-medium mb-1'>Need Help?</p>
            <p className='text-xs text-white/70 mb-3'>Check our documentation</p>
            <button className='w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors'>
              View Docs
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div 
            className='rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-scale-in'
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4'>
                <HiOutlineExclamation className='text-3xl text-danger' />
              </div>
              <h3 style={{ color: 'var(--color-text-primary)' }} className='text-xl font-bold mb-2'>Logout?</h3>
              <p style={{ color: 'var(--color-text-secondary)' }} className='mb-6'>
                Are you sure you want to logout? You'll need to login again to access your account.
              </p>
              <div className='flex gap-3 w-full'>
                <button
                  onClick={cancelLogout}
                  className='flex-1 py-3 px-4 rounded-xl font-medium transition-colors'
                  style={{ 
                    border: '1px solid var(--color-border)', 
                    color: 'var(--color-text-secondary)' 
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className='flex-1 py-3 px-4 rounded-xl bg-danger text-white font-medium hover:bg-danger/90 transition-colors'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  )
}

export default SideMenu