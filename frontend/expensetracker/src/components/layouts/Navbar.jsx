import React, { useState, useEffect, useRef } from 'react'
import { HiOutlineMenu, HiOutlineX, HiOutlineBell, HiOutlineSearch, HiOutlineMoon, HiOutlineSun, HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useTheme } from '../../context/themeContext';
import moment from 'moment';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // Fetch all transactions for search
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
          axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
        ]);
        
        const incomes = incomeRes.data.map(item => ({ ...item, type: 'income' }));
        const expenses = expenseRes.data.map(item => ({ ...item, type: 'expense' }));
        
        setAllTransactions([...incomes, ...expenses]);
      } catch (error) {
        console.error('Error fetching transactions for search:', error);
      }
    };
    
    fetchTransactions();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allTransactions.filter(item => {
      const name = (item.source || item.category || '').toLowerCase();
      const amount = item.amount?.toString() || '';
      return name.includes(query) || amount.includes(query);
    }).slice(0, 5); // Limit to 5 results

    setSearchResults(results);
  }, [searchQuery, allTransactions]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle result click
  const handleResultClick = (transaction) => {
    setShowResults(false);
    setSearchQuery('');
    if (transaction.type === 'income') {
      navigate('/income');
    } else {
      navigate('/expense');
    }
  };
  
  return (
    <div 
      className='flex items-center justify-between backdrop-blur-xl border-b py-4 px-6 lg:px-8 sticky top-0 z-30 shadow-sm'
      style={{ 
        backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Left Section */}
      <div className='flex items-center gap-4'>
        <button 
          className='block lg:hidden p-2 rounded-xl hover:bg-surface-tertiary transition-colors' 
          onClick={() => { setOpenSideMenu(!openSideMenu) }}
        >
          {openSideMenu ? (
            <HiOutlineX className='text-2xl text-text-primary' />
          ) : (
            <HiOutlineMenu className='text-2xl text-text-primary' />
          )}
        </button>
        
        <div className='flex items-center gap-3'>
          <img 
            src='/logo.svg' 
            alt='Quantifi AI' 
            className='w-10 h-10'
          />
          <div>
            <h2 className='text-lg font-bold text-text-primary'>Quantifi AI</h2>
            <p className='text-xs text-text-tertiary hidden sm:block'>AI-Powered Finance</p>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className='flex items-center gap-2'>
        {/* Search Bar - Hidden on mobile */}
        <div className='hidden md:block relative' ref={searchRef}>
          <div className='flex items-center gap-2 bg-surface-secondary rounded-xl px-4 py-2.5 border border-border/50'>
            <HiOutlineSearch className='text-text-tertiary text-lg' />
            <input 
              type='text' 
              placeholder='Search transactions...' 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              className='bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary w-48'
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className='text-text-tertiary hover:text-text-primary'
              >
                <HiOutlineX className='text-sm' />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchQuery && (
            <div 
              className='absolute top-full mt-2 w-80 rounded-xl shadow-xl overflow-hidden z-50'
              style={{ 
                backgroundColor: 'var(--color-surface)', 
                border: '1px solid var(--color-border)' 
              }}
            >
              {searchResults.length > 0 ? (
                <div className='max-h-80 overflow-y-auto'>
                  {searchResults.map((item, index) => (
                    <button
                      key={item._id || index}
                      onClick={() => handleResultClick(item)}
                      className='w-full flex items-center gap-3 p-3 hover:bg-surface-secondary transition-colors text-left'
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
                        ${item.type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {item.type === 'income' ? (
                          <HiOutlineTrendingUp className='text-xl' />
                        ) : (
                          <HiOutlineTrendingDown className='text-xl' />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-text-primary truncate'>
                          {item.source || item.category}
                        </p>
                        <p className='text-xs text-text-tertiary'>
                          {moment(item.date).format('MMM DD, YYYY')}
                        </p>
                      </div>
                      <span className={`font-semibold ${item.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {item.type === 'income' ? '+' : '-'}₹{item.amount?.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className='p-4 text-center text-text-tertiary'>
                  <p>No transactions found</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className='theme-toggle'
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <HiOutlineSun className='text-xl text-yellow-400' />
          ) : (
            <HiOutlineMoon className='text-xl text-text-secondary' />
          )}
        </button>
        
        {/* Notification Button */}
        <button className='relative p-2.5 rounded-xl hover:bg-surface-tertiary transition-colors'>
          <HiOutlineBell className='text-xl text-text-secondary' />
          <span className='absolute top-2 right-2 w-2 h-2 bg-danger rounded-full'></span>
        </button>
      </div>
      
      {/* Mobile Side Menu */}
      {openSideMenu && (
        <>
          <div 
            className='fixed inset-0 bg-black/20 backdrop-blur-sm top-[73px] lg:hidden z-40'
            onClick={() => setOpenSideMenu(false)}
          />
          <div 
            className='fixed top-[73px] left-0 shadow-2xl lg:hidden z-50 animate-slide-up'
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <SideMenu activeMenu={activeMenu} />
          </div>
        </>
      )}
    </div>
  )
}

export default Navbar