# AcroWorld GraphQL API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Base URL & Authentication](#base-url--authentication)
3. [Queries](#queries)
4. [Mutations](#mutations)
5. [Fragments](#fragments)
6. [Data Types](#data-types)
7. [Error Handling](#error-handling)

## Overview

This document provides comprehensive documentation for all GraphQL endpoints used in the AcroWorld project. The API is built on Hasura and provides endpoints for managing classes, events, bookings, users, teachers, and payments.

**Base URL:** `https://{backendHost}/hasura/v1/graphql`

- Production: `https://bro-devs.com/hasura/v1/graphql`
- Development: `https://dev.acroworld.de/hasura/v1/graphql`

## Base URL & Authentication

### Authentication

The API uses JWT-based authentication with Bearer tokens. Two authentication modes are supported:

1. **Standard User Mode**: `Authorization: Bearer {token}`
2. **Teacher Mode**: `Authorization: Bearer {token}` + `x-hasura-role: TeacherUser`

### Headers

- `Authorization`: Bearer token for authentication
- `x-hasura-role`: Role-based access control (User, TeacherUser, AdminUser)

## Queries

### User Management

#### Get Current User

```graphql
query GetMe {
  me {
    bio
    email
    id
    image_url
    name
    user_roles {
      role {
        id
        name
      }
    }
    teacher_id
    teacher_profile {
      id
      name
      images {
        is_profile_picture
        image {
          url
        }
      }
    }
    level {
      id
      name
    }
    acro_role {
      id
      name
    }
    is_email_verified
  }
}
```

#### Get Current User (Creator Mode)

```graphql
query GetMe {
  me {
    teacher_profile {
      created_at
      url_slug
      description
      type
      id
      location_name
      name
      user_id
      is_organization
      stripe_id
      is_stripe_enabled
      individual_commission
    }
  }
}
```

#### Get User by ID

```graphql
query getUserById($userId: uuid!) {
  users_by_pk(id: $userId) {
    bio
    email
    id
    image_url
    name
    user_roles {
      role {
        id
        name
      }
    }
    teacher_id
    teacher_profile {
      id
      name
      images {
        is_profile_picture
        image {
          url
        }
      }
    }
    level {
      id
      name
    }
    acro_role {
      id
      name
    }
  }
}
```

#### Get All Users (Paginated)

```graphql
query getAllUsers($limit: Int, $offset: Int) {
  users(limit: $limit, offset: $offset) {
    bio
    email
    id
    image_url
    name
    user_roles {
      role {
        id
        name
      }
    }
    teacher_id
    teacher_profile {
      id
      name
      images {
        is_profile_picture
        image {
          url
        }
      }
    }
    level {
      id
      name
    }
    acro_role {
      id
      name
    }
  }
}
```

### Class Management

#### Get All Classes

```graphql
query getClasses {
  classes {
    url_slug
    booking_email
    max_booking_slots
    city
    description
    id
    image_url
    location
    location_name
    name
    location_country
    location_city
    website_url
    class_teachers {
      teacher {
        created_at
        url_slug
        description
        type
        id
        location_name
        name
        user_id
        is_organization
        stripe_id
        is_stripe_enabled
        user_likes_aggregate {
          aggregate {
            count
          }
        }
        images {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_owner
    }
    class_owners {
      teacher {
        created_at
        url_slug
        description
        type
        id
        location_name
        name
        user_id
        is_organization
        stripe_id
        is_stripe_enabled
        user_likes_aggregate {
          aggregate {
            count
          }
        }
        images {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_payment_receiver
    }
    class_levels {
      level {
        name
        id
      }
    }
    event_type
    created_by_id
    questions {
      id
      question
      title
      position
      is_required
      allow_multiple_answers
      question_type
      multiple_choice_options {
        id
        question_id
        option_text
        position
      }
    }
    booking_categories {
      id
      name
      description
      contingent
      booking_options {
        commission
        currency
        discount
        id
        price
        subtitle
        title
        updated_at
        category_id
      }
    }
    class_flags {
      id
      is_active
      user_id
    }
    is_cash_allowed
    class_events(where: { end_date: { _gte: now } }) {
      class_id
      created_at
      end_date
      id
      is_cancelled
      available_booking_slots
      max_booking_slots
      start_date
      is_highlighted
      participants_aggregate {
        aggregate {
          count
        }
      }
      participants {
        user {
          id
          name
          acro_role_id
        }
      }
    }
  }
  classes_aggregate {
    aggregate {
      count
    }
  }
}
```

#### Get Classes (Lazy Loading - Teacher User)

```graphql
query getClassesLazy($limit: Int!, $offset: Int!, $where: classes_bool_exp!) {
  classes(
    where: $where
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    city
    id
    image_url
    location
    location_name
    url_slug
    name
    class_teachers {
      teacher {
        id
        name
        user_id
        images(where: { is_profile_picture: { _eq: true } }) {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_owner
    }
    class_levels {
      level {
        name
        id
      }
    }
    event_type
    is_cash_allowed
    class_events(
      where: { end_date: { _gte: now } }
      order_by: { start_date: asc }
      limit: 1
    ) {
      id
      start_date
      is_highlighted
    }
    class_events_aggregate(where: { end_date: { _gte: now } }) {
      aggregate {
        count
      }
    }
    class_flags {
      id
      is_active
      user_id
    }
  }
}
```

#### Get Class by Slug

```graphql
query getClassById($url_slug: String!) {
  classes(where: { url_slug: { _eq: $url_slug } }) {
    url_slug
    booking_email
    max_booking_slots
    city
    description
    id
    image_url
    location
    location_name
    name
    location_country
    location_city
    website_url
    class_teachers {
      teacher {
        created_at
        url_slug
        description
        type
        id
        location_name
        name
        user_id
        is_organization
        stripe_id
        is_stripe_enabled
        user_likes_aggregate {
          aggregate {
            count
          }
        }
        images {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_owner
    }
    class_owners {
      teacher {
        created_at
        url_slug
        description
        type
        id
        location_name
        name
        user_id
        is_organization
        stripe_id
        is_stripe_enabled
        user_likes_aggregate {
          aggregate {
            count
          }
        }
        images {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_payment_receiver
    }
    class_levels {
      level {
        name
        id
      }
    }
    event_type
    created_by_id
    questions {
      id
      question
      title
      position
      is_required
      allow_multiple_answers
      question_type
      multiple_choice_options {
        id
        question_id
        option_text
        position
      }
    }
    booking_categories {
      id
      name
      description
      contingent
      booking_options {
        commission
        currency
        discount
        id
        price
        subtitle
        title
        updated_at
        category_id
      }
    }
    class_flags {
      id
      is_active
      user_id
    }
    is_cash_allowed
    recurring_patterns {
      day_of_week
      end_date
      end_time
      is_recurring
      id
      recurring_every_x_weeks
      start_date
      start_time
      class_id
    }
  }
}
```

#### Get Classes by Teacher ID

```graphql
query getClassesByTeacherId($teacher_id: uuid!) {
  classes(where: { class_teachers: { teacher_id: { _eq: $teacher_id } } }) {
    url_slug
    booking_email
    max_booking_slots
    city
    description
    id
    image_url
    location
    location_name
    name
    location_country
    location_city
    website_url
    class_teachers {
      teacher {
        created_at
        url_slug
        description
        type
        id
        location_name
        name
        user_id
        is_organization
        stripe_id
        is_stripe_enabled
        user_likes_aggregate {
          aggregate {
            count
          }
        }
        images {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_owner
    }
    class_owners {
      teacher {
        created_at
        url_slug
        description
        type
        id
        location_name
        name
        user_id
        is_organization
        stripe_id
        is_stripe_enabled
        user_likes_aggregate {
          aggregate {
            count
          }
        }
        images {
          image {
            url
          }
          is_profile_picture
        }
      }
      is_payment_receiver
    }
    class_levels {
      level {
        name
        id
      }
    }
    event_type
    created_by_id
    questions {
      id
      question
      title
      position
      is_required
      allow_multiple_answers
      question_type
      multiple_choice_options {
        id
        question_id
        option_text
        position
      }
    }
    booking_categories {
      id
      name
      description
      contingent
      booking_options {
        commission
        currency
        discount
        id
        price
        subtitle
        title
        updated_at
        category_id
      }
    }
    class_flags {
      id
      is_active
      user_id
    }
    is_cash_allowed
  }
}
```

### Class Events

#### Get Upcoming Class Events by Class ID

```graphql
query getUpcomingClassEventsById($classId: uuid!) {
  class_events(
    where: { class_id: { _eq: $classId }, start_date: { _gte: now } }
    order_by: { start_date: asc }
  ) {
    class_id
    created_at
    end_date
    id
    is_cancelled
    available_booking_slots
    max_booking_slots
    start_date
    is_highlighted
    participants_aggregate {
      aggregate {
        count
      }
    }
    participants {
      user {
        id
        name
        acro_role_id
      }
    }
  }
}
```

#### Get All Class Events by Class ID

```graphql
query getClassEventsById($classId: uuid!) {
  class_events(
    where: { class_id: { _eq: $classId } }
    order_by: { start_date: asc }
  ) {
    class_id
    created_at
    end_date
    id
    is_cancelled
    available_booking_slots
    max_booking_slots
    start_date
    is_highlighted
    participants_aggregate {
      aggregate {
        count
      }
    }
    participants {
      user {
        id
        name
        acro_role_id
      }
    }
  }
}
```

#### Get Class Event with Class Details

```graphql
query getClassEventWithClasById($class_event_id: uuid!) {
  class_events_by_pk(id: $class_event_id) {
    class_id
    created_at
    end_date
    id
    is_cancelled
    available_booking_slots
    max_booking_slots
    start_date
    is_highlighted
    participants_aggregate {
      aggregate {
        count
      }
    }
    participants {
      user {
        id
        name
        acro_role_id
      }
    }
    class {
      url_slug
      booking_email
      max_booking_slots
      city
      description
      id
      image_url
      location
      location_name
      name
      location_country
      location_city
      website_url
      class_teachers {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_owner
      }
      class_owners {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_payment_receiver
      }
      class_levels {
        level {
          name
          id
        }
      }
      event_type
      created_by_id
      questions {
        id
        question
        title
        position
        is_required
        allow_multiple_answers
        question_type
        multiple_choice_options {
          id
          question_id
          option_text
          position
        }
      }
      booking_categories {
        id
        name
        description
        contingent
        booking_options {
          commission
          currency
          discount
          id
          price
          subtitle
          title
          updated_at
          category_id
        }
      }
      class_flags {
        id
        is_active
        user_id
      }
      is_cash_allowed
    }
  }
}
```

#### Get Class Events by Location (Calendar View)

```graphql
query getClassEventsFromToLocationWithClass(
  $from: timestamptz!
  $to: timestamptz!
  $latitude: numeric
  $longitude: numeric
  $distance: float8
) {
  class_events_by_location_v1(
    args: { lat: $latitude, lng: $longitude }
    order_by: { distance: asc }
    where: {
      end_date: { _gte: $from }
      start_date: { _lte: $to }
      distance: { _lte: $distance }
    }
  ) {
    distance
    class_id
    created_at
    end_date
    id
    is_cancelled
    available_booking_slots
    max_booking_slots
    start_date
    is_highlighted
    participants_aggregate {
      aggregate {
        count
      }
    }
    participants {
      user {
        id
        name
        acro_role_id
      }
    }
    class {
      url_slug
      booking_email
      max_booking_slots
      city
      description
      id
      image_url
      location
      location_name
      name
      location_country
      location_city
      website_url
      class_teachers {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_owner
      }
      class_owners {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_payment_receiver
      }
      class_levels {
        level {
          name
          id
        }
      }
      event_type
      created_by_id
      questions {
        id
        question
        title
        position
        is_required
        allow_multiple_answers
        question_type
        multiple_choice_options {
          id
          question_id
          option_text
          position
        }
      }
      booking_categories {
        id
        name
        description
        contingent
        booking_options {
          commission
          currency
          discount
          id
          price
          subtitle
          title
          updated_at
          category_id
        }
      }
      class_flags {
        id
        is_active
        user_id
      }
      is_cash_allowed
    }
  }
}
```

#### Get Class Events by Distance (Map View)

```graphql
query getClassEventsByDistance(
  $latitude: numeric
  $longitude: numeric
  $distance: float8
) {
  class_events_by_location_v1(
    args: { lat: $latitude, lng: $longitude }
    order_by: { distance: asc }
    where: { start_date: { _gte: now }, distance: { _lte: $distance } }
  ) {
    distance
    class_id
    created_at
    end_date
    id
    is_cancelled
    available_booking_slots
    max_booking_slots
    start_date
    is_highlighted
    participants_aggregate {
      aggregate {
        count
      }
    }
    participants {
      user {
        id
        name
        acro_role_id
      }
    }
    class {
      url_slug
      booking_email
      max_booking_slots
      city
      description
      id
      image_url
      location
      location_name
      name
      location_country
      location_city
      website_url
      class_teachers {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_owner
      }
      class_owners {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_payment_receiver
      }
      class_levels {
        level {
          name
          id
        }
      }
      event_type
      created_by_id
      questions {
        id
        question
        title
        position
        is_required
        allow_multiple_answers
        question_type
        multiple_choice_options {
          id
          question_id
          option_text
          position
        }
      }
      booking_categories {
        id
        name
        description
        contingent
        booking_options {
          commission
          currency
          discount
          id
          price
          subtitle
          title
          updated_at
          category_id
        }
      }
      class_flags {
        id
        is_active
        user_id
      }
      is_cash_allowed
    }
  }
}
```

#### Get Event Occurrences (Discovery Page)

```graphql
query getEventOccurences {
  class_events(
    where: { end_date: { _gte: "now" }, class: { id: { _is_null: false } } }
  ) {
    class_id
    created_at
    end_date
    id
    is_cancelled
    available_booking_slots
    max_booking_slots
    start_date
    is_highlighted
    participants_aggregate {
      aggregate {
        count
      }
    }
    participants {
      user {
        id
        name
        acro_role_id
      }
    }
    is_highlighted
    recurring_pattern {
      is_recurring
      id
      start_date
      end_date
    }
    class {
      url_slug
      booking_email
      max_booking_slots
      city
      description
      id
      image_url
      location
      location_name
      name
      location_country
      location_city
      website_url
      class_teachers {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_owner
      }
      class_owners {
        teacher {
          created_at
          url_slug
          description
          type
          id
          location_name
          name
          user_id
          is_organization
          stripe_id
          is_stripe_enabled
          user_likes_aggregate {
            aggregate {
              count
            }
          }
          images {
            image {
              url
            }
            is_profile_picture
          }
        }
        is_payment_receiver
      }
      class_levels {
        level {
          name
          id
        }
      }
      event_type
      created_by_id
      questions {
        id
        question
        title
        position
        is_required
        allow_multiple_answers
        question_type
        multiple_choice_options {
          id
          question_id
          option_text
          position
        }
      }
      booking_categories {
        id
        name
        description
        contingent
        booking_options {
          commission
          currency
          discount
          id
          price
          subtitle
          title
          updated_at
          category_id
        }
      }
      class_flags {
        id
        is_active
        user_id
      }
      is_cash_allowed
    }
  }
}
```

### Teacher Management

#### Get Teachers (Paginated)

```graphql
query GetTeachersPageable(
  $limit: Int
  $offset: Int
  $where: teachers_bool_exp!
) {
  teachers(
    limit: $limit
    offset: $offset
    where: $where
    order_by: { name: asc }
  ) {
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
  }
}
```

#### Get Teacher for List (with User ID)

```graphql
query getTeacherForList($user_id: uuid, $search: String!) {
  teachers(
    order_by: { user_likes_aggregate: { count: desc } }
    where: {
      confirmation_status: { _eq: Confirmed }
      _and: { name: { _ilike: $search } }
    }
  ) {
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
    user_likes(where: { user_id: { _eq: $user_id } }) {
      user_id
    }
    user_likes_aggregate {
      aggregate {
        count
      }
    }
  }
}
```

#### Get Teacher for List (without User ID)

```graphql
query getTeacherForListWithoutUserID($search: String!) {
  teachers(
    order_by: { user_likes_aggregate: { count: desc } }
    where: {
      confirmation_status: { _eq: Confirmed }
      _and: { name: { _ilike: $search } }
    }
  ) {
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
  }
}
```

#### Get Followed Teacher for List

```graphql
query getFollowedTeacherForList($user_id: uuid!, $search: String!) {
  teachers(
    order_by: { user_likes_aggregate: { count: desc } }
    where: {
      user_likes: { user_id: { _eq: $user_id } }
      _and: {
        confirmation_status: { _eq: Confirmed }
        name: { _ilike: $search }
      }
    }
  ) {
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
  }
}
```

#### Get Teacher by ID

```graphql
query getTeacherById($teacher_id: uuid!) {
  teachers_by_pk(id: $teacher_id) {
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
  }
}
```

#### Get Teacher by Slug

```graphql
query getTeacherBySlug($url_slug: String!) {
  teachers(where: { url_slug: { _eq: $url_slug } }) {
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
  }
}
```

#### Get Followed Teachers

```graphql
query getFollowedTeachers($user_id: uuid!) {
  teachers(
    where: {
      user_likes: {
        user_id: { _eq: $user_id }
        _and: { teacher: { confirmation_status: { _eq: Confirmed } } }
      }
    }
  ) {
    created_at
    url_slug
    description
    type
    id
    location_name
    name
    user_id
    is_organization
    stripe_id
    is_stripe_enabled
    user_likes_aggregate {
      aggregate {
        count
      }
    }
    images {
      image {
        url
      }
      is_profile_picture
    }
  }
}
```

### Booking Management

#### Get Booking Categories

```graphql
query getBookingCategories($classId: uuid!) {
  booking_category(where: { class_id: { _eq: $classId } }) {
    id
    name
    description
    contingent
    booking_options {
      commission
      currency
      discount
      id
      price
      subtitle
      title
      updated_at
      category_id
    }
  }
}
```

#### Get Class Event Bookings

```graphql
query getClassEventBookings($id: uuid!, $limit: Int, $offset: Int) {
  class_event_bookings(
    where: {
      class_event: { class: { created_by_id: { _eq: $id } } }
      _and: { status: { _in: ["Confirmed", "WaitingForPayment"] } }
    }
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    id
    created_at
    amount
    status
    currency
    payment_intent_id
    user {
      id
      name
      acro_role {
        name
        id
      }
      email
      image_url
      level {
        name
        id
      }
    }
    class_event {
      id
      start_date
      class {
        url_slug
        id
        name
        image_url
        created_by {
          id
          name
          email
        }
      }
    }
    booking_option {
      commission
      currency
      discount
      id
      price
      subtitle
      title
      updated_at
      category_id
      category {
        id
        name
        contingent
      }
    }
  }
}
```

#### Get Class Event Bookings by Class Event ID

```graphql
query getClassEventBookingsByClassSlug(
  $class_event_id: uuid!
  $created_by_id: uuid!
) {
  class_event_bookings(
    where: {
      class_event: {
        class: { created_by_id: { _eq: $created_by_id } }
        id: { _eq: $class_event_id }
      }
      status: { _in: ["Confirmed", "WaitingForPayment"] }
    }
  ) {
    id
    created_at
    amount
    status
    currency
    payment_intent_id
    user {
      id
      name
      acro_role {
        name
        id
      }
      email
      image_url
      level {
        name
        id
      }
    }
    class_event {
      id
      start_date
      class {
        url_slug
        id
        name
        image_url
        created_by {
          id
          name
          email
        }
      }
    }
    booking_option {
      commission
      currency
      discount
      id
      price
      subtitle
      title
      updated_at
      category_id
      category {
        id
        name
        contingent
      }
    }
  }
}
```

#### Get My Class Event Bookings

```graphql
query isClassEventBooked($class_event_id: uuid, $user_id: uuid) {
  class_event_bookings(
    where: {
      class_event_id: { _eq: $class_event_id }
      user_id: { _eq: $user_id }
      status: { _in: ["Confirmed", "WaitingForPayment"] }
    }
  ) {
    id
    created_at
    amount
    status
    currency
    payment_intent_id
    user {
      id
      name
      acro_role {
        name
        id
      }
      email
      image_url
      level {
        name
        id
      }
    }
    class_event {
      id
      start_date
      class {
        url_slug
        id
        name
        image_url
        created_by {
          id
          name
          email
        }
      }
    }
    booking_option {
      commission
      currency
      discount
      id
      price
      subtitle
      title
      updated_at
      category_id
      category {
        id
        name
        contingent
      }
    }
  }
}
```

#### Get Class Event Bookings Aggregate

```graphql
query getClassEventBookingsAggregate($id: uuid!) {
  class_event_bookings_aggregate(
    where: {
      status: { _in: ["Confirmed", "WaitingForPayment"] }
      class_event: { class: { created_by_id: { _eq: $id } } }
    }
  ) {
    aggregate {
      count
    }
  }
}
```

#### Get Confirmed Bookings for Category Aggregate

```graphql
query getConfirmedBookingsForCategory(
  $category_id: uuid!
  $class_event_id: uuid!
) {
  class_event_bookings_aggregate(
    where: {
      booking_option: { category_id: { _eq: $category_id } }
      _and: {
        class_event_id: { _eq: $class_event_id }
        status: { _in: ["Confirmed", "WaitingForPayment"] }
      }
    }
  ) {
    aggregate {
      count
    }
  }
}
```

### User Bookings & Favorites

#### Get User Bookings

```graphql
query userBookings {
  me {
    bookings(
      where: { status: { _in: ["Confirmed", "WaitingForPayment"] } }
      order_by: { class_event: { start_date: asc } }
    ) {
      created_at
      updated_at
      booking_option {
        id
        title
      }
      status
      class_event {
        id
        start_date
        end_date
        class {
          url_slug
          name
          image_url
          id
          class_teachers {
            teacher {
              name
            }
          }
        }
      }
    }
  }
}
```

#### Get User Favorites

```graphql
query Me {
  me {
    class_favorits {
      id
      created_at
      classes {
        url_slug
        booking_email
        max_booking_slots
        city
        description
        id
        image_url
        location
        location_name
        name
        location_country
        location_city
        website_url
        class_teachers {
          teacher {
            created_at
            url_slug
            description
            type
            id
            location_name
            name
            user_id
            is_organization
            stripe_id
            is_stripe_enabled
            user_likes_aggregate {
              aggregate {
                count
              }
            }
            images {
              image {
                url
              }
              is_profile_picture
            }
          }
          is_owner
        }
        class_owners {
          teacher {
            created_at
            url_slug
            description
            type
            id
            location_name
            name
            user_id
            is_organization
            stripe_id
            is_stripe_enabled
            user_likes_aggregate {
              aggregate {
                count
              }
            }
            images {
              image {
                url
              }
              is_profile_picture
            }
          }
          is_payment_receiver
        }
        class_levels {
          level {
            name
            id
          }
        }
        event_type
        created_by_id
        questions {
          id
          question
          title
          position
          is_required
          allow_multiple_answers
          question_type
          multiple_choice_options {
            id
            question_id
            option_text
            position
          }
        }
        booking_categories {
          id
          name
          description
          contingent
          booking_options {
            commission
            currency
            discount
            id
            price
            subtitle
            title
            updated_at
            category_id
          }
        }
        class_flags {
          id
          is_active
          user_id
        }
        is_cash_allowed
      }
    }
  }
}
```

#### Check if Class is Favorited

```graphql
query isClassFavorited($class_id: uuid!, $user_id: uuid!) {
  class_favorits(
    where: { user_id: { _eq: $user_id } }
    class_id: { _eq: $class_id }
  ) {
    id
    created_at
  }
}
```

### Questions and Answers

#### Get Questions for Event

```graphql
query getQuestionsForEvent($eventId: uuid!) {
  questions(
    where: { event_id: { _eq: $eventId } }
    order_by: { position: asc }
  ) {
    id
    question
    title
    position
    is_required
    allow_multiple_answers
    question_type
    multiple_choice_options {
      id
      question_id
      option_text
      position
    }
  }
}
```

#### Get Questions for Event Occurrence

```graphql
query getQuestionsForEvent($eventOccurenceId: uuid!) {
  questions(
    where: { event: { class_events: { id: { _eq: $eventOccurenceId } } } }
    order_by: { position: asc }
  ) {
    id
    question
    title
    position
    is_required
    allow_multiple_answers
    question_type
    multiple_choice_options {
      id
      question_id
      option_text
      position
    }
  }
}
```

#### Get Answers of User and Event Occurrence

```graphql
query getAnswersOfUserAndEventOccurence(
  $user_id: uuid!
  $event_occurence_id: uuid!
) {
  answers(
    where: {
      user_id: { _eq: $user_id }
      event_occurence: { _eq: $event_occurence_id }
    }
  ) {
    id
    answer
    question_id
    user_id
    event_occurence
    country_dial_code
    multiple_choice_answers {
      is_correct
      id
      multiple_choice_option_id
      user_id
      answer_id
    }
  }
}
```

### Invitations

#### Check if Email Can Be Invited

```graphql
query CheckEmail($email: String!) {
  users(where: { email: { _eq: $email } }) {
    id
  }
  created_invites(where: { email: { _eq: $email } }) {
    id
  }
}
```

#### Get Created Invites (Paginated)

```graphql
query GetCreatedInvitesPageable($limit: Int, $offset: Int) {
  created_invites(
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    id
    email
    confirmation_status
    entity
    created_at
    invited_user {
      name
    }
    class {
      name
    }
    event {
      name
    }
  }
  created_invites_aggregate {
    aggregate {
      count
    }
  }
}
```

### Location & Places

#### Get Places by Search Query (City)

```graphql
query GetPlaces($query: String!) {
  places(searchQuery: $query) {
    id
    description
    matched_substrings {
      length
      offset
    }
  }
}
```

#### Get Places by Search Query (General)

```graphql
query GetPlaces($query: String!) {
  search_by_input_text(searchQuery: $query) {
    id
    description
    matched_substrings {
      length
      offset
    }
  }
}
```

#### Get Place by ID

```graphql
query GetPlaces($id: String!) {
  place(id: $id) {
    description
    id
    latitude
    longitude
  }
}
```

### System & Configuration

#### Get Configuration

```graphql
query Config {
  config {
    min_version
    daily_highlight_commission
  }
}
```

#### Get All Acro Roles

```graphql
query Query {
  acro_roles {
    id
    name
  }
}
```

#### Get All Levels

```graphql
query Query {
  levels {
    id
    name
  }
}
```

#### Get Acro Role Aggregates from Jam

```graphql
query getAcroRoleAggregatesFromJam($jam_id: uuid!) {
  total_aggregate: jam_participants_aggregate(
    where: { jam_id: { _eq: $jam_id } }
  ) {
    aggregate {
      count
    }
  }
  base_aggregate: jam_participants_aggregate(
    where: {
      jam_id: { _eq: $jam_id }
      user: { acro_role_id: { _eq: "dc321f52-fce9-4b00-bef6-e59fb05f4624" } }
    }
  ) {
    aggregate {
      count
    }
  }
  flyer_aggregate: jam_participants_aggregate(
    where: {
      jam_id: { _eq: $jam_id }
      user: { acro_role_id: { _eq: "83a6536f-53ba-44d2-80d9-9842375ebe8b" } }
    }
  ) {
    aggregate {
      count
    }
  }
}
```

#### Get Class Participants

```graphql
query getCommunityUsers($class_event_id: uuid!, $limit: Int, $offset: Int) {
  users(
    where: {
      class_event_participations: { class_event_id: { _eq: $class_event_id } }
    }
    limit: $limit
    offset: $offset
  ) {
    bio
    email
    id
    image_url
    name
    user_roles {
      role {
        id
        name
      }
    }
    teacher_id
    teacher_profile {
      id
      name
      images {
        is_profile_picture
        image {
          url
        }
      }
    }
    level {
      id
      name
    }
    acro_role {
      id
      name
    }
  }
}
```

### Stripe Integration

#### Get Stripe Login Link

```graphql
query GetStripeLoginLink {
  stripe_login_link
}
```

### User Preferences & State

#### Get Followed Teachers (Provider Query)

```graphql
query {
  me {
    followed_teacher {
      teacher_id
    }
  }
}
```

#### Get Class Favorites (Provider Query)

```graphql
query {
  me {
    class_favorits {
      class_id
    }
  }
}
```

#### Get Class Flags (Provider Query)

```graphql
query {
  me {
    class_flags {
      class_id
      is_active
    }
  }
}
```

## Mutations

### Class Management

#### Create Class with Recurring Patterns

```graphql
mutation InsertClassWithRecurringPatterns(
  $name: String!
  $description: String!
  $imageUrl: String!
  $eventType: event_type_enum!
  $location: String!
  $locationName: String!
  $timezone: String!
  $urlSlug: String!
  $recurringPatterns: [recurring_patterns_insert_input!]!
  $classOwners: [class_owners_insert_input!]!
  $classTeachers: [class_teachers_insert_input!]!
  $max_booking_slots: Int
  $location_country: String
  $location_city: String
  $is_cash_allowed: Boolean
) {
  insert_classes_one(
    object: {
      name: $name
      description: $description
      image_url: $imageUrl
      location_country: $location_country
      event_type: $eventType
      location: { type: "Point", coordinates: $location }
      location_name: $locationName
      timezone: $timezone
      url_slug: $urlSlug
      location_city: $location_city
      is_cash_allowed: $is_cash_allowed
      recurring_patterns: { data: $recurringPatterns }
      class_owners: { data: $classOwners }
      class_teachers: { data: $classTeachers }
      max_booking_slots: $max_booking_slots
    }
  ) {
    id
  }
}
```

#### Update Class with Recurring Patterns

```graphql
mutation UpdateClassWithRecurringPatterns(
  $id: uuid!
  $name: String!
  $description: String!
  $imageUrl: String!
  $eventType: event_type_enum!
  $location: String!
  $locationName: String!
  $timezone: String!
  $location_country: String
  $urlSlug: String!
  $recurringPatterns: [recurring_patterns_insert_input!]!
  $classOwners: [class_owners_insert_input!]!
  $classTeachers: [class_teachers_insert_input!]!
  $max_booking_slots: Int
  $location_city: String
  $is_cash_allowed: Boolean
) {
  # Delete the class by id
  delete_classes_by_pk(id: $id) {
    id
  }

  # Recreate the class with updated information
  insert_classes_one(
    object: {
      id: $id
      name: $name
      description: $description
      image_url: $imageUrl
      event_type: $eventType
      location: { type: "Point", coordinates: $location }
      location_name: $locationName
      timezone: $timezone
      url_slug: $urlSlug
      location_country: $location_country
      location_city: $location_city
      is_cash_allowed: $is_cash_allowed
      recurring_patterns: { data: $recurringPatterns }
      class_owners: { data: $classOwners }
      class_teachers: { data: $classTeachers }
      max_booking_slots: $max_booking_slots
    }
  ) {
    id
    class_owners {
      teacher_id
    }
  }
}
```

#### Delete Class

```graphql
mutation DeleteClass($id: uuid!) {
  delete_recurring_patterns(where: { class_id: { _eq: $id } }) {
    affected_rows
  }
  delete_class_events(where: { class_id: { _eq: $id } }) {
    affected_rows
  }
  delete_class_booking_option(where: { class_id: { _eq: $id } }) {
    affected_rows
  }
  delete_classes_by_pk(id: $id) {
    id
  }
}
```

#### Cancel Class Event

```graphql
mutation CancelClassEvent($id: uuid!) {
  update_class_events_by_pk(
    _set: { is_cancelled: true }
    pk_columns: { id: $id }
  ) {
    id
  }
}
```

### Teacher Management

#### Create Teacher Profile

```graphql
mutation CreateTeacher(
  $userId: uuid!
  $name: String!
  $description: String!
  $urlSlug: String!
  $type: teacher_type_enum!
  $images: [teacher_images_insert_input!]!
) {
  insert_teachers(
    objects: {
      name: $name
      description: $description
      url_slug: $urlSlug
      user_id: $userId
      type: $type
      images: { data: $images }
    }
  ) {
    affected_rows
  }
}
```

#### Update Teacher Profile

```graphql
mutation UpdateTeacherAsTeacherUser(
  $teacherId: uuid!
  $userId: uuid!
  $name: String!
  $description: String!
  $urlSlug: String!
  $type: teacher_type_enum!
  $images: [teacher_images_insert_input!]!
  $teacherStripeId: String
  $isStripeEnabled: Boolean
  $individualCommission: numeric
) {
  delete_teachers_by_pk(id: $teacherId) {
    id
  }
  delete_teacher_images(where: { teacher_id: { _eq: $teacherId } }) {
    affected_rows
  }
  insert_teachers(
    objects: {
      id: $teacherId
      name: $name
      description: $description
      url_slug: $urlSlug
      user_id: $userId
      type: $type
      images: { data: $images }
      stripe_id: $teacherStripeId
      is_stripe_enabled: $isStripeEnabled
      individual_commission: $individualCommission
    }
  ) {
    affected_rows
  }
}
```

### Booking Management

#### Create Class Event Booking

```graphql
mutation InsertClassEventBooking($booking: class_event_bookings_insert_input!) {
  insert_class_event_bookings_one(object: $booking) {
    id
  }
}
```

#### Update Class Event Booking

```graphql
mutation UpdateClassEventBooking(
  $id: uuid!
  $booking: class_event_bookings_set_input!
) {
  update_class_event_bookings_by_pk(pk_columns: { id: $id }, _set: $booking) {
    id
  }
}
```

#### Insert Booking Options

```graphql
mutation InsertBookingOptions($options: [booking_option_insert_input!]!) {
  insert_booking_option(objects: $options) {
    affected_rows
  }
}
```

#### Update Booking Option

```graphql
mutation UpdateBookingOption($id: uuid!, $option: booking_option_set_input!) {
  update_booking_option_by_pk(pk_columns: { id: $id }, _set: $option) {
    id
  }
}
```

#### Delete Booking Option

```graphql
mutation DeleteBookingOption($id: uuid!) {
  delete_booking_option_by_pk(id: $id) {
    id
  }
}
```

### Category Management

#### Insert Categories

```graphql
mutation InsertCategories($categories: [booking_category_insert_input!]!) {
  insert_booking_category(objects: $categories) {
    affected_rows
  }
}
```

#### Update Category

```graphql
mutation UpdateCategory($id: uuid!, $category: booking_category_set_input!) {
  update_booking_category_by_pk(pk_columns: { id: $id }, _set: $category) {
    id
  }
}
```

#### Delete Category

```graphql
mutation DeleteCategory($id: uuid!) {
  delete_booking_category_by_pk(id: $id) {
    id
  }
}
```

### Questions and Answers

#### Insert Questions

```graphql
mutation InsertQuestions($questions: [questions_insert_input!]!) {
  insert_questions(objects: $questions) {
    affected_rows
    returning {
      id
    }
  }
}
```

#### Insert Single Question

```graphql
mutation InsertQuestion($question: questions_insert_input!) {
  insert_questions_one(object: $question) {
    id
  }
}
```

#### Insert Multiple Choice Options

```graphql
mutation InsertMultipleChoiceOptions(
  $options: [multiple_choice_option_insert_input!]!
) {
  insert_multiple_choice_option(objects: $options) {
    affected_rows
  }
}
```

#### Update Question

```graphql
mutation UpdateQuestionByPk($id: uuid!, $updates: questions_set_input!) {
  update_questions_by_pk(pk_columns: { id: $id }, _set: $updates) {
    id
  }
}
```

#### Delete Questions

```graphql
mutation DeleteQuestions($questionIds: [uuid!]!) {
  delete_questions(where: { id: { _in: $questionIds } }) {
    affected_rows
  }
}
```

#### Insert Answers

```graphql
mutation InsertAnswers($answers: [answers_insert_input!]!) {
  insert_answers(objects: $answers) {
    returning {
      id
    }
  }
}
```

#### Update Answer

```graphql
mutation UpdateAnswerByPk($id: uuid!, $updates: answers_set_input!) {
  update_answers_by_pk(pk_columns: { id: $id }, _set: $updates) {
    id
  }
}
```

#### Delete Answers

```graphql
mutation DeleteAnswers($answerIds: [uuid!]!) {
  delete_answers(where: { id: { _in: $answerIds } }) {
    affected_rows
  }
}
```

#### Insert Multiple Choice Answers

```graphql
mutation InsertMultipleChoiceAnswers(
  $answers: [multiple_choice_answer_insert_input!]!
) {
  insert_multiple_choice_answer(objects: $answers) {
    affected_rows
  }
}
```

#### Delete Multiple Choice Answer

```graphql
mutation DeleteMultipleChoiceAnswerByPk($id: uuid!) {
  delete_multiple_choice_answer_by_pk(id: $id) {
    id
  }
}
```

### User Management

#### Update User

```graphql
mutation updateUser($id: uuid!, $changes: users_set_input!) {
  update_users_by_pk(pk_columns: { id: $id }, _set: $changes) {
    bio
    email
    id
    image_url
    name
    user_roles {
      role {
        id
        name
      }
    }
    teacher_id
    teacher_profile {
      id
      name
      images {
        is_profile_picture
        image {
          url
        }
      }
    }
    level {
      id
      name
    }
    acro_role {
      id
      name
    }
  }
}
```

#### Set User Level

```graphql
mutation setUserLevel($user_id: uuid!, $level_id: uuid!) {
  update_users_by_pk(
    pk_columns: { id: $user_id }
    _set: { level_id: $level_id }
  ) {
    id
  }
}
```

#### Update FCM Token

```graphql
mutation UpdateFcmToken($fcmToken: String!) {
  update_users(_set: { fcm_token: $fcmToken }, where: {}) {
    affected_rows
  }
}
```

#### Update or Insert FCM Token

```graphql
mutation UpdateFcmToken($fcmToken: String!, $userId: uuid!) {
  update_users(
    _set: { fcm_token: $fcmToken }
    where: { id: { _eq: $userId } }
  ) {
    affected_rows
  }
}
```

#### Delete Account

```graphql
mutation deleteAccount {
  delete_account {
    success
  }
}
```

### User Preferences & Interactions

#### Bookmark Event

```graphql
mutation bookmarkEvent($event_id: uuid) {
  insert_event_bookmarks(objects: { event_id: $event_id }) {
    affected_rows
  }
}
```

#### Unbookmark Event

```graphql
mutation unBookmarkEvent($event_id: uuid, $user_id: uuid) {
  delete_event_bookmarks(
    where: { event_id: { _eq: $event_id }, user_id: { _eq: $user_id } }
  ) {
    affected_rows
  }
}
```

#### Favoritize Class

```graphql
mutation favoritizeClass($class_id: uuid!) {
  insert_class_favorites(objects: { class_id: $class_id }) {
    affected_rows
  }
}
```

#### Unfavoritize Class

```graphql
mutation unBookmarkEvent($class_id: uuid!, $user_id: uuid!) {
  delete_class_favorites(
    where: { class_id: { _eq: $class_id }, user_id: { _eq: $user_id } }
  ) {
    affected_rows
  }
}
```

#### Flag Class

```graphql
mutation flagClass($class_id: uuid!, $user_id: uuid!) {
  insert_class_flag(objects: { class_id: $class_id, user_id: $user_id }) {
    affected_rows
  }
}
```

#### Unflag Class

```graphql
mutation unFlagEvent($class_id: uuid!, $user_id: uuid!) {
  delete_class_flag(
    where: { class_id: { _eq: $class_id }, user_id: { _eq: $user_id } }
  ) {
    affected_rows
  }
}
```

#### Activate Flag

```graphql
mutation activateFlag($class_id: uuid!, $user_id: uuid!) {
  update_class_flag(
    where: { class_id: { _eq: $class_id }, user_id: { _eq: $user_id } }
    _set: { is_active: true }
  ) {
    affected_rows
  }
}
```

#### Resolve All Class Flags

```graphql
mutation ResolveAllClassFlags($classId: uuid!) {
  update_class_flag(
    where: { class_id: { _eq: $classId } }
    _set: { is_active: false }
  ) {
    affected_rows
    returning {
      user_id
    }
  }
}
```

### Teacher Interactions

#### Like Teacher

```graphql
mutation likeTeacher($teacher_id: uuid) {
  insert_teacher_likes(objects: { teacher_id: $teacher_id }) {
    affected_rows
  }
}
```

#### Unlike Teacher

```graphql
mutation unlikeTeacher($teacher_id: uuid, $user_id: uuid) {
  delete_teacher_likes(
    where: { teacher_id: { _eq: $teacher_id }, user_id: { _eq: $user_id } }
  ) {
    affected_rows
  }
}
```

### Invitations

#### Invite by Email

```graphql
mutation InviteByEmail($email: String!) {
  invite(email: $email) {
    success
  }
}
```

#### Invite (General)

```graphql
mutation Invite(
  $entityId: String
  $entityType: String
  $email: String
  $userId: String
) {
  invite(
    entity_id: $entityId
    entity: $entityType
    email: $email
    userId: $userId
  ) {
    success
  }
}
```

### Stripe Integration

#### Create Stripe User

```graphql
mutation createStripeUser($countryCode: String, $defaultCurrency: String) {
  create_stripe_user(
    country_code: $countryCode
    default_currency: $defaultCurrency
  ) {
    url
  }
}
```

#### Verify Stripe Account

```graphql
mutation {
  verify_stripe_account
}
```

#### Create Payment Sheet

```graphql
mutation CreatePaymentSheet($bookingOptionId: String!, $classEventId: String!) {
  create_payment_sheet(
    booking_option_id: $bookingOptionId
    class_event_id: $classEventId
  ) {
    payment_intent
    ephemeral_key
    customer_id
  }
}
```

#### Create Direct Charge Payment Sheet

```graphql
mutation CreateDirectChargePaymentSheet(
  $classEventId: String!
  $amount: Float!
) {
  create_direct_charge_payment_sheet(
    class_event_id: $classEventId
    amount: $amount
  ) {
    payment_intent
    ephemeral_key
    customer_id
  }
}
```

#### Confirm Payment

```graphql
mutation confirmPayment($payment_intent_id: uuid!) {
  payment_intent_succeeded(objects: { payment_intent_id: $payment_intent_id }) {
    id
  }
}
```

### Email Verification

#### Send Verification Email

```graphql
mutation {
  send_verification_email {
    success
  }
}
```

#### Resend Verification Email

```graphql
mutation {
  resend_verification_email {
    success
  }
}
```

#### Verify Email Code

```graphql
mutation verifyCode($code: String!) {
  verify_email(code: $code)
}
```

#### Reset Password

```graphql
mutation resetPassword($email: String) {
  reset_password(input: { email: $email }) {
    success
  }
}
```

## Fragments

### User Fragment

```graphql
fragment userFragment on users {
  bio
  email
  id
  image_url
  name
  user_roles {
    role {
      id
      name
    }
  }
  teacher_id
  teacher_profile {
    id
    name
    images {
      is_profile_picture
      image {
        url
      }
    }
  }
  level {
    id
    name
  }
  acro_role {
    id
    name
  }
}
```

### Teacher Fragment (All Info)

```graphql
fragment teacherFragmentAllInfo on teachers {
  created_at
  url_slug
  description
  type
  id
  location_name
  name
  user_id
  is_organization
  stripe_id
  is_stripe_enabled
  user_likes_aggregate {
    aggregate {
      count
    }
  }
  images {
    image {
      url
    }
    is_profile_picture
  }
}
```

### Teacher Fragment (Lazy)

```graphql
fragment teacherFragmentLazy on teachers {
  id
  name
  user_id
  images(where: { is_profile_picture: { _eq: true } }) {
    image {
      url
    }
    is_profile_picture
  }
}
```

### Class Fragment (All Info)

```graphql
fragment classFragmentAllInfo on classes {
  url_slug
  booking_email
  max_booking_slots
  city
  description
  id
  image_url
  location
  location_name
  name
  location_country
  location_city
  website_url
  class_teachers {
    teacher {
      created_at
      url_slug
      description
      type
      id
      location_name
      name
      user_id
      is_organization
      stripe_id
      is_stripe_enabled
      user_likes_aggregate {
        aggregate {
          count
        }
      }
      images {
        image {
          url
        }
        is_profile_picture
      }
    }
    is_owner
  }
  class_owners {
    teacher {
      created_at
      url_slug
      description
      type
      id
      location_name
      name
      user_id
      is_organization
      stripe_id
      is_stripe_enabled
      user_likes_aggregate {
        aggregate {
          count
        }
      }
      images {
        image {
          url
        }
        is_profile_picture
      }
    }
    is_payment_receiver
  }
  class_levels {
    level {
      name
      id
    }
  }
  event_type
  created_by_id
  questions {
    id
    question
    title
    position
    is_required
    allow_multiple_answers
    question_type
    multiple_choice_options {
      id
      question_id
      option_text
      position
    }
  }
  booking_categories {
    id
    name
    description
    contingent
    booking_options {
      commission
      currency
      discount
      id
      price
      subtitle
      title
      updated_at
      category_id
    }
  }
  class_flags {
    id
    is_active
    user_id
  }
  is_cash_allowed
}
```

### Class Fragment (Lazy)

```graphql
fragment classFragmentLazy on classes {
  city
  id
  image_url
  location
  location_name
  url_slug
  name
  class_teachers {
    teacher {
      id
      name
      user_id
      images(where: { is_profile_picture: { _eq: true } }) {
        image {
          url
        }
        is_profile_picture
      }
    }
    is_owner
  }
  class_levels {
    level {
      name
      id
    }
  }
  event_type
  is_cash_allowed
}
```

### Class Event Fragment

```graphql
fragment classEventFragment on class_events {
  class_id
  created_at
  end_date
  id
  is_cancelled
  available_booking_slots
  max_booking_slots
  start_date
  is_highlighted
  participants_aggregate {
    aggregate {
      count
    }
  }
  participants {
    user {
      id
      name
      acro_role_id
    }
  }
}
```

### Recurring Pattern Fragment

```graphql
fragment recurringPatternFragment on recurring_patterns {
  is_recurring
  id
  start_date
  end_date
}
```

### Class Event Booking Fragment

```graphql
fragment classEventBookingFragment on class_event_bookings {
  id
  created_at
  amount
  status
  currency
  payment_intent_id
  user {
    id
    name
    acro_role {
      name
      id
    }
    email
    image_url
    level {
      name
      id
    }
  }
  class_event {
    id
    start_date
    class {
      url_slug
      id
      name
      image_url
      created_by {
        id
        name
        email
      }
    }
  }
  booking_option {
    commission
    currency
    discount
    id
    price
    subtitle
    title
    updated_at
    category_id
    category {
      id
      name
      contingent
    }
  }
}
```

### Booking Option Fragment

```graphql
fragment bookingOptionFragment on booking_option {
  commission
  currency
  discount
  id
  price
  subtitle
  title
  updated_at
  category_id
}
```

### Question Fragment

```graphql
fragment questionFragment on questions {
  id
  question
  title
  position
  is_required
  allow_multiple_answers
  question_type
  multiple_choice_options {
    id
    question_id
    option_text
    position
  }
}
```

### Answer Fragment

```graphql
fragment answerFragment on answers {
  id
  answer
  question_id
  user_id
  event_occurence
  country_dial_code
  multiple_choice_answers {
    is_correct
    id
    multiple_choice_option_id
    user_id
    answer_id
  }
}
```

## Data Types

### Scalar Types

- `uuid`: Unique identifier
- `String`: Text data
- `Int`: Integer numbers
- `Float`: Decimal numbers
- `Boolean`: True/false values
- `timestamptz`: Timestamp with timezone
- `numeric`: Decimal numbers for financial calculations

### Enum Types

- `event_type_enum`: Type of event (e.g., "class", "workshop", "jam")
- `teacher_type_enum`: Type of teacher (e.g., "individual", "organization")
- `confirmation_status`: Status of confirmation (e.g., "Confirmed", "Pending")

### Input Types

- `classes_insert_input`: Input for creating classes
- `teachers_insert_input`: Input for creating teachers
- `class_event_bookings_insert_input`: Input for creating bookings
- `questions_insert_input`: Input for creating questions
- `answers_insert_input`: Input for creating answers

## Error Handling

### GraphQL Errors

The API returns standard GraphQL errors with:

- `message`: Human-readable error description
- `locations`: Line and column numbers where the error occurred
- `path`: Path to the field that caused the error
- `extensions`: Additional error information

### Common Error Scenarios

1. **Authentication Errors**: Invalid or expired tokens
2. **Authorization Errors**: Insufficient permissions for the requested operation
3. **Validation Errors**: Invalid input data or missing required fields
4. **Database Errors**: Constraint violations or database connection issues
5. **Business Logic Errors**: Operations that violate business rules

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Error description",
      "locations": [{ "line": 1, "column": 10 }],
      "path": ["fieldName"],
      "extensions": {
        "code": "ERROR_CODE",
        "additionalInfo": "Additional details"
      }
    }
  ]
}
```

## Rate Limiting & Timeouts

### Request Timeouts

- **Query Timeout**: 60 seconds
- **Mutation Timeout**: 60 seconds
- **HTTP Client Timeout**: 60 seconds

### Rate Limiting

The API implements rate limiting to prevent abuse. Specific limits depend on the user's role and subscription level.

## Best Practices

### Query Optimization

1. **Use Fragments**: Reuse common field selections across queries
2. **Limit Fields**: Only request the fields you need
3. **Use Pagination**: Implement proper pagination for large datasets
4. **Batch Operations**: Use batch mutations when possible

### Error Handling

1. **Check for Errors**: Always check `result.hasException` before processing data
2. **Handle Gracefully**: Provide fallback behavior for common errors
3. **Log Errors**: Log errors for debugging and monitoring
4. **User Feedback**: Show appropriate error messages to users

### Authentication

1. **Token Management**: Properly handle token refresh and expiration
2. **Role-Based Access**: Use appropriate roles for different operations
3. **Secure Storage**: Store tokens securely on the client side

### Performance

1. **Caching**: Implement appropriate caching strategies
2. **Lazy Loading**: Load data only when needed
3. **Optimistic Updates**: Use optimistic updates for better UX
4. **Network Optimization**: Minimize network requests and payload size
