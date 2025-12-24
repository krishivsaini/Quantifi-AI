import React from 'react'
import { HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineSparkles, HiOutlineDownload } from 'react-icons/hi'

const AuthLayout = ({ children }) => {
  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Form */}
      <div className='w-full lg:w-1/2 px-8 lg:px-16 py-12 flex flex-col'>
        {/* Logo */}
        <div className='flex items-center gap-3 mb-12'>
          <img 
            src='/logo.svg' 
            alt='Quantifi AI' 
            className='w-10 h-10'
          />
          <h2 className='text-xl font-bold text-text-primary'>Quantifi AI</h2>
        </div>
        
        {/* Form Content */}
        <div className='flex-1 flex items-center'>
          <div className='w-full max-w-md'>
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <p className='text-sm text-text-tertiary mt-8'>
          © 2024 ExpenseTracker. All rights reserved.
        </p>
      </div>
      
      {/* Right Side - Decorative */}
      <div className='hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary-dark to-primary-light p-12 items-center justify-center relative overflow-hidden'>
        {/* Background Decorations */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl'></div>
        
        {/* Content */}
        <div className='relative z-10 text-center max-w-md'>
          <div className='w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center'>
            <HiOutlineCurrencyDollar className='text-5xl text-white' />
          </div>
          <h1 className='text-4xl font-bold text-white mb-4'>
            Take Control of Your Finances
          </h1>
          <p className='text-lg text-white/80 mb-8'>
            Track your income, manage expenses, and achieve your financial goals with our intuitive expense tracker.
          </p>
          
          {/* Feature Pills */}
          <div className='flex flex-wrap justify-center gap-3'>
            <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white flex items-center gap-2'>
              <HiOutlineChartBar className='text-lg' /> Visual Analytics
            </span>
            <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white flex items-center gap-2'>
              <HiOutlineSparkles className='text-lg' /> AI Insights
            </span>
            <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white flex items-center gap-2'>
              <HiOutlineDownload className='text-lg' /> Excel Export
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout