import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/dashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import InfoCard from '../../components/Cards/InfoCard'
import TransactionList from '../../components/TransactionList'
import FinanceChart from '../../components/Charts/FinanceChart'
import AIInsights from '../../components/AIInsights'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const Home = () => {
  useUserAuth();
  
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA)
        setDashboardData(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`
  }

  return (
    <DashboardLayout activeMenu='Dashboard'>
      <div className='space-y-8'>
        {/* Page Header */}
        <div className='page-header flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='page-title'>Dashboard</h1>
            <p className='page-subtitle'>Welcome back! Here's your financial overview.</p>
          </div>
          <div className='flex gap-3'>
            <Link to='/income' className='btn-secondary flex items-center gap-2 !w-auto px-6'>
              <HiOutlineTrendingUp />
              Add Income
            </Link>
            <Link to='/expense' className='btn-primary flex items-center gap-2 !w-auto px-6'>
              <HiOutlineTrendingDown />
              Add Expense
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading ? (
            <>
              <div className='stat-card'><div className='skeleton h-32'></div></div>
              <div className='stat-card'><div className='skeleton h-32'></div></div>
              <div className='stat-card'><div className='skeleton h-32'></div></div>
            </>
          ) : (
            <>
              <InfoCard
                icon='balance'
                label='Total Balance'
                value={formatCurrency(dashboardData?.totalBalance)}
                color='primary'
              />
              <InfoCard
                icon='income'
                label='Total Income'
                value={formatCurrency(dashboardData?.totalIncome)}
                color='success'
              />
              <InfoCard
                icon='expense'
                label='Total Expenses'
                value={formatCurrency(dashboardData?.totalExpenses)}
                color='danger'
              />
            </>
          )}
        </div>

        {/* Chart - Full Width */}
        <div>
          {loading ? (
            <div className='chart-container'>
              <div className='skeleton h-[350px]'></div>
            </div>
          ) : (
            <FinanceChart
              incomeData={dashboardData?.last60DaysIncome?.transactions || []}
              expenseData={dashboardData?.last60DaysExpenses?.transactions || []}
            />
          )}
        </div>

        {/* AI Insights */}
        <AIInsights />

        {/* Recent Transactions */}
        <div className='glass-card p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-text-primary'>Recent Transactions</h3>
              <p className='text-sm text-text-tertiary'>Your latest financial activity</p>
            </div>
            <Link to='/expense' className='btn-ghost flex items-center gap-2'>
              View All
              <HiOutlineArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className='space-y-3'>
              {[1, 2, 3].map(i => (
                <div key={i} className='skeleton h-20 rounded-xl'></div>
              ))}
            </div>
          ) : (
            <TransactionList
              transactions={dashboardData?.recentTransactions || []}
              showType={true}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home