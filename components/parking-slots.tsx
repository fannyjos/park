"use client"

import { ArrowLeft, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ParkingSlots({ area, selectedSlot, onSlotSelect, onBack, onNext }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mr-4" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-semibold">Select Parking Slot</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-medium text-lg">{area.name}</h3>
        <p className="text-gray-500">{area.location}</p>
        <p className="flex items-center gap-1 mt-1">
          <IndianRupee size={14} />
          <span>{area.rate}/hr</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="bg-gray-100 p-3 text-center rounded-md mb-6">
          <span className="text-gray-500 text-sm">Entrance/Exit</span>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {area.slots.map((slot) => (
            <div
              key={slot.id}
              className={`aspect-square rounded-md flex items-center justify-center font-semibold cursor-pointer transition-all ${
                !slot.isAvailable
                  ? "bg-red-50 text-red-500 border-2 border-red-500 cursor-not-allowed"
                  : selectedSlot && selectedSlot.id === slot.id
                    ? "bg-blue-50 text-blue-500 border-2 border-blue-500"
                    : "bg-green-50 text-green-500 border-2 border-green-500 hover:bg-green-100"
              }`}
              onClick={() => slot.isAvailable && onSlotSelect(slot)}
            >
              {slot.number}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-50 border-2 border-green-500"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-50 border-2 border-red-500"></div>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-blue-50 border-2 border-blue-500"></div>
            <span className="text-sm">Selected</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedSlot}>
          Proceed to Select Time
        </Button>
      </div>
    </div>
  )
}

