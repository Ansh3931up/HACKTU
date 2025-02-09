'use client'
import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Message {
  text: string
  isUser: boolean
  timestamp?: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessageToAPI = async (message: string) => {
    try {
      const response = await fetch('http://localhost:5000/chat', {  // Update with your Flask API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error:', error)
      return 'Sorry, I encountered an error. Please try again.'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = { 
      text: input.trim(), 
      isUser: true,
      timestamp: new Date() 
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Get bot response from API
    const botResponse = await sendMessageToAPI(userMessage.text)
    
    // Add bot message
    const botMessage: Message = { 
      text: botResponse, 
      isUser: false,
      timestamp: new Date() 
    }
    setMessages(prev => [...prev, botMessage])
    setIsLoading(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/image/logo.jpeg"
                alt="Security Assistant"
                width={60}
                height={60}
                className="rounded-full"
              />
              <h3 className="text-lg font-semibold">Security Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-base">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {message.text}
                  {message.timestamp && (
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-900 text-base 
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-50 hover:bg-[#521c93] rounded-full p-1 shadow-lg"
        >
          <Image
            src="/image/logo.jpeg"
            alt="Chat with Security Assistant"
            width={60}
            height={60}
            className="rounded-full"
          />
        </button>
      )}
    </div>
  )
} 