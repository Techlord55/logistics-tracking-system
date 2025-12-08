// src/app/api/shipments/route.js
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const data = await req.json()

    const code = 'SHP' + Math.random().toString(36).substring(2, 8).toUpperCase()

    // Ensure products is always an array with proper default fields
    const products = Array.isArray(data.products)
      ? data.products.map((p) => ({
          piece_type: p.piece_type || '',
          description: p.description || '',
          qty: p.qty ?? 1,
          length_cm: p.length_cm ?? 0,
          width_cm: p.width_cm ?? 0,
          height_cm: p.height_cm ?? 0,
          weight_kg: p.weight_kg ?? 0,
        }))
      : []

    // ✅ CRITICAL FIX: Save BOTH origin and current coordinates
    const payload = {
      code,
      name: data.name || '',
      agency: data.agency || '',
      
      // Products/Package details are now stored in the JSONB 'products' column
      products, 

      // Shipper/Receiver
      shipper_name: data.shipper_name || '',
      shipper_address: data.shipper_address || '',
      shipper_phone: data.shipper_phone || null,
      receiver_name: data.receiver_name || '',
      receiver_address: data.receiver_address || '',
      receiver_phone: data.receiver_phone || null,
      receiver_email: data.receiver_email || null,
      
      // ✅ ORIGIN COORDINATES (Starting point - never changes)
      origin_lat: data.origin_lat ? parseFloat(data.origin_lat) : null,
      origin_lng: data.origin_lng ? parseFloat(data.origin_lng) : null,
      
      // ✅ CURRENT COORDINATES (Starts at origin, updates as ship moves)
      current_lat: data.current_lat ? parseFloat(data.current_lat) : null,
      current_lng: data.current_lng ? parseFloat(data.current_lng) : null,
      
      // ✅ DESTINATION COORDINATES
      dest_lat: data.dest_lat ? parseFloat(data.dest_lat) : null,
      dest_lng: data.dest_lng ? parseFloat(data.dest_lng) : null,
      
      // Time/Status
      estimated_hours: data.estimated_hours ? parseInt(data.estimated_hours, 10) : null,
      progress: 0,
      status: data.status || 'In Transit',
      
      // Transaction Details
      shipment_type: data.shipment_type || 'Truckload',
      shipment_mode: data.shipment_mode || 'Land Shipping',
      payment_mode: data.payment_mode || 'CASH',
      carrier_ref: data.carrier_ref || `LOG${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      location: data.location || '',

      // Admin notes
      admin_comment: data.admin_comment || null,
      
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('Creating shipment with payload:', {
      code: payload.code,
      origin: { lat: payload.origin_lat, lng: payload.origin_lng },
      current: { lat: payload.current_lat, lng: payload.current_lng },
      dest: { lat: payload.dest_lat, lng: payload.dest_lng },
    })

    const { error } = await supabaseAdmin.from('shipments').insert([payload])
    
    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    return NextResponse.json({ 
      code, 
      message: 'Shipment created successfully',
      coordinates: {
        origin: { lat: payload.origin_lat, lng: payload.origin_lng },
        current: { lat: payload.current_lat, lng: payload.current_lng },
        destination: { lat: payload.dest_lat, lng: payload.dest_lng },
      }
    })
  } catch (err) {
    console.error('Create shipment error:', err)
    return NextResponse.json({ 
      error: 'Failed to create shipment',
      details: err.message 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Fetch shipments error:', err)
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 })
  }
}