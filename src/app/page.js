"use client";

import { useState } from "react";
import ReviewsCarousel from "@/components/ReviewsCarousel";

// Simple nav link
const NavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="block md:inline-block text-gray-600 hover:text-blue-700 transition duration-150 py-2 md:py-0"
  >
    {children}
  </a>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
      <header className="shadow-md bg-white border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold text-purple-600">ShipTrack</span>
            <span className="text-3xl font-extrabold text-orange-500">Global</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6 text-lg font-medium">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/track">Track</NavLink>
            <NavLink href="/support">Support</NavLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-purple-50 border-t border-blue-100 px-4 py-4 flex flex-col space-y-2">
            <NavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink href="/track" onClick={() => setMobileMenuOpen(false)}>Track</NavLink>
            <NavLink href="/support" onClick={() => setMobileMenuOpen(false)}>Support</NavLink>
          </div>
        )}
      </header>

      {/* Hero section */}
      <main className="flex-grow">
        <div className="relative py-16 md:py-32 bg-gradient-to-b from-purple-100 to-purple-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Simple. Reliable. Global.
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Track your shipments across the globe in real-time. Click below to start your tracking process.
            </p>
            <div className="max-w-xs md:max-w-xl mx-auto">
              <a
                href="/track"
                className="block md:inline-block w-full md:w-auto px-8 md:px-12 py-4 bg-orange-500 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 uppercase tracking-widest"
              >
                Start Tracking Now
              </a>
            </div>
          </div>
        </div>

        {/* Reviews carousel */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ReviewsCarousel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} ShipTrack Global. All Rights Reserved.</p>
            <nav className="flex space-x-6">
              <a href="/policy" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition">Terms of Use</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
