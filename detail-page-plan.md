# Event Detail Page Implementation Plan

## Overview

Create a comprehensive event detail page that displays class information with a beautiful shadcn calendar showing upcoming events, detailed information, and booking functionality.

## Architecture

- **Route**: `/events/[slug]` - Class detail page (determined by slug)
- **Route**: `/events/[slug]/[eventId]` - Specific event occurrence page (determined by event ID)
- **Data Flow**: Class data + Event occurrences + User interaction

## Phase 1: Foundation & Routing ✅

- [ ] Create basic route structure (`/events/[slug]`)
- [ ] Create basic route structure (`/events/[slug]/[eventId]`)
- [ ] Set up page components with basic layout
- [ ] Test: Routes are accessible and render basic content

## Phase 2: Data Fetching & State Management ✅

- [ ] Create GraphQL query for class details by slug
- [ ] Create GraphQL query for event occurrences by class ID
- [ ] Create custom hook `useClassDetails(slug)` for class data
- [ ] Create custom hook `useEventOccurrences(classId)` for events
- [ ] Handle loading, error, and empty states
- [ ] Test: Data fetching works, loading states display correctly

## Phase 3: Basic Layout & Information Display ✅

- [ ] Create `EventDetailHeader` component (image, title, description)
- [ ] Create `EventDetailInfo` component (teachers, location, category)
- [ ] Create `EventDetailStats` component (total events, participants)
- [ ] Implement responsive grid layout
- [ ] Test: Basic information displays correctly, responsive design works

## Phase 4: Calendar Integration ✅

- [ ] Install and configure shadcn calendar components
- [ ] Create `EventCalendar` component with calendar view
- [ ] Map event occurrences to calendar dates
- [ ] Handle date selection and event highlighting
- [ ] Test: Calendar renders, events display on correct dates

## Phase 5: Event Occurrence Selection ✅

- [ ] Implement auto-selection logic for next upcoming event
- [ ] Handle specific event occurrence selection (from URL)
- [ ] Create `EventOccurrenceCard` component for selected event
- [ ] Add visual indicators for selected event in calendar
- [ ] Test: Auto-selection works, manual selection works, visual feedback

## Phase 6: Booking Information Display ✅

- [ ] Create `BookingInfo` component (slots, price, availability)
- [ ] Display open slots, max slots, and booking status
- [ ] Show pricing information if available
- [ ] Handle different booking states (available, full, past)
- [ ] Test: Booking information displays correctly for different states

## Phase 7: Booking Button & Actions ✅

- [ ] Create prominent booking button for bookable events
- [ ] Implement booking flow placeholder (modal/form)
- [ ] Handle different button states (bookable, full, past, not logged in)
- [ ] Add loading states for booking actions
- [ ] Test: Booking button works, different states display correctly

## Phase 8: Enhanced Calendar Features ✅

- [ ] Add event tooltips on calendar hover
- [ ] Implement calendar navigation (month/year)
- [ ] Add event count indicators on calendar dates
- [ ] Handle multiple events on same date
- [ ] Test: Calendar navigation works, tooltips display, event counts show

## Phase 9: Event Occurrence Details ✅

- [ ] Create detailed view for selected event occurrence
- [ ] Display start/end times, duration
- [ ] Show participant count and capacity
- [ ] Add event-specific images if available
- [ ] Test: Event details display correctly, all information shows

## Phase 10: Teacher & Location Details ✅

- [ ] Create `TeacherCard` component with profile information
- [ ] Create `LocationCard` component with map/address
- [ ] Handle missing teacher/location data gracefully
- [ ] Add teacher profile pictures and bios
- [ ] Test: Teacher and location information displays correctly

## Phase 11: Related Events & Navigation ✅

- [ ] Show related events from same teacher/class
- [ ] Add navigation between different event occurrences
- [ ] Implement breadcrumb navigation
- [ ] Add "back to events" functionality
- [ ] Test: Navigation works, related events display

## Phase 12: Responsive Design & Polish ✅

- [ ] Ensure mobile-first responsive design
- [ ] Add smooth transitions and animations
- [ ] Implement skeleton loading states
- [ ] Add error boundaries and fallbacks
- [ ] Test: Responsive design works on all screen sizes

## Phase 13: Testing & Quality Assurance ✅

- [ ] Write unit tests for all components
- [ ] Write integration tests for data flow
- [ ] Test edge cases (no events, no images, etc.)
- [ ] Performance testing and optimization
- [ ] Test: All tests pass, performance is acceptable

## Phase 14: Integration & Final Testing ✅

- [ ] Integrate with existing event cards (add click handlers)
- [ ] Test full user journey from landing page
- [ ] Cross-browser testing
- [ ] Accessibility testing
- [ ] Test: Complete user flow works end-to-end

## Technical Requirements

### Components to Create

1. `EventDetailPage` - Main page component
2. `EventDetailHeader` - Hero section with image and title
3. `EventDetailInfo` - Class information display
4. `EventCalendar` - shadcn calendar with events
5. `EventOccurrenceCard` - Selected event details
6. `BookingInfo` - Booking availability and pricing
7. `TeacherCard` - Teacher information display
8. `LocationCard` - Location information display

### Hooks to Create

1. `useClassDetails(slug)` - Fetch class information
2. `useEventOccurrences(classId)` - Fetch event occurrences
3. `useEventSelection()` - Handle event selection logic

### GraphQL Queries to Create

1. `GET_CLASS_BY_SLUG` - Fetch class details
2. `GET_EVENT_OCCURRENCES_BY_CLASS` - Fetch all occurrences

### Testing Strategy

- Unit tests for each component
- Integration tests for data flow
- E2E tests for user journeys
- Test edge cases and error states

## Success Criteria

- [ ] User can navigate to event detail page from landing page
- [ ] Calendar displays upcoming events correctly
- [ ] Next upcoming event is auto-selected
- [ ] Specific event can be selected from calendar
- [ ] Booking information is clearly displayed
- [ ] Booking button is prominent for available events
- [ ] Page is fully responsive
- [ ] All tests pass
- [ ] App runs without errors after each phase

## Notes

- Each phase should result in a working application
- Test after each phase to ensure nothing breaks
- Keep components small and focused
- Use TypeScript interfaces for all data structures
- Follow existing design patterns and component structure
- Prioritize user experience and visual appeal
