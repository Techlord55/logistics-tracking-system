"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import AdminForm from "@/components/AdminForm";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import ChatWidget from "@/components/ChatWidget";



export default function AdminDashboard() {
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // Toast state
const [commentInputs, setCommentInputs] = useState({});
const [feedbacks, setFeedbacks] = useState([]);
const [feedbacksVisible, setFeedbacksVisible] = useState(false);
const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);


  const shipmentTypes = ["Truckload", "Less than Truckload"];
  const shipmentModes = ["Land Shipping", "Air Shipping", "Sea Shipping"];
  const paymentModes = ["CASH", "Credit Card", "Bank Transfer"];
  const statusOptions = ["On Hold", "In Transit", "Delivered", "Cancelled"];

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shipments");
      const data = await res.json();
      const safeData = data.map((s) => ({
        ...s,
        products: Array.isArray(s.products) ? s.products : [],
      }));
      setShipments(safeData);
    } catch (err) {
      console.error("Error loading shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000); // disappear after 4s
  };
  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const res = await fetch("/api/feedbacks");
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data || []); // fallback to empty array
      } else {
        setFeedbacks([]);
        console.error("Error fetching feedbacks:", data.error);
      }
    } catch (err) {
      console.error(err);
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };


 const updateShipmentField = async (code, field, value) => {
  try {
    const payload = { [field]: value };

    // ✅ Send PATCH request to the correct endpoint for admin comments
    const endpoint = field === "admin_comment" ? `/api/tracking/${code}` : `/api/shipments/${code}`;

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();

    if (!res.ok) throw new Error(updated.error || "Update failed");

    // Show toast if admin_comment was updated
    if (field === "admin_comment") {
      showToast(`Admin comment for ${code} updated and email sent!`);
    }

    // Refresh shipments after update
    loadShipments();
  } catch (err) {
    console.error("Failed to update shipment:", err);
  }
};


  const handleProductChange = async (shipmentCode, index, field, value) => {
    const shipment = shipments.find((s) => s.code === shipmentCode);
    if (!shipment) return;
    const updatedProducts = [...shipment.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    await updateShipmentField(shipmentCode, "products", updatedProducts);
  };

  const addProduct = async (shipmentCode) => {
    const shipment = shipments.find((s) => s.code === shipmentCode);
    if (!shipment) return;
    const updatedProducts = [
      ...shipment.products,
      { piece_type: "", description: "", qty: 1, length_cm: 0, width_cm: 0, height_cm: 0, weight_kg: 0 },
    ];
    await updateShipmentField(shipmentCode, "products", updatedProducts);
  };

  const removeProduct = async (shipmentCode, index) => {
    const shipment = shipments.find((s) => s.code === shipmentCode);
    if (!shipment) return;
    const updatedProducts = shipment.products.filter((_, i) => i !== index);
    await updateShipmentField(shipmentCode, "products", updatedProducts);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-8 relative">
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
            {toast}
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
<div className="mb-6">
  <button
    onClick={() => {
      setFeedbacksVisible(!feedbacksVisible);
      if (!feedbacksVisible) loadFeedbacks(); // load only when opening
    }}
    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
  >
    {feedbacksVisible ? "Hide Feedbacks" : "View All Feedbacks"}
  </button>
</div>

{feedbacksVisible && (
  <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
    <h2 className="text-2xl font-bold mb-4">Feedbacks</h2>
    {feedbacks.length === 0 ? (
      <p className="text-gray-500">No feedbacks yet.</p>
    ) : (
      <div className="space-y-4">
        {feedbacks.map((f) => (
          <div key={f.id} className="border p-4 rounded-lg">
            <p className="font-semibold">{f.name} ({f.email})</p>
            <p className="text-gray-700 mt-1">{f.message}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(f.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

          {/* Create Shipment Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Create Shipment</h2>
            <AdminForm onSuccess={loadShipments} />
          </div>

          {/* Active Shipments */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Active Shipments</h2>
            {loading ? (
              <p>Loading shipments...</p>
            ) : shipments.length === 0 ? (
              <p className="text-gray-500">No shipments yet.</p>
            ) : (
              <div className="space-y-6">
                {shipments.map((shipment) => (
                  <div key={shipment.code} className="border p-4 rounded-lg space-y-3">
                    <p className="font-bold text-lg">{shipment.name}</p>
                    <p className="text-sm text-gray-600">Code: {shipment.code}</p>
                    <p className="text-sm text-gray-600">Agency: {shipment.agency}</p>

                    {/* Editable dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label>
                        Type of Shipment:
                        <select
                          className="input mt-1"
                          value={shipment.shipment_type || "Truckload"}
                          onChange={(e) =>
                            updateShipmentField(shipment.code, "shipment_type", e.target.value)
                          }
                        >
                          {shipmentTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Shipment Mode:
                        <select
                          className="input mt-1"
                          value={shipment.shipment_mode || "Land Shipping"}
                          onChange={(e) =>
                            updateShipmentField(shipment.code, "shipment_mode", e.target.value)
                          }
                        >
                          {shipmentModes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Payment Mode:
                        <select
                          className="input mt-1"
                          value={shipment.payment_mode || "CASH"}
                          onChange={(e) =>
                            updateShipmentField(shipment.code, "payment_mode", e.target.value)
                          }
                        >
                          {paymentModes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Status:
                        <select
                          className="input mt-1"
                          value={shipment.status || "On Hold"}
                          onChange={(e) =>
                            updateShipmentField(shipment.code, "status", e.target.value)
                          }
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Carrier Reference No:
                        <input
                          className="input mt-1"
                          value={shipment.carrier_ref || ""}
                          placeholder="LOG..."
                          onChange={(e) =>
                            updateShipmentField(shipment.code, "carrier_ref", e.target.value)
                          }
                        />
                      </label>

                     {/* Admin Comment */}
<label>
  Admin Comment:
  <textarea
    className="input mt-1 w-full"
    placeholder="Enter admin note..."
    value={commentInputs[shipment.code] ?? shipment.admin_comment ?? ""}
    onChange={(e) =>
      setCommentInputs({
        ...commentInputs,
        [shipment.code]: e.target.value,
      })
    }
  />
</label>
<button
  className="bg-green-500 text-white px-3 py-1 rounded mt-1"
  onClick={() => {
    const comment = commentInputs[shipment.code]?.trim();
    if (!comment) return;
    updateShipmentField(shipment.code, "admin_comment", comment);
  }}
>
  Save Comment
</button>

</div>

                    {/* Products Table */}
                    <div className="mt-2 border-t pt-2 space-y-2">
                      <h4 className="font-semibold">Products</h4>
                      {(shipment.products || []).map((p, idx) => (
                        <div key={idx} className="grid grid-cols-7 gap-2 items-center">
                          <input
                            className="input"
                            placeholder="Piece Type"
                            value={p.piece_type || ""}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "piece_type", e.target.value)
                            }
                          />
                          <input
                            className="input"
                            placeholder="Description"
                            value={p.description || ""}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "description", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            className="input"
                            placeholder="Qty"
                            value={p.qty || 1}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "qty", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            className="input"
                            placeholder="Length (cm)"
                            value={p.length_cm || 0}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "length_cm", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            className="input"
                            placeholder="Width (cm)"
                            value={p.width_cm || 0}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "width_cm", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            className="input"
                            placeholder="Height (cm)"
                            value={p.height_cm || 0}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "height_cm", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            className="input"
                            placeholder="Weight (kg)"
                            value={p.weight_kg || 0}
                            onChange={(e) =>
                              handleProductChange(shipment.code, idx, "weight_kg", e.target.value)
                            }
                          />
                          <button
                            className="text-red-600"
                            onClick={() => removeProduct(shipment.code, idx)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addProduct(shipment.code)}
                        className="text-blue-600 font-medium mt-2"
                      >
                        + Add Product
                      </button>
                    </div>

                    {/* Current Location */}
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        step="0.000001"
                        id={`lat-${shipment.code}`}
                        className="border rounded px-3 py-2 flex-1"
                        placeholder="Lat"
                      />
                      <input
                        type="number"
                        step="0.000001"
                        id={`lng-${shipment.code}`}
                        className="border rounded px-3 py-2 flex-1"
                        placeholder="Lng"
                      />
                      <button
                        onClick={() => {
                          const lat = parseFloat(document.getElementById(`lat-${shipment.code}`).value);
                          const lng = parseFloat(document.getElementById(`lng-${shipment.code}`).value);
                          if (!isNaN(lat) && !isNaN(lng)) {
                            updateShipmentField(shipment.code, "current_lat", lat);
                            updateShipmentField(shipment.code, "current_lng", lng);
                          } else {
                            alert("Enter valid coordinates");
                          }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Update Location
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
<ChatWidget isAdmin={true} />
    </AuthGuard>
  );
}
