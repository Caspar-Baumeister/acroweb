import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventOccurrence } from '@/hooks/useEventOccurrences';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  XCircle, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';

interface EventOccurrenceCardProps {
  event: EventOccurrence;
  onBook?: (eventId: string) => void;
  className?: string;
}

export const EventOccurrenceCard: React.FC<EventOccurrenceCardProps> = ({
  event,
  onBook,
  className,
}) => {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const now = new Date();
  
  const isPast = startDate < now;
  const isUpcoming = startDate > now;
  const isToday = startDate.toDateString() === now.toDateString();
  
  const durationHours = differenceInHours(endDate, startDate);
  const durationMinutes = differenceInMinutes(endDate, startDate) % 60;
  
  const isBookable = !isPast && !event.isCancelled && event.availableSlots && event.availableSlots > 0;
  const isFull = event.availableSlots === 0;
  const isAlmostFull = event.availableSlots && event.availableSlots <= 3;

  const getStatusBadge = () => {
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

  const getAvailabilityBadge = () => {
    if (event.isCancelled || isPast) return null;
    
    if (isFull) {
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Full</Badge>;
    }
    if (isAlmostFull) {
      return <Badge variant="default" className="flex items-center gap-1 bg-orange-600"><AlertCircle className="w-3 h-3" />Almost Full</Badge>;
    }
    if (isBookable) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><CheckCircle className="w-3 h-3" />Available</Badge>;
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.class.name}</CardTitle>
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge()}
              {getAvailabilityBadge()}
              {event.isHighlighted && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {format(startDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                {startDate.toDateString() !== endDate.toDateString() && 
                  `to ${format(endDate, 'MMMM d, yyyy')}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
              </p>
              <p className="text-sm text-muted-foreground">
                {durationHours > 0 && `${durationHours}h`}
                {durationMinutes > 0 && ` ${durationMinutes}m`}
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {event.class.locationName || 'Location TBD'}
            </p>
            <p className="text-sm text-muted-foreground">
              {event.class.locationCity && event.class.locationCountry && 
                `${event.class.locationCity}, ${event.class.locationCountry}`
              }
            </p>
          </div>
        </div>

        {/* Capacity and Participants */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">
              {event.participantsCount} participants
            </p>
            {event.availableSlots !== undefined && event.maxSlots !== undefined && (
              <p className="text-sm text-muted-foreground">
                {event.availableSlots} of {event.maxSlots} slots available
              </p>
            )}
          </div>
        </div>

        {/* Progress bar for capacity */}
        {event.availableSlots !== undefined && event.maxSlots !== undefined && (
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((event.maxSlots - event.availableSlots) / event.maxSlots) * 100}%` 
              }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {isBookable && onBook && (
            <Button 
              onClick={() => onBook(event.id)}
              className="flex-1"
              size="lg"
            >
              Book Now
            </Button>
          )}
          
          {isFull && (
            <Button 
              variant="outline" 
              className="flex-1" 
              disabled
            >
              Event Full
            </Button>
          )}
          
          {isPast && (
            <Button 
              variant="outline" 
              className="flex-1" 
              disabled
            >
              Event Ended
            </Button>
          )}
          
          {event.isCancelled && (
            <Button 
              variant="outline" 
              className="flex-1" 
              disabled
            >
              Event Cancelled
            </Button>
          )}
        </div>

        {/* Additional Info */}
        {event.class.description && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.class.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
