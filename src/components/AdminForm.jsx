"use client";

import { useState } from "react";
import { cities } from "@/lib/cities";
import { 
  Package, 
  User, 
  MapPin, 
  Clock, 
  CreditCard,
  Plus,
  X,
  Truck
} from "lucide-react";

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
    status: "In Transit",
    location:""
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
      current_lat: origin.lat,
      current_lng: origin.lng,
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
      status: "In Transit",
    });
    setProducts([{ piece_type: "", description: "", qty: 1, length_cm: 0, width_cm: 0, height_cm: 0, weight_kg: 0 }]);

    onSuccess?.();
  };

  const statusColors = {
    "On Hold": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "In Transit": "bg-blue-100 text-blue-700 border-blue-300",
    "Delivered": "bg-green-100 text-green-700 border-green-300",
    "Cancelled": "bg-red-100 text-red-700 border-red-300",
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Shipment Details Section */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Shipment Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Shipment Name *</label>
            <input 
              className={inputClass} 
              name="name" 
              placeholder="e.g., Electronics Batch #123" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className={labelClass}>Agency *</label>
            <input 
              className={inputClass} 
              name="agency" 
              placeholder="e.g., FedEx, DHL, UPS" 
              value={form.agency} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className={labelClass}>
              <MapPin className="w-4 h-4 inline mr-1" />
              Origin City *
            </label>
            <select className={inputClass} name="originCity" value={form.originCity} onChange={handleChange} required>
              <option value="">Select Origin City</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              <MapPin className="w-4 h-4 inline mr-1" />
              Destination City *
            </label>
            <select className={inputClass} name="destCity" value={form.destCity} onChange={handleChange} required>
              <option value="">Select Destination City</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              <Clock className="w-4 h-4 inline mr-1" />
              Estimated Hours *
            </label>
            <input 
              type="number" 
              className={inputClass} 
              name="estimated_hours" 
              placeholder="e.g., 48" 
              value={form.estimated_hours} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className={labelClass}>Shipment Type *</label>
            <select className={inputClass} name="shipment_type" value={form.shipment_type} onChange={handleChange} required>
              <option>Truckload</option>
              <option>Less than Truckload (LTL)</option>
              <option>Air Freight</option>
              <option>Ocean Freight</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              <Truck className="w-4 h-4 inline mr-1" />
              Shipment Mode *
            </label>
            <select className={inputClass} name="shipment_mode" value={form.shipment_mode} onChange={handleChange} required>
              <option>Land Shipping</option>
              <option>Air Shipping</option>
              <option>Sea Shipping</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              <CreditCard className="w-4 h-4 inline mr-1" />
              Payment Mode *
            </label>
            <select className={inputClass} name="payment_mode" value={form.payment_mode} onChange={handleChange} required>
              <option>CASH</option>
              <option>CREDIT</option>
              <option>DEBIT</option>
              <option>ONLINE</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Carrier Reference No.</label>
            <input 
              className={`${inputClass} bg-gray-100`} 
              name="carrier_ref" 
              value={form.carrier_ref} 
              readOnly 
            />
          </div>

          <div>
            <label className={labelClass}>Initial Status *</label>
            <div className="flex gap-3 items-center">
              <select 
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500`} 
                name="status" 
                value={form.status} 
                onChange={handleChange} 
                required
              >
                <option value="On Hold">On Hold</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${statusColors[form.status]}`}>
                {form.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipper Information */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 p-2 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Shipper Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Shipper Name *</label>
            <input 
              className={inputClass} 
              name="shipper_name" 
              placeholder="Full name" 
              value={form.shipper_name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className={labelClass}>Shipper Phone *</label>
            <input 
              className={inputClass} 
              name="shipper_phone" 
              placeholder="+1 234 567 8900" 
              value={form.shipper_phone} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Shipper Address *</label>
            <textarea 
              className={inputClass} 
              name="shipper_address" 
              placeholder="Full address with city, state, zip" 
              value={form.shipper_address} 
              onChange={handleChange} 
              required 
              rows="2"
            />
          </div>
        </div>
      </div>

      {/* Receiver Information */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500 p-2 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Receiver Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Receiver Name *</label>
            <input 
              className={inputClass} 
              name="receiver_name" 
              placeholder="Full name" 
              value={form.receiver_name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className={labelClass}>Receiver Phone *</label>
            <input 
              className={inputClass} 
              name="receiver_phone" 
              placeholder="+1 234 567 8900" 
              value={form.receiver_phone} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Receiver Email *</label>
            <input 
              type="email" 
              className={inputClass} 
              name="receiver_email" 
              placeholder="email@example.com" 
              value={form.receiver_email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Receiver Address *</label>
            <textarea 
              className={inputClass} 
              name="receiver_address" 
              placeholder="Full address with city, state, zip" 
              value={form.receiver_address} 
              onChange={handleChange} 
              required 
              rows="2"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Products</h3>
          </div>
          <button 
            type="button" 
            onClick={addProduct} 
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        <div className="space-y-4">
          {products.map((p, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border-2 border-green-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">Product #{idx + 1}</span>
                {products.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeProduct(idx)} 
                    className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Piece Type *</label>
                  <input 
                    className={inputClass} 
                    placeholder="Box, Pallet, etc." 
                    value={p.piece_type} 
                    onChange={(e) => handleProductChange(idx, "piece_type", e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                  <input 
                    className={inputClass} 
                    placeholder="Product details" 
                    value={p.description} 
                    onChange={(e) => handleProductChange(idx, "description", e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity *</label>
                  <input 
                    type="number" 
                    className={inputClass} 
                    placeholder="Qty" 
                    value={p.qty} 
                    onChange={(e) => handleProductChange(idx, "qty", e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (kg) *</label>
                  <input 
                    type="number" 
                    className={inputClass} 
                    placeholder="kg" 
                    value={p.weight_kg} 
                    onChange={(e) => handleProductChange(idx, "weight_kg", e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Length (cm) *</label>
                  <input 
                    type="number" 
                    className={inputClass} 
                    placeholder="cm" 
                    value={p.length_cm} 
                    onChange={(e) => handleProductChange(idx, "length_cm", e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Width (cm) *</label>
                  <input 
                    type="number" 
                    className={inputClass} 
                    placeholder="cm" 
                    value={p.width_cm} 
                    onChange={(e) => handleProductChange(idx, "width_cm", e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Height (cm) *</label>
                  <input 
                    type="number" 
                    className={inputClass} 
                    placeholder="cm" 
                    value={p.height_cm} 
                    onChange={(e) => handleProductChange(idx, "height_cm", e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Notes (Optional)</h3>
        <textarea 
          className={inputClass} 
          name="admin_comment" 
          placeholder="Internal notes, special instructions, etc..." 
          value={form.admin_comment} 
          onChange={handleChange} 
          rows="3"
        />
        <p className="text-sm text-gray-500 mt-2">These notes are for internal use and won't be sent to customers initially.</p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 font-bold text-lg flex items-center gap-2"
        >
          <Package className="w-5 h-5" />
          Create Shipment
        </button>
      </div>
    </form>
  );
}