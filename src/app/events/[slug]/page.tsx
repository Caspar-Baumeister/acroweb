'use client';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useEventOccurrences } from '@/hooks/useEventOccurrences';
import { useEventSelection } from '@/hooks/useEventSelection';

interface EventDetailPageProps {
  params: {
    slug: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = params;

  // Fetch class details and event occurrences
  const { classDetails, loading: classLoading, error: classError } = useClassDetails(slug);
  const { eventOccurrences, loading: eventsLoading, error: eventsError } = useEventOccurrences(
    classDetails?.id || 0
  );
  
  // Handle event selection
  const { selectedEvent, setSelectedEvent } = useEventSelection(eventOccurrences);

  // Handle loading states
  if (classLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
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
  if (classError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">Error Loading Class</h1>
            <p className="text-muted-foreground mb-4">{classError}</p>
            <button 
              onClick={() => window.history.back()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">Error Loading Events</h1>
            <p className="text-muted-foreground mb-4">{eventsError}</p>
            <button 
              onClick={() => window.history.back()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle class not found
  if (!classDetails) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {classDetails.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {classDetails.description}
          </p>
        </div>
        
        {/* Event Header with Image */}
        {classDetails.imageUrl && (
          <div className="bg-card rounded-lg overflow-hidden mb-8">
            <div className="relative h-64 w-full">
              <img
                src={classDetails.imageUrl}
                alt={classDetails.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        )}

        {/* Event Information */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Teachers</h3>
              <div className="space-y-2">
                {classDetails.teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3">
                    {teacher.imageUrl && (
                      <img
                        src={teacher.imageUrl}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      {teacher.isOwner && (
                        <span className="text-sm text-muted-foreground">Lead Teacher</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <p className="text-muted-foreground">
                {classDetails.locationName || 'Location TBD'}
                {classDetails.locationCity && `, ${classDetails.locationCity}`}
                {classDetails.locationCountry && `, ${classDetails.locationCountry}`}
              </p>
              <h3 className="font-medium mb-2 mt-4">Category</h3>
              <p className="text-muted-foreground">{classDetails.eventType}</p>
            </div>
          </div>
        </div>

        {/* Event Statistics */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{eventOccurrences.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {eventOccurrences.filter(e => new Date(e.startDate) > new Date()).length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {eventOccurrences.reduce((sum, e) => sum + e.participantsCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Participants</p>
            </div>
          </div>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Calendar (Coming Soon)</h2>
          <p className="text-muted-foreground">
            Beautiful shadcn calendar will be implemented in Phase 4.
          </p>
        </div>

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Selected Event Details</h2>
            <div className="space-y-3">
              <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedEvent.startDate).toLocaleTimeString()}</p>
              <p><strong>Duration:</strong> {Math.round((new Date(selectedEvent.endDate).getTime() - new Date(selectedEvent.startDate).getTime()) / (1000 * 60 * 60))} hours</p>
              <p><strong>Available Slots:</strong> {selectedEvent.availableSlots || 0} / {selectedEvent.maxSlots || 0}</p>
              <p><strong>Participants:</strong> {selectedEvent.participantsCount}</p>
            </div>
          </div>
        )}

        {/* Booking Information */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
          <p className="text-muted-foreground">
            Booking functionality will be implemented in Phase 6.
          </p>
        </div>
      </div>
    </div>
  );
}
