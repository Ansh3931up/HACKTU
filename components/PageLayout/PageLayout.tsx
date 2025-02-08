'use client'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import Sidebar from '../Slide_bar/Slide_bar'
import React from 'react'

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Check if we're on mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile) setIsSidebarOpen(false)
    },
    onSwipedRight: () => {
      if (isMobile) setIsSidebarOpen(true)
    },
    trackMouse: false,
  })

  // Convert children to array and separate header from content
  const childrenArray = React.Children.toArray(children)
  const header = childrenArray[0]
  const content = childrenArray.slice(1)

  return (
    <div className="flex h-screen" {...swipeHandlers}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Header Section */}
        <div className="w-full bg-white border-b">{header}</div>

        {/* Page Content */}
        <div className="flex-1 w-full px-8 py-6 bg-[#EEECEF] dark:bg-[#1F1F1F]">
          {content}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
