import { useState, useEffect } from "react";
import { request } from "@/lib/graphql";
import { GET_EVENT_OCCURRENCES_BY_CLASS } from "@/lib/queries";

export interface EventOccurrence {
  id: string;
  startDate: string;
  endDate: string;
  isCancelled: boolean;
  availableSlots?: number;
  maxSlots?: number;
  isHighlighted: boolean;
  isBookable: boolean;
  class: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    locationName?: string;
    locationCity?: string;
    locationCountry?: string;
    eventType: string;
    urlSlug: string;
  };
}

interface UseEventOccurrencesReturn {
  eventOccurrences: EventOccurrence[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEventOccurrences(
  classId: string
): UseEventOccurrencesReturn {
  const [eventOccurrences, setEventOccurrences] = useState<EventOccurrence[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventOccurrences = async () => {
    if (!classId) {
      setError("No class ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const variables = { classId };
      const data = await request(GET_EVENT_OCCURRENCES_BY_CLASS, variables);

      if ((data as any).class_events) {
        // Transform the raw GraphQL data to our interface
        const transformedOccurrences: EventOccurrence[] = (data as any).class_events.map(
          (event: any) => ({
            id: event.id,
            startDate: event.start_date,
            endDate: event.end_date,
            isCancelled: event.is_cancelled,
            availableSlots: event.available_booking_slots ?? undefined,
            maxSlots: event.max_booking_slots ?? undefined,
            isHighlighted: event.is_highlighted,
            isBookable: !!(event.available_booking_slots !== null && event.max_booking_slots !== null),
            class: {
              id: event.class.id,
              name: event.class.name,
              description: event.class.description,
              imageUrl: event.class.image_url || undefined,
              locationName: event.class.location_name || undefined,
              locationCity: event.class.location_city || undefined,
              locationCountry: event.class.location_country || undefined,
              eventType: event.class.event_type,
              urlSlug: event.class.url_slug,
            },
          })
        );

        setEventOccurrences(transformedOccurrences);
      } else {
        setEventOccurrences([]);
      }
    } catch (err) {
      console.error("Error fetching event occurrences:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch event occurrences"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventOccurrences();
  }, [classId]);

  const refetch = () => {
    setLoading(true);
    fetchEventOccurrences();
  };

  return {
    eventOccurrences,
    loading,
    error,
    refetch,
  };
}
