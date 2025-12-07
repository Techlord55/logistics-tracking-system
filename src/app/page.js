"use client";

import { useState } from "react";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { Truck, Package, Globe, Clock, Shield, Headphones } from "lucide-react";

// Navigation Link Component
const NavLink = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block md:inline-block text-gray-700 hover:text-purple-600 transition duration-200 py-2 md:py-0 font-medium"
  >
    {children}
  </Link>
);

// Dropdown Menu Component
const DropdownMenu = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition duration-200 font-medium">
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="block px-4 py-3 hover:bg-purple-50 transition duration-150"
            >
              <div className="font-semibold text-gray-800">{item.title}</div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const servicesItems = [
    {
      title: "Express Shipping",
      description: "Fast delivery for urgent shipments",
      href: "/services/express",
    },
    {
      title: "Freight Services",
      description: "Large volume shipping solutions",
      href: "/services/freight",
    },
    {
      title: "International Shipping",
      description: "Global delivery network",
      href: "/services/international",
    },
    {
      title: "Supply Chain Solutions",
      description: "End-to-end logistics management",
      href: "/services/supply-chain",
    },
  ];

  const features = [
    {
      icon: <Truck className="w-12 h-12 text-purple-600" />,
      title: "Fast Delivery",
      description: "Express shipping options with real-time tracking across the globe",
    },
    {
      icon: <Globe className="w-12 h-12 text-orange-500" />,
      title: "Global Network",
      description: "Worldwide coverage with reliable delivery to over 220 countries",
    },
    {
      icon: <Shield className="w-12 h-12 text-purple-600" />,
      title: "Secure Shipping",
      description: "Insurance coverage and secure handling for all your shipments",
    },
    {
      icon: <Clock className="w-12 h-12 text-orange-500" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service to assist you anytime",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-base">
            <DropdownMenu title="Services" items={servicesItems} />
            <NavLink href="/track">Tracking</NavLink>
            <NavLink href="/support">Support</NavLink>
            <NavLink href="/about">About Us</NavLink>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <div className="font-semibold text-gray-900 mb-2">Services</div>
            {servicesItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="block pl-4 py-2 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <NavLink href="/track" onClick={() => setMobileMenuOpen(false)}>Tracking</NavLink>
            <NavLink href="/support" onClick={() => setMobileMenuOpen(false)}>Support</NavLink>
            <NavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative py-20 md:py-32 bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Ship Smarter.<br />Track Faster.
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-95">
              Experience seamless global logistics with real-time tracking, reliable delivery, and 24/7 support.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link
                href="/track"
                className="px-10 py-4 bg-white text-purple-600 text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition duration-300 transform"
              >
                Track Shipment
              </Link>
              <Link
                href="/services/express"
                className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-purple-600 transition duration-300"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
              Why Choose ShipTrack Global?
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              We provide comprehensive shipping solutions tailored to your needs with cutting-edge technology.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Banner Section */}
        <div className="relative h-96 bg-gradient-to-r from-purple-900 to-orange-600">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Trusted by 10,000+ Businesses Worldwide
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Join the companies that rely on us for their shipping needs
              </p>
              <Link
                href="/about"
                className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:shadow-xl transition duration-300"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Real feedback from real customers
            </p>
            <ReviewsCarousel />
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-purple-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Ship?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get started today and experience hassle-free shipping
            </p>
            <Link
              href="/track"
              className="inline-block px-10 py-4 bg-white text-purple-600 text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition duration-300 transform"
            >
              Start Tracking Now
            </Link>
          </div>
        </div>
      </main>

      <ChatWidget />

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center mb-4">
                <Package className="w-8 h-8 text-purple-400 mr-2" />
                <div>
                  <span className="text-2xl font-bold text-purple-400">ShipTrack</span>
                  <span className="text-2xl font-bold text-orange-400">Global</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for global shipping and logistics solutions.
              </p>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/services/express" className="hover:text-white transition">Express Shipping</Link></li>
                <li><Link href="/services/freight" className="hover:text-white transition">Freight Services</Link></li>
                <li><Link href="/services/international" className="hover:text-white transition">International</Link></li>
                <li><Link href="/services/supply-chain" className="hover:text-white transition">Supply Chain</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/track" className="hover:text-white transition">Track Shipment</Link></li>
                <li><Link href="/support" className="hover:text-white transition">Contact Support</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/policy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span>+1 929 782 9204</span>
                </li>
                <li>support@shiptrackglobal.com</li>
                <li className="pt-4">
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                      <span className="text-sm">f</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                      <span className="text-sm">𝕏</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                      <span className="text-sm">in</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ShipTrack Global. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-white transition">Terms of Service</Link>
              <Link href="/policy" className="text-gray-500 hover:text-white transition">Privacy Policy</Link>
              <Link href="/support" className="text-gray-500 hover:text-white transition">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}