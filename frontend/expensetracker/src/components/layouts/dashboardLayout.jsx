import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import ChatAssistant from '../ChatAssistant';

function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);

  return (
    <div className='min-h-screen' style={{ background: 'var(--color-surface-secondary)' }}>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className='flex'>
          <div className='hidden lg:block'>
            <SideMenu activeMenu={activeMenu} />
          </div>
          <main className='flex-1 p-6 lg:p-8 min-h-[calc(100vh-73px)] overflow-x-hidden'>
            <div className='max-w-7xl mx-auto animate-fade-in'>
              {children}
            </div>
          </main>
        </div>
      )}
      {user && <ChatAssistant />}
    </div>
  )
}

export default DashboardLayout