import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/dashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import TransactionList from '../../components/TransactionList'
import IconPicker from '../../components/inputs/IconPicker'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { HiOutlinePlus, HiOutlineDownload, HiOutlineCash, HiOutlineX, HiOutlineTrendingUp } from 'react-icons/hi'
import toast from 'react-hot-toast'

// Source to icon mapping
const SOURCE_ICONS = {
  'Salary': 'briefcase',
  'Freelance': 'laptop',
  'Investment': 'trending',
  'Business': 'building',
  'Rental': 'home',
  'Gift': 'gift',
  'Bonus': 'star',
  'Interest': 'chart',
  'Dividend': 'trending',
  'Refund': 'refresh',
  'Other': 'cash'
}

const INCOME_SOURCES = Object.keys(SOURCE_ICONS)

const Income = () => {
  useUserAuth()
  
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    icon: 'cash',
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME)
      setIncomes(response.data)
    } catch (error) {
      console.error('Error fetching incomes:', error)
      toast.error('Failed to load incomes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [])

  // Calculate total
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0)

  // Reset form
  const resetForm = () => {
    setFormData({
      icon: 'cash',
      source: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)
  }

  // Open modal for adding
  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  // Open modal for editing
  const openEditModal = (income) => {
    setFormData({
      icon: income.icon || 'cash',
      source: income.source,
      amount: income.amount.toString(),
      date: new Date(income.date).toISOString().split('T')[0]
    })
    setEditingId(income._id)
    setShowModal(true)
  }

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.source || !formData.amount || !formData.date) {
      toast.error('Please fill all required fields')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      }

      if (editingId) {
        // Update existing
        await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(editingId), payload)
        toast.success('Income updated successfully!')
      } else {
        // Add new
        await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, payload)
        toast.success('Income added successfully!')
      }
      
      setShowModal(false)
      resetForm()
      fetchIncomes()
    } catch (error) {
      console.error('Error saving income:', error)
      toast.error(editingId ? 'Failed to update income' : 'Failed to add income')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))
      toast.success('Income deleted successfully!')
      fetchIncomes()
    } catch (error) {
      console.error('Error deleting income:', error)
      toast.error('Failed to delete income')
    }
  }

  // Handle Excel download
  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'income_report.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Download started!')
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error('Failed to download')
    }
  }

  // Transform incomes for TransactionList
  const transformedIncomes = incomes.map(income => ({
    ...income,
    type: 'income'
  }))

  return (
    <DashboardLayout activeMenu='Income'>
      <div className='space-y-8'>
        {/* Page Header */}
        <div className='page-header flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='page-title flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center'>
                <HiOutlineTrendingUp className='text-xl text-success' />
              </div>
              Income
            </h1>
            <p className='page-subtitle'>Track and manage your income sources</p>
          </div>
          <div className='flex gap-3'>
            <button 
              onClick={handleDownload}
              className='btn-secondary flex items-center gap-2 !w-auto px-5'
            >
              <HiOutlineDownload />
              Export Excel
            </button>
            <button 
              onClick={openAddModal}
              className='btn-primary flex items-center gap-2 !w-auto px-5'
            >
              <HiOutlinePlus />
              Add Income
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className='stat-card income max-w-md'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center'>
              <HiOutlineCash className='text-2xl text-success' />
            </div>
            <div>
              <p className='text-sm text-text-tertiary'>Total Income</p>
              <h3 className='text-3xl font-bold text-success tabular-nums'>
                ₹{totalIncome.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </div>

        {/* Income List */}
        <div className='glass-card p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-text-primary'>All Income</h3>
              <p className='text-sm text-text-tertiary'>{incomes.length} transactions</p>
            </div>
          </div>
          
          {loading ? (
            <div className='space-y-3'>
              {[1, 2, 3].map(i => (
                <div key={i} className='skeleton h-20 rounded-xl'></div>
              ))}
            </div>
          ) : (
            <TransactionList
              transactions={transformedIncomes}
              onDelete={handleDelete}
              onEdit={openEditModal}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal-content max-w-md' onClick={e => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-text-primary'>
                {editingId ? 'Edit Income' : 'Add Income'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className='p-2 rounded-lg hover:bg-surface-tertiary transition-colors'
              >
                <HiOutlineX className='text-xl text-text-secondary' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Icon Picker */}
              <div>
                <label className='text-sm font-medium text-text-secondary mb-2 block'>
                  Icon
                </label>
                <IconPicker 
                  selectedIcon={formData.icon}
                  onSelect={(iconId) => setFormData(prev => ({ ...prev, icon: iconId }))}
                  type='income'
                />
              </div>

              {/* Source */}
              <div>
                <label className='text-sm font-medium text-text-secondary mb-2 block'>
                  Source *
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => {
                    const source = e.target.value
                    setFormData(prev => ({ 
                      ...prev, 
                      source,
                      icon: SOURCE_ICONS[source] || 'cash'
                    }))
                  }}
                  className='input-box'
                >
                  <option value=''>Select a source</option>
                  {INCOME_SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className='text-sm font-medium text-text-secondary mb-2 block'>
                  Amount *
                </label>
                <input
                  type='number'
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder='0.00'
                  className='input-box'
                  min='0'
                  step='0.01'
                />
              </div>

              {/* Date */}
              <div>
                <label className='text-sm font-medium text-text-secondary mb-2 block'>
                  Date *
                </label>
                <input
                  type='date'
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className='input-box'
                />
              </div>

              <button 
                type='submit' 
                className='btn-primary'
                disabled={submitting}
              >
                {submitting 
                  ? (editingId ? 'Updating...' : 'Adding...') 
                  : (editingId ? 'Update Income' : 'Add Income')
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Income