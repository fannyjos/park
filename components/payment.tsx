"use client"

import { useState } from "react"
import { ArrowLeft, IndianRupee, CreditCard, Smartphone, Building } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Payment({ bookingDetails, onBack, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState("upi")

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
      <div className="flex items-center mb-6">
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mr-4" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-semibold">Payment</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-medium text-lg mb-4">Booking Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span>Area:</span>
              <span className="font-medium">{bookingDetails.area.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Location:</span>
              <span className="font-medium">{bookingDetails.area.location}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Slot Number:</span>
              <span className="font-medium">{bookingDetails.slot.number}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Date:</span>
              <span className="font-medium">{formatDate(bookingDetails.date)}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Time:</span>
              <span className="font-medium">
                {formatTime(bookingDetails.startTime)} - {formatTime(bookingDetails.endTime)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Duration:</span>
              <span className="font-medium">
                {bookingDetails.duration} hour{bookingDetails.duration > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span>Base Amount:</span>
              <span className="font-medium flex items-center">
                <IndianRupee size={14} className="mr-1" />
                {bookingDetails.baseAmount}
              </span>
            </div>

            {bookingDetails.peakHourSurcharge > 0 && (
              <div className="flex justify-between py-2 border-b text-amber-600">
                <span>Peak Hour Surcharge:</span>
                <span className="font-medium flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {bookingDetails.peakHourSurcharge}
                </span>
              </div>
            )}

            {bookingDetails.weekendSurcharge > 0 && (
              <div className="flex justify-between py-2 border-b text-amber-600">
                <span>Weekend Surcharge:</span>
                <span className="font-medium flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {bookingDetails.weekendSurcharge}
                </span>
              </div>
            )}

            <div className="flex justify-between py-3 font-semibold text-lg">
              <span>Total Amount:</span>
              <span className="flex items-center">
                <IndianRupee size={16} className="mr-1" />
                {bookingDetails.totalAmount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-medium text-lg mb-4">Select Payment Method</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div
              className={`border-2 rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === "upi" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <Smartphone className="text-blue-500" size={24} />
              <span>UPI</span>
            </div>

            <div
              className={`border-2 rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard className="text-blue-500" size={24} />
              <span>Card</span>
            </div>

            <div
              className={`border-2 rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === "netbanking" ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setPaymentMethod("netbanking")}
            >
              <Building className="text-blue-500" size={24} />
              <span>Net Banking</span>
            </div>
          </div>

          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input type="password" placeholder="123" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                <input type="text" placeholder="John Doe" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Select a bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
              </select>
            </div>
          )}

          <Button className="w-full mt-6" onClick={() => onComplete(paymentMethod)}>
            Pay <IndianRupee size={14} className="mx-1" /> {bookingDetails.totalAmount}
          </Button>
        </div>
      </div>
    </div>
  )
}

