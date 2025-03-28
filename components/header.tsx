"use client"

import { useState } from "react"
import { Car } from "lucide-react"

export function Header({ currentPage, navigateTo }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold">Park Smart</h1>
        </div>

        <nav>
          <ul className="flex gap-4">
            <li>
              <button
                className={`px-3 py-2 rounded-md ${currentPage === "home" || currentPage === "slots" || currentPage === "time" || currentPage === "payment" || currentPage === "confirmation" ? "text-blue-500 bg-blue-50" : "text-gray-500"}`}
                onClick={() => navigateTo("home")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`px-3 py-2 rounded-md ${currentPage === "bookings" ? "text-blue-500 bg-blue-50" : "text-gray-500"}`}
                onClick={() => navigateTo("bookings")}
              >
                My Bookings
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

