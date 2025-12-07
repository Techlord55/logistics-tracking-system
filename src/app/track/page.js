// src/app/track/page.jsx
"use client"
import { useState } from "react"
import ShipmentDetails from "@/components/ShipmentDetails"
import ChatWidget from "@/components/ChatWidget";

export default function Track() {
  const [code, setCode] = useState("")
  const [shipment, setShipment] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!code.trim()) {
      setError("Please enter a tracking code")
      return
    }

    setError("")
    setShipment(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/tracking/${code}`)
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setShipment(data)
      }
    } catch (error) {
      setError("Error fetching shipment details")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6 md:p-8">
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
        Track your shipments across the globe in real-time. Enter your tracking number below.
      </p>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">Track Your Shipment</h1>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8">
          {/* Make flex responsive: stack on mobile */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., SHPGMQTPE)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ChatWidget />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4 text-center md:text-left">{error}</p>}
        </div>

        {shipment && <ShipmentDetails initialShipment={shipment} />}
      </div>
    </div>
  )
}
