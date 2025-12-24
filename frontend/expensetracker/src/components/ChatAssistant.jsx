import React, { useState, useRef, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { HiOutlineChatAlt2, HiOutlinePaperAirplane, HiOutlineX, HiOutlineSparkles } from 'react-icons/hi'

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI financial assistant. Ask me anything about your spending, budgets, or savings tips!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
        message: userMessage
      })
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I couldn't process that. Please make sure your Gemini API key is configured correctly." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "What's my biggest expense?",
    "How can I save more?",
    "Summarize my spending"
  ]

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full 
                   bg-gradient-to-r from-primary to-primary-light
                   shadow-xl shadow-primary/30 flex items-center justify-center
                   text-white text-xl hover:shadow-2xl hover:shadow-primary/40 
                   hover:scale-110 active:scale-95 transition-all duration-300 z-50`}
      >
        {isOpen ? <HiOutlineX /> : <HiOutlineChatAlt2 />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className='fixed bottom-24 right-6 w-[380px] h-[500px] rounded-2xl 
                     shadow-2xl flex flex-col z-50 animate-scale-in overflow-hidden'
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-primary to-primary-light p-4 text-white'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center'>
                <HiOutlineSparkles className='text-xl' />
              </div>
              <div>
                <h3 className='font-semibold'>Quantifi AI</h3>
                <p className='text-xs text-white/70'>Your Financial Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-primary-light text-white rounded-br-md'
                      : 'rounded-bl-md'
                  }`}
                  style={msg.role === 'assistant' ? { 
                    backgroundColor: 'var(--color-surface-tertiary)',
                    color: 'var(--color-text-primary)'
                  } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className='flex justify-start'>
                <div 
                  className='p-3 rounded-2xl rounded-bl-md'
                  style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                >
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                    <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                    <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className='px-4 pb-2'>
              <p className='text-xs mb-2' style={{ color: 'var(--color-text-tertiary)' }}>Quick questions:</p>
              <div className='flex flex-wrap gap-2'>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q)
                    }}
                    className='px-3 py-1.5 text-xs rounded-full
                             hover:bg-primary/10 hover:text-primary
                             transition-colors'
                    style={{ 
                      backgroundColor: 'var(--color-surface-tertiary)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div 
            className='p-4'
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className='flex items-center gap-2'>
              <input
                ref={inputRef}
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ask about your finances...'
                className='flex-1 px-4 py-3 rounded-xl text-sm
                         outline-none focus:ring-2 focus:ring-primary/20'
                style={{ 
                  backgroundColor: 'var(--color-surface-tertiary)',
                  color: 'var(--color-text-primary)'
                }}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className='w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-primary-light
                         text-white flex items-center justify-center
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-primary/25 transition-all'
              >
                <HiOutlinePaperAirplane className='text-lg transform rotate-90' />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatAssistant
