"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface ModernDateTimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
}

export function ModernDateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
}: ModernDateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"date" | "time">("date")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()
  const currentDay = selectedDate.getDate()
  const currentHour = selectedDate.getHours()
  const currentMinute = selectedDate.getMinutes()

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(day)
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const handleTimeChange = (hour: number, minute: number) => {
    const newDate = new Date(selectedDate)
    newDate.setHours(hour, minute)
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setSelectedDate(newDate)
  }

  const formatDisplayDate = () => {
    if (!selectedDate) return placeholder
    return selectedDate.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === currentDay
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()

      days.push(
        <Button
          key={day}
          variant={isSelected ? "default" : "ghost"}
          size="sm"
          className={cn(
            "h-10 w-10 p-0 font-normal",
            isSelected && "bg-primary text-primary-foreground",
            isToday && !isSelected && "bg-accent text-accent-foreground",
            "hover:bg-accent hover:text-accent-foreground",
          )}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </Button>,
      )
    }

    return days
  }

  const renderTimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Hour</Label>
          <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto scrollbar-hide">
            {hours.map((hour) => (
              <Button
                key={hour}
                variant={hour === currentHour ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleTimeChange(hour, currentMinute)}
              >
                {hour.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Minute</Label>
          <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto scrollbar-hide">
            {minutes
              .filter((m) => m % 5 === 0)
              .map((minute) => (
                <Button
                  key={minute}
                  variant={minute === currentMinute ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleTimeChange(currentHour, minute)}
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDisplayDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <Button
                variant={activeTab === "date" ? "default" : "ghost"}
                size="sm"
                className="flex-1 rounded-none rounded-tl-lg"
                onClick={() => setActiveTab("date")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </Button>
              <Button
                variant={activeTab === "time" ? "default" : "ghost"}
                size="sm"
                className="flex-1 rounded-none rounded-tr-lg"
                onClick={() => setActiveTab("time")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Time
              </Button>
            </div>

            {/* Date Picker */}
            {activeTab === "date" && (
              <div className="p-4 space-y-4">
                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium">
                    {months[currentMonth]} {currentYear}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="h-10 w-10 flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
              </div>
            )}

            {/* Time Picker */}
            {activeTab === "time" && <div className="p-4">{renderTimePicker()}</div>}

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t bg-muted/30">
              <div className="text-xs text-muted-foreground">Selected: {formatDisplayDate()}</div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
