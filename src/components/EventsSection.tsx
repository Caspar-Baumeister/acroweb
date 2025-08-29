import React from "react";
import { EventCard, Event } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Loader2, AlertCircle } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { transformEventOccurrence } from "@/lib/transformers";

interface EventsSectionProps {
  onEventBook?: (eventId: string) => void;
  onEventViewDetails?: (eventId: string) => void;
  onViewAllEvents?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  onEventBook,
  onEventViewDetails,
  onViewAllEvents,
}) => {
  const { featuredEvents, upcomingEvents, loading, error, refetch } =
    useEvents();

  // Transform GraphQL data to Event interface
  const transformedFeaturedEvents: Event[] = featuredEvents.map(
    transformEventOccurrence
  );
  const transformedUpcomingEvents: Event[] = upcomingEvents.map(
    transformEventOccurrence
  );

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Loading Events
            </h2>
            <p className="text-muted-foreground">
              Fetching the latest acro yoga events...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Error Loading Events
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Featured Events */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
              <h2 className="text-3xl font-bold text-foreground">
                Featured Events
              </h2>
            </div>
            {onViewAllEvents && (
              <Button variant="ghost" onClick={onViewAllEvents}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {transformedFeaturedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedFeaturedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="featured"
                  onBook={onEventBook}
                  onViewDetails={onEventViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No featured events available at the moment.
              </p>
              <p className="text-muted-foreground">
                Check back soon for highlighted acro yoga experiences!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Upcoming Events
            </h2>
            {onViewAllEvents && (
              <Button variant="ghost" onClick={onViewAllEvents}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {transformedUpcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedUpcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="compact"
                  onBook={onEventBook}
                  onViewDetails={onEventViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No upcoming events scheduled at the moment.
              </p>
              <p className="text-muted-foreground">
                Be the first to know when new events are added!
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Acro Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of practitioners worldwide and discover the
              transformative power of acro yoga
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onViewAllEvents}>
                Browse All Events
              </Button>
              <Button variant="outline" size="lg">
                Find Teachers Near You
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
