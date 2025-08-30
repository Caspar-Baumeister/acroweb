import { gql } from "graphql-request";

// Query for featured events (events with images, since there are no highlighted events)
export const GET_FEATURED_EVENTS = gql`
  query GetFeaturedEvents($limit: Int = 6) {
    class_events(
      where: {
        end_date: { _gte: "now" }
        is_cancelled: { _eq: false }
        class: { id: { _is_null: false }, image_url: { _is_null: false } }
      }
      order_by: { start_date: asc }
      limit: $limit
    ) {
      id
      start_date
      end_date
      is_cancelled
      available_booking_slots
      max_booking_slots
      is_highlighted
      participants_aggregate {
        aggregate {
          count
        }
      }
      class {
        id
        name
        description
        image_url
        location_name
        location_city
        location_country
        event_type
        class_teachers {
          teacher {
            id
            name
            url_slug
            images {
              image {
                url
              }
              is_profile_picture
            }
          }
          is_owner
        }
        booking_categories {
          id
          name
          description
          booking_options {
            id
            price
            currency
            title
            subtitle
          }
        }
      }
    }
  }
`;

// Query for upcoming events
export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents($limit: Int = 6) {
    class_events(
      where: {
        end_date: { _gte: "now" }
        is_cancelled: { _eq: false }
        class: { id: { _is_null: false } }
      }
      order_by: { start_date: asc }
      limit: $limit
    ) {
      id
      start_date
      end_date
      is_cancelled
      available_booking_slots
      max_booking_slots
      is_highlighted
      participants_aggregate {
        aggregate {
          count
        }
      }
      class {
        id
        name
        description
        image_url
        location_name
        location_city
        location_country
        event_type
        class_teachers {
          teacher {
            id
            name
            url_slug
            images {
              image {
                url
              }
              is_profile_picture
            }
          }
          is_owner
        }
        booking_categories {
          id
          name
          description
          booking_options {
            id
            price
            currency
            title
            subtitle
          }
        }
      }
    }
  }
`;

// Query for class details by slug
export const GET_CLASS_BY_SLUG = gql`
  query GetClassBySlug($slug: String!) {
    classes(where: { url_slug: { _eq: $slug } }, limit: 1) {
      id
      name
      description
      image_url
      location_name
      location_city
      location_country
      event_type
      url_slug
      class_teachers {
        teacher {
          id
          name
          url_slug
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_owner
      }
      booking_categories {
        id
        name
        description
        booking_options {
          id
          price
          currency
          title
          subtitle
        }
      }
    }
  }
`;

// Query for event occurrences by class ID
export const GET_EVENT_OCCURRENCES_BY_CLASS = gql`
  query GetEventOccurrencesByClass($classId: uuid!, $limit: Int = 50) {
    class_events(
      where: {
        class_id: { _eq: $classId }
        end_date: { _gte: "now" }
        is_cancelled: { _eq: false }
      }
      order_by: { start_date: asc }
      limit: $limit
    ) {
      id
      start_date
      end_date
      is_cancelled
      available_booking_slots
      max_booking_slots
      is_highlighted
      class {
        id
        name
        description
        image_url
        location_name
        location_city
        location_country
        event_type
        url_slug
      }
    }
  }
`;
