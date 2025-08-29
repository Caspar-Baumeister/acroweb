import { GraphQLClient } from "graphql-request";

// GraphQL API configuration
// You can create a .env.local file with NEXT_PUBLIC_GRAPHQL_ENDPOINT to override this
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  "https://dev.acroworld.de/hasura/v1/graphql";

// Create GraphQL client
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to create authenticated client
export const createAuthenticatedClient = (token: string, role?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (role) {
    headers["x-hasura-role"] = role;
  }

  return new GraphQLClient(GRAPHQL_ENDPOINT, { headers });
};

// Types for events
export interface EventOccurrence {
  id: string;
  start_date: string;
  end_date: string;
  is_cancelled: boolean;
  available_booking_slots: number;
  max_booking_slots: number;
  is_highlighted: boolean;
  participants_aggregate: {
    aggregate: {
      count: number;
    };
  };
  class: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    location_name: string;
    location_city: string;
    location_country: string;
    event_type: string;
    class_teachers: Array<{
      teacher: {
        id: string;
        name: string;
        url_slug: string;
        images: Array<{
          image: {
            url: string;
          };
          is_profile_picture: boolean;
        }>;
      };
      is_owner: boolean;
    }>;
    booking_categories: Array<{
      id: string;
      name: string;
      description?: string;
      booking_options: Array<{
        id: string;
        price: number;
        currency: string;
        title: string;
        subtitle?: string;
      }>;
    }>;
  };
}
