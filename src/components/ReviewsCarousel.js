"use client";

import { useEffect, useState, useRef } from "react";

// 15 example reviews
const reviews = [
  { name: "Alice Johnson", role: "Logistics Manager", image: "/reviews/alice.jpg", text: "ShipTrack Global is seamless and incredibly fast." },
  { name: "Michael Smith", role: "E-commerce Owner", image: "/reviews/michael.jpg", text: "Reliable and accurate tracking." },
  { name: "Sophie Lee", role: "Supply Chain Coordinator", image: "/reviews/sophie.jpg", text: "User-friendly interface and excellent support." },
  { name: "John Brayam", role: "Warehouse Manager", image: "/reviews/john.jpg", text: "Helps keep our inventory organized." },
  { name: "Emma Davis", role: "Operations Lead", image: "/reviews/emma.jpg", text: "Easy to use and fast updates." },
  { name: "Liam Brown", role: "Delivery Supervisor", image: "/reviews/liam.jpg", text: "Accurate real-time location tracking." },
  { name: "Olivia Taylor", role: "Shipping Coordinator", image: "/reviews/olivia.jpg", text: "Fantastic customer support team." },
  { name: "Noah Wilson", role: "Fleet Manager", image: "/reviews/noah.jpg", text: "Makes fleet management effortless." },
  { name: "Ava Martinez", role: "Logistics Analyst", image: "/reviews/ava.jpg", text: "Insights and reports are very useful." },
  { name: "Ethan Anderson", role: "Supply Chain Manager", image: "/reviews/ethan.jpg", text: "Highly recommend ShipTrack Global." },
  { name: "Isabella Thomas", role: "Warehouse Coordinator", image: "/reviews/isabella.jpg", text: "Reduces errors in shipment handling." },
  { name: "Mason Jackson", role: "Operations Executive", image: "/reviews/mason.jpg", text: "The dashboard is clean and fast." },
  { name: "Mia White", role: "Customer Support Manager", image: "/reviews/mia.jpg", text: "Customers love the real-time updates." },
  { name: "Lucas Harris", role: "Logistics Analyst", image: "/reviews/lucas.jpg", text: "Tracking multiple shipments is easy." },
  { name: "Charlotte Clark", role: "Inventory Manager", image: "/reviews/charlotte.jpg", text: "Makes managing shipments stress-free." },
];

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll container when currentIndex changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = container.firstChild.offsetWidth + 16; // 16px gap
    const scrollX = cardWidth * currentIndex;

    container.scrollTo({
      left: scrollX,
      behavior: "smooth",
    });
  }, [currentIndex]);

  // Determine visible cards for desktop
  const visibleCards = 3;

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div
        className="flex overflow-x-hidden gap-4 scroll-smooth"
        ref={containerRef}
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            className="min-w-full md:min-w-[calc(33.333%-1rem)] bg-white p-6 rounded-xl shadow-lg flex flex-col items-center md:items-start gap-4 transition-transform duration-500"
          >
            <img
              src={review.image}
              alt={review.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
            />
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl text-gray-800 font-semibold">{review.name}</h3>
              <p className="text-gray-500 text-sm md:text-base">{review.role}</p>
              <p className="text-gray-700 text-sm md:text-lg mt-2 md:mt-4">"{review.text}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-300 cursor-pointer ${
              index === currentIndex ? "bg-orange-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
