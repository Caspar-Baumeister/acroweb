import { useState, useEffect } from "react";
import { graphqlClient } from "@/lib/graphql";
import { GET_FEATURED_EVENTS, GET_UPCOMING_EVENTS } from "@/lib/queries";
import type { EventOccurrence } from "@/lib/graphql";

interface UseEventsReturn {
  featuredEvents: EventOccurrence[];
  upcomingEvents: EventOccurrence[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEvents = (): UseEventsReturn => {
  const [featuredEvents, setFeaturedEvents] = useState<EventOccurrence[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured events
      const featuredData = await graphqlClient.request(GET_FEATURED_EVENTS, {
        limit: 6,
      });
      setFeaturedEvents(featuredData.class_events || []);

      // Fetch upcoming events
      const upcomingData = await graphqlClient.request(GET_UPCOMING_EVENTS, {
        limit: 6,
      });
      setUpcomingEvents(upcomingData.class_events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");

      // Set empty arrays on error to prevent crashes
      setFeaturedEvents([]);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const refetch = () => {
    fetchEvents();
  };

  return {
    featuredEvents,
    upcomingEvents,
    loading,
    error,
    refetch,
  };
};
