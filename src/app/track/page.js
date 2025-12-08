"use client"

import { useState } from "react"
import ShipmentDetails from "@/components/ShipmentDetails"
import ChatWidget from "@/components/ChatWidget"
import Navbar from "@/components/Navbar"
import { Search, Package, MapPin, TrendingUp, Shield } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar showFullNav={false} />

      {!shipment ? (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-purple-600 to-orange-500 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-6">
                <Package className="w-16 h-16 mx-auto" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                Track Your Shipment
              </h1>
              <p className="text-xl md:text-2xl opacity-95 drop-shadow-md">
                Real-time tracking across the globe. Enter your tracking number to get started.
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enter Tracking Code</h2>
                  <p className="text-sm text-gray-600">Find your shipment in seconds</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., SHPGMQTPE)"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    className="w-full px-6 py-4 pl-14 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
                  />
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>

                <button
                  onClick={handleTrack}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track Shipment
                    </>
                  )}
                </button>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">💡 Quick Tips:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Tracking codes are usually 6-12 characters long</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Check your shipment confirmation email for your tracking code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Tracking information updates every few minutes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Track With Us?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Real-Time Updates</h4>
                <p className="text-gray-600">
                  Get instant location updates and estimated delivery times with GPS tracking
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Progress Tracking</h4>
                <p className="text-gray-600">
                  Visual progress bars and timeline showing your shipment's journey
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h4>
                <p className="text-gray-600">
                  Your tracking information is encrypted and accessible only to authorized users
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h3 className="text-3xl font-bold mb-4">Need Help?</h3>
              <p className="text-xl mb-6 opacity-90">
                Our support team is available 24/7 to assist you
              </p>
              <a
                href="/support"
                className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                Contact Support
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="pb-8">
          <ShipmentDetails initialShipment={shipment} />
        </div>
      )}

      <ChatWidget />
    </div>
  )
}