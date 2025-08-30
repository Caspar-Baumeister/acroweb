"use client";

import React from "react";
import { Hero } from "@/components/Hero";
import { EventsSection } from "@/components/EventsSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: Implement search functionality
  };

  const handleLocationChange = (location: string) => {
    console.log("Location changed:", location);
    // TODO: Implement location filtering
  };

  const handleDateChange = (date: string) => {
    console.log("Date changed:", date);
    // TODO: Implement date filtering
  };

  const handleEventBook = (eventId: string) => {
    console.log("Booking event:", eventId);
    // TODO: Implement booking functionality
  };

  const handleEventViewDetails = (eventId: string) => {
    console.log("Viewing event details:", eventId);
    // TODO: Navigate to event details page
  };

  const handleViewAllEvents = () => {
    console.log("View all events");
    // TODO: Navigate to events page
  };

  const handleMenuToggle = () => {
    console.log("Menu toggle");
    // TODO: Implement mobile menu
  };

  const handleProfileClick = () => {
    console.log("Profile click");
    // TODO: Navigate to profile or show auth modal
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero
          onSearch={handleSearch}
          onLocationChange={handleLocationChange}
          onDateChange={handleDateChange}
        />

        <EventsSection
          onEventBook={handleEventBook}
          onEventViewDetails={handleEventViewDetails}
          onViewAllEvents={handleViewAllEvents}
        />
      </main>

      <Footer />
    </div>
  );
}
