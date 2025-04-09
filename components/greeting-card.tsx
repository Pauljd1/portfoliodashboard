"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GreetingCardProps {
  className?: string
}

export function GreetingCard({ className }: GreetingCardProps) {
  const [greeting, setGreeting] = useState("")
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date()
      const hours = now.getHours()

      // Set greeting based on time of day
      if (hours < 12) {
        setGreeting("Good morning")
      } else if (hours < 18) {
        setGreeting("Good afternoon")
      } else {
        setGreeting("Good evening")
      }

      // Format time (HH:MM:SS)
      setTime(now.toLocaleTimeString())

      // Format date (Day, Month Date, Year)
      setDate(
        now.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }

    // Update immediately
    updateTimeAndGreeting()

    // Update every second
    const interval = setInterval(updateTimeAndGreeting, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Modern gradient background */}
      <CardHeader className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
        <CardTitle className="text-2xl font-bold">{greeting}, John</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-4xl font-mono font-bold">{time}</div>
          <div className="text-lg text-muted-foreground">{date}</div>
        </div>
      </CardContent>
    </Card>
  )
}
