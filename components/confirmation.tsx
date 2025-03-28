"use client"

import { CheckCircle, QrCode, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Confirmation({ booking, onViewBookings, onBookAnother }) {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 mb-4">
          <CheckCircle size={64} className="mx-auto" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-6">Your parking slot has been successfully booked.</p>

        <div className="text-left space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b">
            <span>Booking ID:</span>
            <span className="font-medium">{booking.id}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Area:</span>
            <span className="font-medium">{booking.area.name}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Location:</span>
            <span className="font-medium">{booking.area.location}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Slot:</span>
            <span className="font-medium">{booking.slot}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Date:</span>
            <span className="font-medium">{formatDate(booking.date)}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Time:</span>
            <span className="font-medium">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Duration:</span>
            <span className="font-medium">
              {booking.duration} hour{booking.duration > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Base Amount:</span>
            <span className="font-medium flex items-center">
              <IndianRupee size={14} className="mr-1" />
              {booking.baseAmount}
            </span>
          </div>

          {booking.peakHourSurcharge > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>Peak Hour Surcharge:</span>
              <span className="font-medium flex items-center">
                <IndianRupee size={14} className="mr-1" />
                {booking.peakHourSurcharge}
              </span>
            </div>
          )}

          {booking.weekendSurcharge > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>Weekend Surcharge:</span>
              <span className="font-medium flex items-center">
                <IndianRupee size={14} className="mr-1" />
                {booking.weekendSurcharge}
              </span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b">
            <span>Amount Paid:</span>
            <span className="font-medium flex items-center">
              <IndianRupee size={14} className="mr-1" />
              {booking.totalAmount}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="w-32 h-32 mx-auto bg-gray-100 flex items-center justify-center mb-2">
            <QrCode size={64} />
          </div>
          <p className="text-sm text-gray-500">Show this QR code at the entrance</p>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={onViewBookings}>
            View My Bookings
          </Button>

          <Button className="flex-1" onClick={onBookAnother}>
            Book Another Slot
          </Button>
        </div>
      </div>
    </div>
  )
}

