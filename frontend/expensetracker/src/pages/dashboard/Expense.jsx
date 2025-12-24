import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/dashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import TransactionList from '../../components/TransactionList'
import CategoryChart from '../../components/Charts/CategoryChart'
import IconPicker from '../../components/inputs/IconPicker'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { HiOutlinePlus, HiOutlineDownload, HiOutlineCreditCard, HiOutlineX, HiOutlineTrendingDown } from 'react-icons/hi'
import toast from 'react-hot-toast'

// Category to icon mapping
const CATEGORY_ICONS = {
  'Food & Dining': 'food',
  'Transportation': 'car',
  'Shopping': 'cart',
  'Entertainment': 'music',
  'Bills & Utilities': 'lightbulb',
  'Healthcare': 'health',
  'Education': 'book',
  'Travel': 'plane',
  'Groceries': 'basket',
  'Personal Care': 'user',
  'Other': 'dots'
}

const EXPENSE_CATEGORIES = Object.keys(CATEGORY_ICONS)

const Expense = () => {
  useUserAuth()
  
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    icon: 'cart',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
      setExpenses(response.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  // Calculate total
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  // Reset form
  const resetForm = () => {
    setFormData({
      icon: 'cart',
      category: '',
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
  const openEditModal = (expense) => {
    setFormData({
      icon: expense.icon || 'cart',
      category: expense.category,
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().split('T')[0]
    })
    setEditingId(expense._id)
    setShowModal(true)
  }

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.date) {
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
        await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(editingId), payload)
        toast.success('Expense updated successfully!')
      } else {
        // Add new
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, payload)
        toast.success('Expense added successfully!')
      }
      
      setShowModal(false)
      resetForm()
      fetchExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
      toast.error(editingId ? 'Failed to update expense' : 'Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      toast.success('Expense deleted successfully!')
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
    }
  }

  // Handle Excel download
  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'expense_report.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Download started!')
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error('Failed to download')
    }
  }

  // Transform expenses for TransactionList
  const transformedExpenses = expenses.map(expense => ({
    ...expense,
    type: 'expense'
  }))

  return (
    <DashboardLayout activeMenu='Expense'>
      <div className='space-y-8'>
        {/* Page Header */}
        <div className='page-header flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='page-title flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center'>
                <HiOutlineTrendingDown className='text-xl text-danger' />
              </div>
              Expenses
            </h1>
            <p className='page-subtitle'>Track and manage your expenses</p>
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
              Add Expense
            </button>
          </div>
        </div>

        {/* Stats and Chart Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Stats Card */}
          <div className='stat-card expense'>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center'>
                <HiOutlineCreditCard className='text-2xl text-danger' />
              </div>
              <div>
                <p className='text-sm text-text-tertiary'>Total Expenses</p>
                <h3 className='text-3xl font-bold text-danger tabular-nums'>
                  ₹{totalExpense.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          </div>

          {/* Category Chart */}
          <CategoryChart expenses={expenses} />
        </div>

        {/* Expense List */}
        <div className='glass-card p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-text-primary'>All Expenses</h3>
              <p className='text-sm text-text-tertiary'>{expenses.length} transactions</p>
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
              transactions={transformedExpenses}
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
                {editingId ? 'Edit Expense' : 'Add Expense'}
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
                  type='expense'
                />
              </div>

              {/* Category */}
              <div>
                <label className='text-sm font-medium text-text-secondary mb-2 block'>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const category = e.target.value
                    setFormData(prev => ({ 
                      ...prev, 
                      category,
                      icon: CATEGORY_ICONS[category] || 'cart'
                    }))
                  }}
                  className='input-box'
                >
                  <option value=''>Select a category</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  : (editingId ? 'Update Expense' : 'Add Expense')
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Expense