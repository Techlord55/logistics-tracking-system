"use client";

import { useState } from "react";
import { cities } from "@/lib/cities";

export default function AdminForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    agency: "",
    originCity: "",
    destCity: "",
    estimated_hours: "",
    shipper_name: "",
    shipper_phone: "",
    shipper_address: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_email: "",
    receiver_address: "",
    shipment_type: "Truckload",
    shipment_mode: "Land Shipping",
    carrier_ref: generateCarrierRef(),
    payment_mode: "CASH",
    admin_comment: "",
  });

  const [products, setProducts] = useState([
    { piece_type: "", description: "", qty: 1, length_cm: 0, width_cm: 0, height_cm: 0, weight_kg: 0 },
  ]);

  function generateCarrierRef() {
    return "LOG" + Math.floor(100000000000 + Math.random() * 900000000000);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { piece_type: "", description: "", qty: 1, length_cm: 0, width_cm: 0, height_cm: 0, weight_kg: 0 },
    ]);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const getCityCoords = (city) => {
    const selected = cities.find((c) => c.name === city);
    return selected ? { lat: selected.lat, lng: selected.lng } : { lat: null, lng: null };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const origin = getCityCoords(form.originCity);
    const dest = getCityCoords(form.destCity);

    const payload = {
      ...form,
      products,
      origin_lat: origin.lat,
      origin_lng: origin.lng,
      dest_lat: dest.lat,
      dest_lng: dest.lng,
    };

    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to create shipment");
      return;
    }

    // Reset form
    setForm({
      name: "",
      agency: "",
      originCity: "",
      destCity: "",
      estimated_hours: "",
      shipper_name: "",
      shipper_phone: "",
      shipper_address: "",
      receiver_name: "",
      receiver_phone: "",
      receiver_email: "",
      receiver_address: "",
      shipment_type: "Truckload",
      shipment_mode: "Land Shipping",
      carrier_ref: generateCarrierRef(),
      payment_mode: "CASH",
       admin_comment: "",
    });
    setProducts([{ piece_type: "", description: "", qty: 1, length_cm: 0, width_cm: 0, height_cm: 0, weight_kg: 0 }]);

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Shipment Details */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Shipment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" name="name" placeholder="Shipment Name" value={form.name} onChange={handleChange} required />
          <input className="input" name="agency" placeholder="Agency" value={form.agency} onChange={handleChange} required />
          <select className="input" name="originCity" value={form.originCity} onChange={handleChange} required>
            <option value="">Select Origin City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
            ))}
          </select>
          <select className="input" name="destCity" value={form.destCity} onChange={handleChange} required>
            <option value="">Select Destination City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
            ))}
          </select>
          <input type="number" className="input" name="estimated_hours" placeholder="Estimated Hours" value={form.estimated_hours} onChange={handleChange} required />
          <select className="input" name="shipment_type" value={form.shipment_type} onChange={handleChange} required>
            <option>Truckload</option>
            <option>Less than Truckload (LTL)</option>
            <option>Air Freight</option>
            <option>Ocean Freight</option>
          </select>
          <select className="input" name="shipment_mode" value={form.shipment_mode} onChange={handleChange} required>
            <option>Land Shipping</option>
            <option>Air Shipping</option>
            <option>Sea Shipping</option>
          </select>
          <input className="input bg-gray-100" name="carrier_ref" value={form.carrier_ref} readOnly />
          <select className="input" name="payment_mode" value={form.payment_mode} onChange={handleChange} required>
            <option>CASH</option>
            <option>CREDIT</option>
            <option>DEBIT</option>
            <option>ONLINE</option>
          </select>
        </div>
      </div>

      {/* Shipper Info */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Shipper Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" name="shipper_name" placeholder="Shipper Name" value={form.shipper_name} onChange={handleChange} required />
          <input className="input" name="shipper_phone" placeholder="Shipper Phone" value={form.shipper_phone} onChange={handleChange} required />
          <textarea className="input col-span-2" name="shipper_address" placeholder="Shipper Address" value={form.shipper_address} onChange={handleChange} required />
        </div>
      </div>

      {/* Receiver Info */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Receiver Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" name="receiver_name" placeholder="Receiver Name" value={form.receiver_name} onChange={handleChange} required />
          <input className="input" name="receiver_phone" placeholder="Receiver Phone" value={form.receiver_phone} onChange={handleChange} required />
          <input type="email" className="input" name="receiver_email" placeholder="Receiver Email" value={form.receiver_email} onChange={handleChange} required /> {/* <--- 🔑 ADDED: Input Field */}
          <div className="col-span-1 hidden md:block"></div> {/* Spacer for grid alignment */}
          <textarea className="input col-span-2" name="receiver_address" placeholder="Receiver Address" value={form.receiver_address} onChange={handleChange} required />
        </div>
      </div>

      {/* Products */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Products</h3>
          <button type="button" onClick={addProduct} className="text-blue-600 font-medium">+ Add Product</button>
        </div>

        {products.map((p, idx) => (
          <div key={idx} className="grid grid-cols-8 gap-4 mt-3">
            <input className="input" placeholder="Piece Type" value={p.piece_type} onChange={(e) => handleProductChange(idx, "piece_type", e.target.value)} required />
            <input className="input" placeholder="Description" value={p.description} onChange={(e) => handleProductChange(idx, "description", e.target.value)} required />
            <input type="number" className="input" placeholder="Qty" value={p.qty} onChange={(e) => handleProductChange(idx, "qty", e.target.value)} required />
            <input type="number" className="input" placeholder="Length (cm)" value={p.length_cm} onChange={(e) => handleProductChange(idx, "length_cm", e.target.value)} required />
            <input type="number" className="input" placeholder="Width (cm)" value={p.width_cm} onChange={(e) => handleProductChange(idx, "width_cm", e.target.value)} required />
            <input type="number" className="input" placeholder="Height (cm)" value={p.height_cm} onChange={(e) => handleProductChange(idx, "height_cm", e.target.value)} required />
            <input type="number" className="input" placeholder="Weight (kg)" value={p.weight_kg} onChange={(e) => handleProductChange(idx, "weight_kg", e.target.value)} required />
            {products.length > 1 && <button type="button" onClick={() => removeProduct(idx)} className="text-red-600">Remove</button>}
          </div>
        ))}
      </div>
{/* Admin Comment (Optional on Creation) */}
<div>
  <h3 className="text-xl font-semibold mb-2">Admin Notes (Optional)</h3>
  <textarea
    className="input w-full" 
    name="admin_comment" 
    placeholder="Internal notes or special instructions for the shipment..." 
    value={form.admin_comment} 
    onChange={handleChange} 
    rows="3"
  />
</div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">Create Shipment</button>
    </form>
  );
}
