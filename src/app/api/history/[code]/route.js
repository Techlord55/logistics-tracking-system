import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; 

/**
 * GET /api/history/[code]
 * SIMULATES history by creating entries based on the main shipment record.
 * This route should be replaced by a dedicated history table query later.
 */
export async function GET(request, { params }) {
    try {
        // --- Access the dynamic route parameter ---
        const resolvedParams = await params;
        const code = resolvedParams.code ? resolvedParams.code.toUpperCase() : null;
        // ----------------------------------------

        if (!code) {
            return NextResponse.json({ error: 'Shipment code is required' }, { status: 400 });
        }

        // 1. Fetch the single, current shipment record
        const { data: shipment, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('code', code)
            .single();

        if (error || !shipment) {
            return NextResponse.json({ error: 'Tracking code not found' }, { status: 404 });
        }
        
        // 2. Simulate History Events
        // The logs are built in reverse chronological order (newest first)
        const history = [];

        // Log 1: Final/Current Status
        history.push({
            timestamp: shipment.updated_at,
            location: shipment.location || `${shipment.current_lat}, ${shipment.current_lng}`, // Use current location
            status: shipment.status,
            remarks: `Shipment status updated to **${shipment.status}**`,
        });

        // Log 2: In Transit / Progress Update (Simulated based on creation date)
        if (shipment.progress > 0 && shipment.progress < 1 && shipment.created_at !== shipment.updated_at) {
             // Use the halfway point between creation and update for a simulated "In Transit" log
             const createdTime = new Date(shipment.created_at).getTime();
             const updatedTime = new Date(shipment.updated_at).getTime();
             const midpointTime = new Date(createdTime + (updatedTime - createdTime) * 0.5).toISOString();
             
             history.push({
                timestamp: midpointTime,
                location: shipment.location || 'In Transit Location',
                status: 'In Transit',
                remarks: `Processing update. Progress: ${(shipment.progress * 100).toFixed(0)}%.`,
             });
        }
        
        // Log 3: Initial Creation/Booking
        history.push({
            timestamp: shipment.created_at,
            location: shipment.location || `${shipment.dest_lat}, ${shipment.dest_lng} (Origin)`,
            status: 'Booked / Pending',
            remarks: `Shipment created and booked on ${new Date(shipment.created_at).toLocaleDateString()}.`,
        });

        // 3. Return the simulated history array
        return NextResponse.json({ history });

    } catch (err) {
        console.error('API History error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}