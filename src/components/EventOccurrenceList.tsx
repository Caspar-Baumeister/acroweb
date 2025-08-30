import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventOccurrence } from "@/hooks/useEventOccurrences";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  XCircle, 
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format, parseISO, differenceInHours, differenceInMinutes } from "date-fns";

interface EventOccurrenceListProps {
  events: EventOccurrence[];
  selectedEvent?: EventOccurrence | null;
  onEventSelect?: (event: EventOccurrence) => void;
  className?: string;
}

export const EventOccurrenceList: React.FC<EventOccurrenceListProps> = ({
  events,
  selectedEvent,
  onEventSelect,
  className,
}) => {
  const [expandedCount, setExpandedCount] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort events by start date (upcoming first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });

  // Get events to display
  const displayedEvents = sortedEvents.slice(0, expandedCount);
  const hasMoreEvents = expandedCount < sortedEvents.length;

  const handleShowMore = () => {
    setExpandedCount(prev => prev + 2);
    setIsExpanded(true);
  };

  const handleShowLess = () => {
    setExpandedCount(2);
    setIsExpanded(false);
  };

  const formatEventTime = (startDate: string, endDate: string) => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      const startTime = format(start, 'HH:mm');
      const endTime = format(end, 'HH:mm');
      
      // Check if it's the same day
      if (start.toDateString() === end.toDateString()) {
        return `${format(start, 'MMM d, yyyy')} • ${startTime} - ${endTime}`;
      } else {
        return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')} • ${startTime} - ${endTime}`;
      }
    } catch (error) {
      console.error("Error formatting event time:", error);
      return "Time TBD";
    }
  };

  const getStatusBadge = (event: EventOccurrence) => {
    const startDate = parseISO(event.startDate);
    const now = new Date();
    const isPast = startDate < now;
    const isToday = startDate.toDateString() === now.toDateString();
    const isUpcoming = startDate > now;

    if (event.isCancelled) {
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelled</Badge>;
    }
    if (isPast) {
      return <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />Past</Badge>;
    }
    if (isToday) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><Calendar className="w-3 h-3" />Today</Badge>;
    }
    if (isUpcoming) {
      return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />Upcoming</Badge>;
    }
    return null;
  };

  const getAvailabilityBadge = (event: EventOccurrence) => {
    if (event.isCancelled) return null;
    
    const isFull = event.availableSlots === 0;
    const isAlmostFull = event.availableSlots && event.availableSlots <= 3;
    const isBookable = event.isBookable && event.availableSlots && event.availableSlots > 0;

    if (isFull) {
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Full</Badge>;
    }
    if (isAlmostFull) {
      return <Badge variant="default" className="flex items-center gap-1 bg-orange-600"><AlertCircle className="w-3 h-3" />Almost Full</Badge>;
    }
    if (isBookable) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><CheckCircle className="w-3 h-3" />Available</Badge>;
    }
    return <Badge variant="outline" className="flex items-center gap-1"><Users className="w-3 h-3" />No Booking</Badge>;
  };

  if (events.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground">
              There are no upcoming events scheduled for this class.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Upcoming Events</CardTitle>
            <Badge variant="secondary">{events.length} Events</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayedEvents.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            
            return (
              <div
                key={event.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onEventSelect?.(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{event.class.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(event)}
                      {getAvailabilityBadge(event)}
                      {event.isHighlighted && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatEventTime(event.startDate, event.endDate)}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.class.locationName || event.class.locationCity || 'Location TBD'}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {(() => {
                        try {
                          const start = parseISO(event.startDate);
                          const end = parseISO(event.endDate);
                          const hours = differenceInHours(end, start);
                          const minutes = differenceInMinutes(end, start) % 60;
                          return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
                        } catch (error) {
                          return 'Duration TBD';
                        }
                      })()}
                    </span>
                  </div>

                  {/* Booking Status */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.isBookable && event.availableSlots !== undefined && event.maxSlots !== undefined
                        ? `${event.availableSlots} of ${event.maxSlots} slots available`
                        : 'No booking required'
                      }
                    </span>
                  </div>
                </div>

                {/* Progress bar for capacity (only if bookable) */}
                {event.isBookable && event.availableSlots !== undefined && event.maxSlots !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Capacity</span>
                      <span>{event.maxSlots - event.availableSlots}/{event.maxSlots} filled</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((event.maxSlots - event.availableSlots) / event.maxSlots) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Show More/Less Buttons */}
          {hasMoreEvents && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleShowMore}
                className="flex items-center gap-2"
              >
                Show 2 More Events
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {isExpanded && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                onClick={handleShowLess}
                className="flex items-center gap-2 text-muted-foreground"
                size="sm"
              >
                Show Less
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
