"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, IndianRupee, Plus, Minus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TimeSelection({ area, slot, onBack, onSubmit }) {
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration, setDuration] = useState(1)
  const [totalAmount, setTotalAmount] = useState(area.rate)
  const [baseAmount, setBaseAmount] = useState(area.rate)
  const [peakHourSurcharge, setPeakHourSurcharge] = useState(0)
  const [weekendSurcharge, setWeekendSurcharge] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Set today as default date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDate(today)
  }, [])

  // Calculate total amount when inputs change
  useEffect(() => {
    if (!date || !startTime) return

    // Base amount
    const base = area.rate * duration
    setBaseAmount(base)

    let amount = base
    let peakSurcharge = 0
    let weekendSurcharge = 0

    // Apply time-based pricing (peak hours cost more)
    const hour = Number.parseInt(startTime.split(":")[0])
    // Peak hours: 9 AM to 6 PM (9-18)
    if (hour >= 9 && hour < 18) {
      peakSurcharge = Math.round(base * 0.2) // 20% surcharge during peak hours
      amount += peakSurcharge
    }
    setPeakHourSurcharge(peakSurcharge)

    // Apply weekend pricing
    const day = new Date(date).getDay()
    // Weekend: Saturday (6) and Sunday (0)
    if (day === 0 || day === 6) {
      weekendSurcharge = Math.round(amount * 0.25) // 25% surcharge on weekends
      amount += weekendSurcharge
    }
    setWeekendSurcharge(weekendSurcharge)

    setTotalAmount(Math.round(amount))
  }, [date, startTime, duration, area.rate])

  const decreaseDuration = () => {
    if (duration > 1) {
      setDuration(duration - 1)
    }
  }

  const increaseDuration = () => {
    if (duration < 24) {
      setDuration(duration + 1)
    }
  }

  const handleConfirm = () => {
    if (!date || !startTime) return
    setShowConfirmation(true)
  }

  const handleSubmit = () => {
    if (!date || !startTime) return

    // Calculate end time
    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000)
    const endTime = endDateTime.toTimeString().substring(0, 5)

    onSubmit({
      date,
      startTime,
      endTime,
      duration,
      totalAmount,
      baseAmount,
      peakHourSurcharge,
      weekendSurcharge,
    })
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mr-4" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-semibold">Select Time Duration</h2>
      </div>

      {!showConfirmation ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Area:</span>
                <span className="ml-2 font-medium">{area.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Slot:</span>
                <span className="ml-2 font-medium">{slot.number}</span>
              </div>
              <div>
                <span className="text-gray-500">Rate:</span>
                <span className="ml-2 font-medium flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {area.rate}/hr
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                <div className="flex items-center">
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-l-md"
                    onClick={decreaseDuration}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={duration}
                    readOnly
                    className="w-16 h-10 text-center border-t border-b border-gray-300"
                  />
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-r-md"
                    onClick={increaseDuration}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-lg mb-4">Price Calculation</h3>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Base Rate:</span>
                  <span className="flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    {area.rate}/hr
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span>Duration:</span>
                  <span>{duration} hours</span>
                </div>

                <div className="flex justify-between mb-2">
                  <span>Base Amount:</span>
                  <span className="flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    {baseAmount}
                  </span>
                </div>

                {peakHourSurcharge > 0 && (
                  <div className="flex justify-between mb-2 text-amber-600">
                    <span>Peak Hour Surcharge (20%):</span>
                    <span className="flex items-center">
                      <IndianRupee size={14} className="mr-1" />
                      {peakHourSurcharge}
                    </span>
                  </div>
                )}

                {weekendSurcharge > 0 && (
                  <div className="flex justify-between mb-2 text-amber-600">
                    <span>Weekend Surcharge (25%):</span>
                    <span className="flex items-center">
                      <IndianRupee size={14} className="mr-1" />
                      {weekendSurcharge}
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span className="flex items-center">
                    <IndianRupee size={16} className="mr-1" />
                    {totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleConfirm} disabled={!date || !startTime}>
              Confirm Booking Details
            </Button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-4 rounded-md mb-6">
            <AlertCircle size={24} />
            <p>Please review your booking details before proceeding to payment.</p>
          </div>

          <h3 className="font-medium text-lg mb-4">Booking Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span>Area:</span>
              <span className="font-medium">{area.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Location:</span>
              <span className="font-medium">{area.location}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Slot Number:</span>
              <span className="font-medium">{slot.number}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Date:</span>
              <span className="font-medium">{formatDate(date)}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Time:</span>
              <span className="font-medium">
                {formatTime(startTime)} - {formatTime(calculateEndTime(startTime, duration))}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Duration:</span>
              <span className="font-medium">
                {duration} hour{duration > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Base Amount:</span>
              <span className="font-medium flex items-center">
                <IndianRupee size={14} className="mr-1" />
                {baseAmount}
              </span>
            </div>

            {peakHourSurcharge > 0 && (
              <div className="flex justify-between py-2 border-b text-amber-600">
                <span>Peak Hour Surcharge:</span>
                <span className="font-medium flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {peakHourSurcharge}
                </span>
              </div>
            )}

            {weekendSurcharge > 0 && (
              <div className="flex justify-between py-2 border-b text-amber-600">
                <span>Weekend Surcharge:</span>
                <span className="font-medium flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {weekendSurcharge}
                </span>
              </div>
            )}

            <div className="flex justify-between py-3 font-semibold text-lg">
              <span>Total Amount:</span>
              <span className="flex items-center">
                <IndianRupee size={16} className="mr-1" />
                {totalAmount}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Edit Details
            </Button>

            <Button onClick={handleSubmit}>Proceed to Payment</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to calculate end time
function calculateEndTime(startTime, duration) {
  if (!startTime) return ""

  const [hours, minutes] = startTime.split(":")
  const startDate = new Date()
  startDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0)

  const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000)
  return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
}

