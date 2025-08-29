import { useState, useEffect } from 'react';
import { EventOccurrence } from './useEventOccurrences';

interface UseEventSelectionReturn {
  selectedEvent: EventOccurrence | null;
  setSelectedEvent: (event: EventOccurrence | null) => void;
  selectNextUpcomingEvent: (events: EventOccurrence[]) => void;
  selectEventById: (eventId: string, events: EventOccurrence[]) => void;
}

export function useEventSelection(
  events: EventOccurrence[],
  initialEventId?: string
): UseEventSelectionReturn {
  const [selectedEvent, setSelectedEvent] = useState<EventOccurrence | null>(null);

  // Auto-select next upcoming event if no specific event is selected
  const selectNextUpcomingEvent = (eventList: EventOccurrence[]) => {
    if (eventList.length === 0) return;

    const now = new Date();
    const upcomingEvents = eventList.filter(event => new Date(event.startDate) > now);
    
    if (upcomingEvents.length > 0) {
      // Sort by start date and select the first upcoming event
      const nextEvent = upcomingEvents.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];
      setSelectedEvent(nextEvent);
    } else {
      // If no upcoming events, select the most recent past event
      const sortedEvents = eventList.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setSelectedEvent(sortedEvents[0]);
    }
  };

  // Select a specific event by ID
  const selectEventById = (eventId: string, eventList: EventOccurrence[]) => {
    const event = eventList.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };

  // Initialize selection when events change or initial event ID is provided
  useEffect(() => {
    if (events.length === 0) return;

    if (initialEventId) {
      selectEventById(initialEventId, events);
    } else {
      selectNextUpcomingEvent(events);
    }
  }, [events, initialEventId]);

  return {
    selectedEvent,
    setSelectedEvent,
    selectNextUpcomingEvent,
    selectEventById,
  };
}
