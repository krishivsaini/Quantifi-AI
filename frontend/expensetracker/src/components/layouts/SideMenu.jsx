import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA } from '../../utils/data'
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import ProfileModal from '../modals/ProfileModal';
import LogoutCard from '../modals/LogoutCard';

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

      {/* Logout Confirmation Card */}
      <LogoutCard
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={cancelLogout}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  )
}

export default SideMenu