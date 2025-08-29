import { gql } from "graphql-request";

// Query for featured events (highlighted events)
export const GET_FEATURED_EVENTS = gql`
  query GetFeaturedEvents($limit: Int = 6) {
    class_events(
      where: {
        end_date: { _gte: "now" }
        is_highlighted: { _eq: true }
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
