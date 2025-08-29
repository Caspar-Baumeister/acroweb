import { renderHook, act } from '@testing-library/react';
import { useEventSelection } from '../useEventSelection';
import { EventOccurrence } from '../useEventOccurrences';

describe('useEventSelection', () => {
  const mockEvents: EventOccurrence[] = [
    {
      id: '1',
      startDate: '2024-12-01T10:00:00Z',
      endDate: '2024-12-01T12:00:00Z',
      isCancelled: false,
      availableSlots: 5,
      maxSlots: 10,
      isHighlighted: true,
      participantsCount: 5,
      class: {
        id: 1,
        name: 'Test Class',
        description: 'A test class',
        imageUrl: 'https://example.com/image.jpg',
        locationName: 'Test Location',
        locationCity: 'Test City',
        locationCountry: 'Test Country',
        eventType: 'Workshop',
        urlSlug: 'test-class'
      }
    },
    {
      id: '2',
      startDate: '2024-12-02T14:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      isCancelled: false,
      availableSlots: 3,
      maxSlots: 8,
      isHighlighted: false,
      participantsCount: 5,
      class: {
        id: 1,
        name: 'Test Class',
        description: 'A test class',
        imageUrl: 'https://example.com/image.jpg',
        locationName: 'Test Location',
        locationCity: 'Test City',
        locationCountry: 'Test Country',
        eventType: 'Workshop',
        urlSlug: 'test-class'
      }
    },
    {
      id: '3',
      startDate: '2024-12-03T09:00:00Z',
      endDate: '2024-12-03T11:00:00Z',
      isCancelled: false,
      availableSlots: 0,
      maxSlots: 6,
      isHighlighted: false,
      participantsCount: 6,
      class: {
        id: 1,
        name: 'Test Class',
        description: 'A test class',
        imageUrl: 'https://example.com/image.jpg',
        locationName: 'Test Location',
        locationCity: 'Test City',
        locationCountry: 'Test Country',
        eventType: 'Workshop',
        urlSlug: 'test-class'
      }
    }
  ];

  beforeEach(() => {
    // Mock current date to be 2024-11-29 (before all events)
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-11-29T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should auto-select next upcoming event when no initial event ID is provided', () => {
    const { result } = renderHook(() => useEventSelection(mockEvents));

    expect(result.current.selectedEvent).toEqual(mockEvents[0]); // Dec 1st event
  });

  it('should select specific event when initial event ID is provided', () => {
    const { result } = renderHook(() => useEventSelection(mockEvents, '2'));

    expect(result.current.selectedEvent).toEqual(mockEvents[1]); // Dec 2nd event
  });

  it('should handle empty events array gracefully', () => {
    const { result } = renderHook(() => useEventSelection([]));

    expect(result.current.selectedEvent).toBeNull();
  });

  it('should handle single event gracefully', () => {
    const singleEvent = [mockEvents[0]];
    const { result } = renderHook(() => useEventSelection(singleEvent));

    expect(result.current.selectedEvent).toEqual(mockEvents[0]);
  });

  it('should select most recent past event when no upcoming events exist', () => {
    // All events are in the past
    const pastEvents = mockEvents.map(event => ({
      ...event,
      startDate: '2024-11-20T10:00:00Z',
      endDate: '2024-11-20T12:00:00Z'
    }));

    const { result } = renderHook(() => useEventSelection(pastEvents));

    // Should select the most recent past event (Dec 1st becomes Nov 20th)
    expect(result.current.selectedEvent).toEqual(pastEvents[0]);
  });

  it('should handle manual event selection', () => {
    const { result } = renderHook(() => useEventSelection(mockEvents));

    act(() => {
      result.current.setSelectedEvent(mockEvents[2]);
    });

    expect(result.current.selectedEvent).toEqual(mockEvents[2]);
  });

  it('should select next upcoming event when selectNextUpcomingEvent is called', () => {
    const { result } = renderHook(() => useEventSelection(mockEvents));

    act(() => {
      result.current.selectNextUpcomingEvent(mockEvents);
    });

    expect(result.current.selectedEvent).toEqual(mockEvents[0]); // Dec 1st event
  });

  it('should select event by ID when selectEventById is called', () => {
    const { result } = renderHook(() => useEventSelection(mockEvents));

    act(() => {
      result.current.selectEventById('3', mockEvents);
    });

    expect(result.current.selectedEvent).toEqual(mockEvents[2]);
  });

  it('should handle selecting non-existent event ID gracefully', () => {
    const { result } = renderHook(() => useEventSelection(mockEvents));

    act(() => {
      result.current.selectEventById('999', mockEvents);
    });

    // Should not change the selection
    expect(result.current.selectedEvent).toEqual(mockEvents[0]);
  });

  it('should handle events with same date correctly', () => {
    const sameDateEvents = [
      { ...mockEvents[0], startDate: '2024-12-01T10:00:00Z' },
      { ...mockEvents[1], startDate: '2024-12-01T14:00:00Z' }
    ];

    const { result } = renderHook(() => useEventSelection(sameDateEvents));

    // Should select the first event on that date
    expect(result.current.selectedEvent).toEqual(sameDateEvents[0]);
  });

  it('should handle cancelled events correctly', () => {
    const cancelledEvent = { ...mockEvents[0], isCancelled: true };
    const eventsWithCancelled = [cancelledEvent, mockEvents[1]];

    const { result } = renderHook(() => useEventSelection(eventsWithCancelled));

    // Should still select the cancelled event if it's the next upcoming
    expect(result.current.selectedEvent).toEqual(cancelledEvent);
  });

  it('should update selection when events change', () => {
    const { result, rerender } = renderHook(
      ({ events }) => useEventSelection(events),
      { initialProps: { events: mockEvents } }
    );

    expect(result.current.selectedEvent).toEqual(mockEvents[0]);

    // Change events
    const newEvents = [mockEvents[1], mockEvents[2]];
    rerender({ events: newEvents });

    // Should auto-select from new events
    expect(result.current.selectedEvent).toEqual(mockEvents[1]);
  });

  it('should handle events with invalid dates gracefully', () => {
    const invalidDateEvents = [
      { ...mockEvents[0], startDate: 'invalid-date' },
      mockEvents[1]
    ];

    const { result } = renderHook(() => useEventSelection(invalidDateEvents));

    // Should still work and select a valid event
    expect(result.current.selectedEvent).toBeDefined();
  });

  it('should maintain selection when events array is updated but contains same event', () => {
    const { result, rerender } = renderHook(
      ({ events }) => useEventSelection(events, '2'),
      { initialProps: { events: mockEvents } }
    );

    expect(result.current.selectedEvent?.id).toBe('2');

    // Update events but keep the same event with ID '2'
    const updatedEvents = [
      { ...mockEvents[0], name: 'Updated Event' },
      mockEvents[1], // Same event with ID '2'
      mockEvents[2]
    ];

    rerender({ events: updatedEvents });

    // Should maintain selection of event with ID '2'
    expect(result.current.selectedEvent?.id).toBe('2');
  });
});
