import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import ChatAssistant from '../ChatAssistant';
import { HiOutlineInformationCircle } from 'react-icons/hi';

function DashboardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);
  const isGuest = user?.email === 'guest@demo.com';

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
              {isGuest && (
                <div className='mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4'>
                  <HiOutlineInformationCircle className='mt-0.5 flex-shrink-0 text-xl text-primary' />
                  <div className='text-sm text-text-secondary'>
                    <span className='font-semibold text-text-primary'>Demo mode.</span>{' '}
                    You're signed in as a guest reviewer. The income and expenses shown here are sample data — feel free to add, edit, or delete anything to try out the app. Your changes won't affect any real account.
                  </div>
                </div>
              )}
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