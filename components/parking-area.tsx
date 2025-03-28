"use client"

import { Building, Hospital, Utensils, GraduationCap, ShoppingBag, Car, IndianRupee } from "lucide-react"

const icons = {
  building: Building,
  hospital: Hospital,
  food: Utensils,
  education: GraduationCap,
  shopping: ShoppingBag,
}

export function ParkingArea({ area, onSelect }) {
  const Icon = icons[area.icon] || Building

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 flex gap-4 cursor-pointer hover:shadow-lg hover:translate-y-[-2px] transition-all border-2 border-transparent hover:border-blue-200"
      onClick={onSelect}
    >
      <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-500">
        <Icon size={24} />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-lg">{area.name}</h3>
        <p className="text-gray-500 text-sm">{area.location}</p>

        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Car size={14} />
            <span>{area.totalSlots} slots</span>
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee size={14} />
            <span>{area.rate}/hr</span>
          </span>
        </div>
      </div>
    </div>
  )
}

