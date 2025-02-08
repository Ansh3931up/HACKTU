'use client'
import { DM_Sans } from 'next/font/google'
import { useState, useEffect } from 'react'
import logo from '@/public/image/logo.jpeg'
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'
import {
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ChevronLeftIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import {
  Shield,
  Activity,
  Terminal,
  Settings,
  HelpCircle,
  ChevronRightIcon,
} from 'lucide-react'

const dmSans = DM_Sans({ subsets: ['latin'] })

interface NavItem {
  name: string
  icon: React.ElementType
  path: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Threat Analysis', icon: Shield, path: '/threat-analysis' },
  { name: 'Network Monitoring', icon: Activity, path: '/network-monitoring' },
  { name: 'Security Tools', icon: Terminal, path: '/security-tools' },
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Help & Support', icon: HelpCircle, path: '/help' },
]

const bottomNavItems: NavItem[] = [
  { name: 'Logout', icon: ArrowLeftOnRectangleIcon, path: '/logout' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMobile: boolean
}

export default function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme')
    const isDark =
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)

    setIsDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light')
  }

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile) setIsOpen(false)
    },
    onSwipedRight: () => {
      if (isMobile) setIsOpen(true)
    },
    trackMouse: false,
  })

  // Overlay for mobile when sidebar is open
  const Overlay = () => (
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
        isOpen && isMobile
          ? 'opacity-100 z-20'
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsOpen(false)}
    />
  )

  return (
    <>
      <Overlay />
      <div className="relative" {...swipeHandlers}>
        <div
          className={`${isOpen ? 'w-64' : 'w-20'} ${
            isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
          } ${dmSans.className} fixed shadow-lg  h-screen rounded-r-xl bg-[#30006C] transition-all duration-300 ease-in-out p-4 flex flex-col justify-between  z-30`}
        >
          {/* Top section with logo */}
          <div>
            <div
              className={`flex items-center mb-8 ${!isOpen ? 'justify-center' : 'mx-2'}`}
            >
              {/* <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center"> */}
              <Image src={logo} alt="logo" className="w-16" />
              {/* </div> */}
              {isOpen && (
                <span className="ml-3 text-xl dark:text-gray-300 font-semibold text-white">
                  ShadowNet
                </span>
              )}
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1 font-semibold">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`flex items-center ${
                    isOpen ? 'p-3 gap-1 mx-2' : 'p-3 justify-center'
                  } text-white dark:text-gray-300 hover:bg-white/10 rounded-lg transition-colors`}
                >
                  <item.icon className="w-6 h-6 min-w-6" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom section */}
          <div className="space-y-1 font-semibold">
            {bottomNavItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`flex items-center ${
                  isOpen ? 'p-3 mx-2' : 'p-3 justify-center'
                } text-white dark:text-gray-300 hover:bg-white/10 rounded-lg transition-colors`}
              >
                <item.icon className="w-6 h-6 min-w-6" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </a>
            ))}

            {/* Dark Mode Toggle - Always visible */}
            <div
              className={`flex items-center ${
                isOpen ? 'px-6' : 'justify-center'
              } py-4 text-white hover:bg-white/10 cursor-pointer`}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6" />
              )}
              {isOpen && (
                <span className="ml-3 text-sm font-medium whitespace-nowrap">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button - visible only on desktop */}
        {!isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed top-6 ${
              isOpen ? 'left-64' : 'left-20'
            } -translate-x-1/2  w-8 h-8 bg-[#30006C] dark:text-gray-300 rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-300 ease-in-out z-30 ${
              isOpen ? '' : 'rotate-180'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Mobile Toggle Button - visible only when sidebar is closed on mobile */}
        {isMobile && !isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed top-5 -left-2 w-8 h-8 opacity-65 bg-[#30006C] rounded-xl flex items-center justify-center hover:opacity-90 transition-all duration-300 ease-in-out z-30"
          >
            {/* <Bars3Icon className="w-6 h-6 text-white" /> */}
            <ChevronRightIcon className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </>
  )
}
