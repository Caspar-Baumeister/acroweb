'use client';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useEventOccurrences } from '@/hooks/useEventOccurrences';
import { useEventSelection } from '@/hooks/useEventSelection';
import { EventDetailHeader } from '@/components/EventDetailHeader';
import { EventDetailInfo } from '@/components/EventDetailInfo';
import { EventDetailStats } from '@/components/EventDetailStats';
import { EventCalendar } from '@/components/EventCalendar';
import { EventOccurrenceCard } from '@/components/EventOccurrenceCard';

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
        <EventDetailHeader
          title={classDetails.name}
          description={classDetails.description}
          imageUrl={classDetails.imageUrl}
          category={classDetails.eventType}
          isHighlighted={false} // TODO: Add isHighlighted to class details
        />

        <EventDetailInfo
          teachers={classDetails.teachers}
          locationName={classDetails.locationName}
          locationCity={classDetails.locationCity}
          locationCountry={classDetails.locationCountry}
          eventType={classDetails.eventType}
          totalEvents={eventOccurrences.length}
          upcomingEvents={eventOccurrences.filter(e => new Date(e.startDate) > new Date()).length}
        />

        <EventDetailStats
          totalEvents={eventOccurrences.length}
          upcomingEvents={eventOccurrences.filter(e => new Date(e.startDate) > new Date()).length}
          totalParticipants={eventOccurrences.reduce((sum, e) => sum + e.participantsCount, 0)}
          averageDuration={eventOccurrences.length > 0 ? 
            Math.round(eventOccurrences.reduce((sum, e) => 
              sum + (new Date(e.endDate).getTime() - new Date(e.startDate).getTime()) / (1000 * 60 * 60), 0
            ) / eventOccurrences.length) : undefined
          }
        />

        <EventCalendar
          events={eventOccurrences}
          selectedDate={selectedEvent ? new Date(selectedEvent.startDate) : undefined}
          onDateSelect={(date) => {
            // Find events for the selected date
            const dateEvents = eventOccurrences.filter(event => {
              const eventDate = new Date(event.startDate);
              return eventDate.toDateString() === date.toDateString();
            });
            
            // Select the first event for that date, or the next upcoming event
            if (dateEvents.length > 0) {
              const nextEvent = dateEvents.find(event => new Date(event.startDate) > new Date()) || dateEvents[0];
              setSelectedEvent(nextEvent);
            }
          }}
          className="mb-8"
        />

        {/* Selected Event Details */}
        {selectedEvent && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Selected Event Details</h2>
            <EventOccurrenceCard
              event={selectedEvent}
              onBook={(eventId) => {
                // TODO: Implement booking functionality in Phase 6
                console.log('Booking event:', eventId);
                alert('Booking functionality coming soon!');
              }}
            />
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
