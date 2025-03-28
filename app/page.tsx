"use client"

import { useState, useEffect } from "react"
import { ParkingArea } from "@/components/parking-area"
import { ParkingSlots } from "@/components/parking-slots"
import { TimeSelection } from "@/components/time-selection"
import { Payment } from "@/components/payment"
import { Confirmation } from "@/components/confirmation"
import { MyBookings } from "@/components/my-bookings"
import { Header } from "@/components/header"
import { parkingAreas, generateSlots } from "@/lib/data"

// Initialize parking areas with slots
parkingAreas.forEach((area) => {
  area.slots = generateSlots(area.prefix, area.totalSlots)
})

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedArea, setSelectedArea] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [bookings, setBookings] = useState([])

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const storedBookings = localStorage.getItem("parkingBookings")
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }
  }, [])

  // Save bookings to localStorage when they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem("parkingBookings", JSON.stringify(bookings))
    }
  }, [bookings])

  const handleAreaSelect = (area) => {
    setSelectedArea(area)
    setCurrentPage("slots")
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
  }

  const handleTimeSubmit = (timeDetails) => {
    setBookingDetails({
      ...timeDetails,
      area: selectedArea,
      slot: selectedSlot,
    })
    setCurrentPage("payment")
  }

  const handlePaymentComplete = (paymentMethod) => {
    // Generate booking ID
    const bookingId = "PK" + Math.floor(100000 + Math.random() * 900000)

    // Create new booking
    const newBooking = {
      id: bookingId,
      area: {
        id: selectedArea.id,
        name: selectedArea.name,
        location: selectedArea.location,
        rate: selectedArea.rate,
      },
      slot: selectedSlot.number,
      date: bookingDetails.date,
      startTime: bookingDetails.startTime,
      endTime: bookingDetails.endTime,
      duration: bookingDetails.duration,
      baseAmount: bookingDetails.baseAmount,
      peakHourSurcharge: bookingDetails.peakHourSurcharge,
      weekendSurcharge: bookingDetails.weekendSurcharge,
      totalAmount: bookingDetails.totalAmount,
      paymentMethod: paymentMethod,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    // Add to bookings
    setBookings([...bookings, newBooking])

    // Navigate to confirmation
    setCurrentPage("confirmation")
  }

  const handleBookAnother = () => {
    setSelectedArea(null)
    setSelectedSlot(null)
    setBookingDetails(null)
    setCurrentPage("home")
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header currentPage={currentPage} navigateTo={navigateTo} />

      <main className="flex-1">
        {currentPage === "home" && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-2">Select Parking Area</h2>
            <p className="text-gray-500 mb-6">Choose a parking area to find available slots</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parkingAreas.map((area) => (
                <ParkingArea key={area.id} area={area} onSelect={() => handleAreaSelect(area)} />
              ))}
            </div>
          </div>
        )}

        {currentPage === "slots" && selectedArea && (
          <ParkingSlots
            area={selectedArea}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
            onBack={() => setCurrentPage("home")}
            onNext={() => selectedSlot && setCurrentPage("time")}
          />
        )}

        {currentPage === "time" && selectedArea && selectedSlot && (
          <TimeSelection
            area={selectedArea}
            slot={selectedSlot}
            onBack={() => setCurrentPage("slots")}
            onSubmit={handleTimeSubmit}
          />
        )}

        {currentPage === "payment" && bookingDetails && (
          <Payment
            bookingDetails={bookingDetails}
            onBack={() => setCurrentPage("time")}
            onComplete={handlePaymentComplete}
          />
        )}

        {currentPage === "confirmation" && bookingDetails && (
          <Confirmation
            booking={bookings[bookings.length - 1]}
            onViewBookings={() => setCurrentPage("bookings")}
            onBookAnother={handleBookAnother}
          />
        )}

        {currentPage === "bookings" && <MyBookings bookings={bookings} onBookNow={() => setCurrentPage("home")} />}
      </main>
    </div>
  )
}

