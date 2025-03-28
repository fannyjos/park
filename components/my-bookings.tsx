"use client"

import { useState, useEffect } from "react"
import { CalendarX, History, QrCode, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MyBookings({ bookings, onBookNow }) {
  const [activeTab, setActiveTab] = useState("active")
  const [activeBookings, setActiveBookings] = useState([])
  const [pastBookings, setPastBookings] = useState([])

  // Update booking statuses and filter active/past bookings
  useEffect(() => {
    const now = new Date()

    const updatedBookings = bookings.map((booking) => {
      const bookingEndDateTime = new Date(`${booking.date}T${booking.endTime}`)

      if (bookingEndDateTime < now && booking.status === "active") {
        return { ...booking, status: "expired" }
      }

      return booking
    })

    setActiveBookings(updatedBookings.filter((booking) => booking.status === "active"))
    setPastBookings(updatedBookings.filter((booking) => booking.status === "expired"))
  }, [bookings])

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
      <h2 className="text-2xl font-semibold mb-2">My Bookings</h2>
      <p className="text-gray-500 mb-6">Manage your parking bookings</p>

      <div className="flex mb-6">
        <button
          className={`px-6 py-2 font-medium ${activeTab === "active" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
        <button
          className={`px-6 py-2 font-medium ${activeTab === "past" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === "active" && (
          <>
            {activeBookings.length === 0 ? (
              <div className="text-center py-12">
                <CalendarX size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">You don't have any active bookings</p>
                <Button onClick={onBookNow}>Book Now</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 rounded-md p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between mb-4">
                      <div>
                        <span className="font-medium text-lg">{booking.id}</span>
                        <p className="text-gray-500">
                          {booking.area.name}, {booking.area.location}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full h-fit">Active</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Slot</div>
                          <div className="font-medium">{booking.slot}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-medium">{formatDate(booking.date)}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Time</div>
                          <div className="font-medium">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-medium">
                            {booking.duration} hour{booking.duration > 1 ? "s" : ""}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Base Rate</div>
                          <div className="font-medium flex items-center">
                            <IndianRupee size={14} className="mr-1" />
                            {booking.area.rate}/hr
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Total Amount</div>
                          <div className="font-medium flex items-center">
                            <IndianRupee size={14} className="mr-1" />
                            {booking.totalAmount}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-500">Booked on: </span>
                          <span className="text-sm">{formatDate(booking.createdAt.split("T")[0])}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <QrCode size={14} className="mr-2" />
                          Show QR
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "past" && (
          <>
            {pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <History size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">You don't have any past bookings</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 rounded-md p-6 border-l-4 border-red-500">
                    <div className="flex justify-between mb-4">
                      <div>
                        <span className="font-medium text-lg">{booking.id}</span>
                        <p className="text-gray-500">
                          {booking.area.name}, {booking.area.location}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full h-fit">Expired</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Slot</div>
                          <div className="font-medium">{booking.slot}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-medium">{formatDate(booking.date)}</div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Time</div>
                          <div className="font-medium">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-medium">
                            {booking.duration} hour{booking.duration > 1 ? "s" : ""}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Base Rate</div>
                          <div className="font-medium flex items-center">
                            <IndianRupee size={14} className="mr-1" />
                            {booking.area.rate}/hr
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500">Total Amount</div>
                          <div className="font-medium flex items-center">
                            <IndianRupee size={14} className="mr-1" />
                            {booking.totalAmount}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-sm text-gray-500">Booked on: </span>
                        <span className="text-sm">{formatDate(booking.createdAt.split("T")[0])}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

