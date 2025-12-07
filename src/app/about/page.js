"use client";

import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import { Package, Globe, Target, Users, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-purple-600" />
            <div className="flex items-center">
              <span className="text-3xl font-extrabold text-purple-600">ShipTrack</span>
              <span className="text-3xl font-extrabold text-orange-500">Global</span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-purple-600 font-medium transition"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Globe className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
          <p className="text-xl opacity-90">
            We revolutionize how people track and ship goods globally.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Target className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700">
              To bring transparency, speed, and peace of mind to the world of shipment tracking through smart technology.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <Users className="w-8 h-8 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            </div>
            <ul className="space-y-2 text-gray-700 ml-6">
              <li>→ Customer-first service</li>
              <li>→ Transparency & trust</li>
              <li>→ Fast & accurate shipment visibility</li>
              <li>→ Innovation through technology</li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-r from-purple-100 to-orange-100 p-8 rounded-2xl">
            <div className="flex items-center mb-3">
              <Rocket className="w-8 h-8 text-purple-700 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700">
              A world where shipping is stress-free, fully connected, and accessible for everyone.
            </p>
          </div>

        </div>
      </div>

      <ChatWidget />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} ShipTrack Global. All Rights Reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/policy" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
