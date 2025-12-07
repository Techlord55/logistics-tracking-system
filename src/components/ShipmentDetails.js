'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'
import ShipmentQRCode from './ShipmentQRCode'
import ShipmentAdminControls from './ShipmentAdminControls'
import ShipmentEdit from './ShipmentEdit'
import ShipmentHistory from './ShipmentHistory'
// Client-only map
const MapLeaflet = dynamic(() => import('./MapLeaflet'), { ssr: false })

export default function ShipmentDetails({ initialShipment, isAdmin = false }) {
  const [shipment, setShipment] = useState(initialShipment ?? null)
  const [location, setLocation] = useState({
    lat: initialShipment?.current_lat ?? null,
    lng: initialShipment?.current_lng ?? null,
  })
  const [progress, setProgress] = useState(initialShipment?.progress ?? 0)
  const [activeTab, setActiveTab] = useState('details')
  const [email, setEmail] = useState('')
  const [notifyMessage, setNotifyMessage] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [polling, setPolling] = useState(true)
  const mounted = useRef(false)

  // Helper to format null/undefined
  const fmt = (v) => (v === null || v === undefined || v === '' ? '—' : v)

  // Calculate ETA (memoized)
  const eta = useMemo(() => {
    if (!shipment?.created_at || !shipment?.estimated_hours) return { time: 'N/A', hours: 'N/A' }
    const startTime = new Date(shipment.created_at)
    const arrivalTime = new Date(startTime.getTime() + shipment.estimated_hours * 60 * 60 * 1000)
    const formattedArrival = arrivalTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    return { time: formattedArrival, hours: shipment.estimated_hours }
  }, [shipment])

  // Poll backend for current location and progress
  useEffect(() => {
    if (!initialShipment?.code) return

    mounted.current = true
    let intervalId

    async function fetchShipment() {
      try {
        const res = await fetch(`/api/tracking/${initialShipment.code}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!mounted.current) return

        // 1. Always update the main shipment data
        setShipment(data)

        // 2. Define stopping statuses
        const statusStopsMovement = data.status === 'On Hold' || data.status === 'Cancelled' || data.status === 'Delivered'

        // 3. ONLY update location & progress if movement allowed
        if (!statusStopsMovement) {
          setLocation({ lat: data.current_lat ?? null, lng: data.current_lng ?? null })
          setProgress(data.progress ?? 0)
        } else {
          // BLOCK progress & location updates once movement stops
          // Keep shipment state updated (for timestamps, status text) but do not change movement state
          console.log('Movement stopped — location & progress frozen')
        }

        // 4. Stop polling permanently for final statuses (Delivered/Cancelled/On Hold)
        if (data.status === 'Cancelled' || data.status === 'Delivered' || data.status === 'On Hold') {
          setPolling(false)
        }
      } catch (err) {
        console.error('Polling error', err)
      }
    }

    fetchShipment()
    intervalId = setInterval(() => {
      if (polling) fetchShipment()
    }, 3000)

    return () => {
      mounted.current = false
      clearInterval(intervalId)
    }
  }, [initialShipment?.code, polling])

  // Handle Notify Me form
  const handleNotifySubmit = async (e) => {
    e.preventDefault()
    if (!email) return setNotifyMessage('Please enter your email')
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, shipmentCode: shipment?.code }),
      })
      const data = await res.json()
      setNotifyMessage(data.message || 'Notification request submitted!')
    } catch (err) {
      console.error(err)
      setNotifyMessage('Something went wrong')
    }
  }

  // Return loading if no shipment yet
  if (!shipment) {
    return <p className="text-center p-8 text-gray-500">Loading tracking details...</p>
  }

  // Utilities for UI
  const displayStatus = shipment.status === 'On Hold' ? 'Stopped' : shipment.status
  const progressPct = Math.min(100, Math.round((progress || 0) * 100))

  // Determine progress bar color based on status
  const progressBarClass =
    shipment.status === 'Delivered'
      ? 'bg-green-600'
      : shipment.status === 'On Hold'
      ? 'bg-yellow-500'
      : shipment.status === 'Cancelled'
      ? 'bg-red-600'
      : shipment.status === 'In Transit'
      ? 'bg-blue-600'
      : 'bg-gray-500'

  const showETA = shipment.status !== 'Delivered'

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <ShipmentQRCode code={shipment.code} />

        {/* Tabs for user view */}
        {!isAdmin && (
          <div className="flex border-b border-gray-200 mt-4">
            <button
              className={`flex-1 p-3 font-semibold ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`flex-1 p-3 font-semibold ${activeTab === 'notify' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notify')}
            >
              Notify Me
            </button>
          </div>
        )}

        <div className="mt-6">
          {(!isAdmin && activeTab === 'details') || isAdmin ? (
            <>
              {/* Shipper & Receiver Info */}
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Shipper Information</h3>
                  <p className="text-gray-700">{fmt(shipment.shipper_name)}</p>
                  <p className="text-sm text-gray-500">{fmt(shipment.shipper_address)}</p>
                  <p className="text-sm text-gray-500 font-semibold">Phone: {fmt(shipment.shipper_phone)}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Receiver Information</h3>
                  <p className="text-gray-700">{fmt(shipment.receiver_name)}</p>
                  <p className="text-sm text-gray-500">{fmt(shipment.receiver_address)}</p>
                  <p className="text-sm text-gray-500 font-semibold">Phone: {fmt(shipment.receiver_phone)}</p>
                                    <p className="text-sm text-gray-500">{fmt(shipment.receiver_email)}</p>

                </div>
              </div>

              {/* Basic Shipment Info */}
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 mb-6">
                <div>
                  <div className="font-semibold">Origin</div>
                  <div>{fmt(shipment.location)}</div>
                </div>
                <div>
                  <div className="font-semibold">Carrier</div>
                  <div>{fmt(shipment.agency)}</div>
                </div>
                <div>
                  <div className="font-semibold">Estimated Hours</div>
                  <div>{shipment.estimated_hours ?? '—'} hrs</div>
                </div>
              </div>

              {/* Packages Table */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Packages</h4>
                <div className="w-full overflow-auto border rounded">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">Qty</th>
                        <th className="p-3 text-left">Piece Type</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Length (cm)</th>
                        <th className="p-3 text-left">Width (cm)</th>
                        <th className="p-3 text-left">Height (cm)</th>
                        <th className="p-3 text-left">Weight (kg)</th>
                      </tr>
                    </thead>

                    <tbody>
                      {shipment.products && Array.isArray(shipment.products) && shipment.products.length > 0 ? (
                        shipment.products.map((p, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{fmt(p.qty)}</td>
                            <td className="p-3">{fmt(p.piece_type)}</td>
                            <td className="p-3">{fmt(p.description)}</td>
                            <td className="p-3">{fmt(p.length_cm)}</td>
                            <td className="p-3">{fmt(p.width_cm)}</td>
                            <td className="p-3">{fmt(p.height_cm)}</td>
                            <td className="p-3">{fmt(p.weight_kg)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t">
                          <td className="p-3">{fmt(shipment.qty)}</td>
                          <td className="p-3">{fmt(shipment.piece_type)}</td>
                          <td className="p-3">{fmt(shipment.description)}</td>
                          <td className="p-3">{fmt(shipment.length_cm)}</td>
                          <td className="p-3">{fmt(shipment.width_cm)}</td>
                          <td className="p-3">{fmt(shipment.height_cm)}</td>
                          <td className="p-3">{fmt(shipment.weight_kg)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
{/* 🟢 NEW: Admin Comments Display */}
{shipment.admin_comment && (
    <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg">
        <h4 className="font-bold text-red-700 mb-1">Important Comment from Administration:</h4>
        <p className="text-sm text-red-600 whitespace-pre-line">{shipment.admin_comment}</p>
    </div>
)}
              {/* ETA / Progress / Map */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-96 border rounded overflow-hidden">
                  <MapLeaflet
                    lat={location.lat}
                    lng={location.lng}
                    originLat={shipment.current_lat}
                    originLng={shipment.current_lng}
                    destLat={shipment.dest_lat}
                    destLng={shipment.dest_lng}
                    status={shipment.status}
                  />
                </div>

                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" /> Estimated Travel Time
                    </p>
                    <p className="font-bold text-lg text-green-700">{eta.hours} Hours</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" /> Estimated Arrival
                    </p>
                    {showETA ? (
                      <p className="font-bold text-lg text-green-700">{eta.time}</p>
                    ) : (
                      <p className="font-bold text-lg text-green-700">Arrived at Final Port</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Progress</h4>
                    <div className="w-full bg-gray-100 rounded h-6 overflow-hidden">
                      <div
                        className={`h-6 rounded transition-all duration-500 ${progressBarClass}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{progressPct}%</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold">Shipment Status</h4>
                    <div
                      className={`mt-2 inline-block px-3 py-1 rounded text-white ${
                        shipment.status === 'Delivered'
                          ? 'bg-green-600'
                          : shipment.status === 'In Transit'
                          ? 'bg-blue-600'
                          : shipment.status === 'On Hold'
                          ? 'bg-yellow-500'
                          : shipment.status === 'Cancelled'
                          ? 'bg-red-600'
                          : 'bg-gray-600'
                      }`}
                    >
                      {displayStatus ?? 'On Hold'}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Last updated: {shipment.updated_at ? new Date(shipment.updated_at).toLocaleString() : '—'}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="mt-4 space-y-3">
                      <ShipmentAdminControls
                        code={shipment.code}
                        onUpdated={(updated) => {
                          setShipment((s) => ({ ...s, ...updated }))
                          if (updated.current_lat || updated.current_lng) setLocation({ lat: updated.current_lat, lng: updated.current_lng })
                        }}
                      />
                      <button onClick={() => setModalOpen(true)} className="bg-indigo-600 text-white px-3 py-1 rounded">
                        Open Full Edit
                      </button>
                      <ShipmentEdit code={shipment.code} open={modalOpen} onClose={() => setModalOpen(false)} onSaved={(u) => setShipment((s) => ({ ...s, ...u }))} />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div
                  className="w-full text-center py-3 text-white rounded"
                  style={{
                    background: shipment.status === 'Delivered' ? '#16a34a' : shipment.status === 'In Transit' ? '#2563eb' : shipment.status === 'On Hold' ? '#b45309' : shipment.status === 'Cancelled' ? '#dc2626' : '#6b7280',
                  }}
                >
                  SHIPMENT STATUS: {displayStatus?.toUpperCase() ?? 'ON HOLD'}
                </div>
              </div>
            </>
          ) : null}

          {/* Notify Me Form */}
          {!isAdmin && activeTab === 'notify' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2">Notify Me When Delivered</h3>
              <form onSubmit={handleNotifySubmit} className="flex flex-col md:flex-row gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="p-2 border rounded-md flex-1" required />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Notify Me
                </button>
              </form>
              {notifyMessage && <p className="mt-2 text-sm text-blue-700">{notifyMessage}</p>}
            </div>
          )}
        </div>
        {/* Add Shipment History Component */}
        <ShipmentHistory shipmentCode={shipment.code} />
      </div>
    </div>
  )
}
