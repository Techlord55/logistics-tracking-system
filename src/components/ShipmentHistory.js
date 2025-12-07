// src/components/ShipmentHistory.js
'use client'
import { useState, useEffect } from 'react';

export default function ShipmentHistory({ shipmentCode }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shipmentCode) return;

        async function fetchHistory() {
            try {
                // You must create a new API route for history, e.g., /api/history/[code]
                const res = await fetch(`/api/history/${shipmentCode}`); 
                const data = await res.json();

                if (!res.ok || data.error) {
                    throw new Error(data.error || 'Failed to fetch history');
                }

                // Assuming the data is an array of history objects
                setHistory(data.history || []);
            } catch (err) {
                console.error('History fetch error:', err);
                setError('Could not load history.');
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [shipmentCode]);

    if (loading) return <p className="text-center p-4">Loading history...</p>;
    if (error) return <p className="text-center p-4 text-red-500">{error}</p>;
    if (history.length === 0) return <p className="text-center p-4 text-gray-500">No history available for this shipment.</p>;

    return (
        <div className="mt-8">
            <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Shipment History</h3>
            <div className="w-full overflow-auto border rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-green-600 text-white sticky top-0">
                        <tr>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="p-3">{new Date(item.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                <td className="p-3">{item.location || '—'}</td>
                                <td className="p-3 font-semibold">{item.status}</td>
                                <td className="p-3">{item.remarks || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}