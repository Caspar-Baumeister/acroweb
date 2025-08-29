"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClassDetails } from "@/hooks/useClassDetails";
import { useEventOccurrences } from "@/hooks/useEventOccurrences";
import { EventDetailHeader } from "@/components/EventDetailHeader";
import { EventOccurrenceCard } from "@/components/EventOccurrenceCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";

interface EventOccurrencePageProps {
  params: {
    slug: string;
    eventId: string;
  };
}

export default function EventOccurrencePage({
  params,
}: EventOccurrencePageProps) {
  const { slug, eventId } = params;
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Fetch class details and event occurrences
  const {
    classDetails,
    loading: classLoading,
    error: classError,
  } = useClassDetails(slug);
  const {
    eventOccurrences,
    loading: eventsLoading,
    error: eventsError,
  } = useEventOccurrences(classDetails?.id || 0);

  // Find the specific event occurrence
  useEffect(() => {
    if (eventOccurrences.length > 0) {
      const event = eventOccurrences.find((e) => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [eventOccurrences, eventId]);

  // Handle loading states
  if (classLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle errors
  if (classError || eventsError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Error Loading Event
            </h1>
            <p className="text-muted-foreground mb-4">
              {classError || eventsError}
            </p>
            <Link href={`/events/${slug}`}>
              <Button>Back to Class Overview</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle event not found
  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Event Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The event occurrence you're looking for doesn't exist.
            </p>
            <Link href={`/events/${slug}`}>
              <Button>Back to Class Overview</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Back */}
        <div className="mb-6">
          <Link href={`/events/${slug}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Class Overview
            </Button>
          </Link>
        </div>

        {/* Event Header */}
        <EventDetailHeader
          title={classDetails?.name || "Event Details"}
          description={classDetails?.description || "No description available"}
          imageUrl={classDetails?.imageUrl}
          category={classDetails?.eventType || "Class"}
          isHighlighted={selectedEvent.isHighlighted}
        />

        {/* Event Occurrence Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Event Details</h2>
          <EventOccurrenceCard
            event={selectedEvent}
            onBook={(eventId) => {
              // TODO: Implement booking functionality in Phase 6
              console.log("Booking event:", eventId);
              alert("Booking functionality coming soon!");
            }}
          />
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Date & Time</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedEvent.startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedEvent.startDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(selectedEvent.endDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Location</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.class.locationName || "Location TBD"}
            </p>
            {selectedEvent.class.locationCity && (
              <p className="text-sm text-muted-foreground">
                {selectedEvent.class.locationCity}
                {selectedEvent.class.locationCountry &&
                  `, ${selectedEvent.class.locationCountry}`}
              </p>
            )}
          </div>

          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Capacity</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.participantsCount} /{" "}
              {selectedEvent.maxSlots || "Unknown"} participants
            </p>
            {selectedEvent.availableSlots !== undefined && (
              <p className="text-sm text-muted-foreground">
                {selectedEvent.availableSlots} slots available
              </p>
            )}
          </div>
        </div>

        {/* Booking Information */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
          {selectedEvent.isBookable ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This event is available for booking. Click the book button above
                to reserve your spot.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Available slots: {selectedEvent.availableSlots}
                </span>
                <span className="text-sm text-muted-foreground">
                  Max capacity: {selectedEvent.maxSlots}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              This event is not available for booking at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
