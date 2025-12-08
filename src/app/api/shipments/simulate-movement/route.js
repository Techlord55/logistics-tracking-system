import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(req) {
  try {
    const { code } = await req.json()

    // Get the shipment
    const { data: shipment, error: fetchError } = await supabaseAdmin
      .from('shipments')
      .select('*')
      .eq('code', code)
      .single()

    if (fetchError || !shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Don't simulate if not in transit
    if (shipment.status !== 'In Transit') {
      return NextResponse.json({ 
        message: 'Shipment is not in transit',
        status: shipment.status,
        progress: shipment.progress 
      })
    }

    // ⏱️ Calculate time-based progress
    const createdAt = new Date(shipment.created_at)
    const now = new Date()
    const elapsedMs = now - createdAt
    const elapsedHours = elapsedMs / (1000 * 60 * 60)
    const estimatedHours = shipment.estimated_hours || 1
    
    // Progress = elapsed / estimated (capped at 1.0)
    let newProgress = Math.min(elapsedHours / estimatedHours, 1.0)

    // 📍 Calculate position based on progress
    const originLat = shipment.origin_lat
    const originLng = shipment.origin_lng
    const destLat = shipment.dest_lat
    const destLng = shipment.dest_lng

    if (!originLat || !originLng || !destLat || !destLng) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
    }

    // Linear interpolation between origin and destination
    const newLat = originLat + (destLat - originLat) * newProgress
    const newLng = originLng + (destLng - originLng) * newProgress

    // 💾 Prepare updates
    const updates = {
      current_lat: newLat,
      current_lng: newLng,
      progress: newProgress,
      updated_at: new Date().toISOString(),
    }

    // Mark as delivered when progress reaches 100%
    if (newProgress >= 1.0) {
      updates.status = 'Delivered'
      updates.current_lat = destLat
      updates.current_lng = destLng
      updates.progress = 1.0
    }

    // Update database
    const { error: updateError } = await supabaseAdmin
      .from('shipments')
      .update(updates)
      .eq('code', code)

    if (updateError) throw updateError

    console.log(`[Simulation] ${code}: ${(newProgress * 100).toFixed(1)}% (${elapsedHours.toFixed(2)}h / ${estimatedHours}h)`)

    return NextResponse.json({
      success: true,
      code: shipment.code,
      progress: newProgress,
      progressPercent: (newProgress * 100).toFixed(1) + '%',
      elapsedHours: elapsedHours.toFixed(2),
      estimatedHours,
      position: { lat: newLat, lng: newLng },
      status: updates.status || shipment.status,
    })
  } catch (err) {
    console.error('Simulate movement error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}