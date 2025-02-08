"use client"

import { format, parseISO } from "date-fns"
import { useState, useEffect } from "react"

interface FormattedDateProps {
  dateString: string
}

export function FormattedDate({ dateString }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    // Only format the date on the client side
    const date = parseISO(dateString)
    setFormattedDate(format(date, "P, p")) // Using date-fns built-in localized formats
  }, [dateString])

  // Return empty during SSR, then update after hydration
  return <>{formattedDate}</>
} 