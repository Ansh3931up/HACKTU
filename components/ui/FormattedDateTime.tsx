"use client"
import { useEffect, useState } from 'react'

export function FormattedDateTime({ timestamp }: { timestamp: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <span className="text-gray-800 dark:text-gray-200">
      {new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })}
    </span>
  )
} 