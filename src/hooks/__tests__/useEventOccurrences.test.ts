import { renderHook, waitFor, act } from '@testing-library/react';
import { useEventOccurrences } from '../useEventOccurrences';
import { request } from '@/lib/graphql';

// Mock the GraphQL request function and graphql-request module
jest.mock('@/lib/graphql', () => ({
  request: jest.fn(),
}));

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn(),
  gql: jest.fn((strings, ...args) => strings.join('')),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('useEventOccurrences', () => {
  const mockClassId = 1;

  const mockEventData = {
    class_events: [{
      id: '1',
      start_date: '2024-12-01T10:00:00Z',
      end_date: '2024-12-01T12:00:00Z',
      is_cancelled: false,
      available_booking_slots: 5,
      max_booking_slots: 10,
      is_highlighted: true,
      participants_aggregate: {
        aggregate: {
          count: 5
        }
      },
      class: {
        id: 1,
        name: 'Test Class',
        description: 'A test class',
        image_url: 'https://example.com/image.jpg',
        location_name: 'Test Location',
        location_city: 'Test City',
        location_country: 'Test Country',
        event_type: 'Workshop',
        url_slug: 'test-class'
      }
    }, {
      id: '2',
      start_date: '2024-12-02T14:00:00Z',
      end_date: '2024-12-02T16:00:00Z',
      is_cancelled: false,
      available_booking_slots: 0,
      max_booking_slots: 8,
      is_highlighted: false,
      participants_aggregate: {
        aggregate: {
          count: 8
        }
      },
      class: {
        id: 1,
        name: 'Test Class',
        description: 'A test class',
        image_url: 'https://example.com/image.jpg',
        location_name: 'Test Location',
        location_city: 'Test City',
        location_country: 'Test Country',
        event_type: 'Workshop',
        url_slug: 'test-class'
      }
    }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch event occurrences successfully', async () => {
    mockRequest.mockResolvedValue(mockEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    // Initial loading state
    expect(result.current.loading).toBe(true);
    expect(result.current.eventOccurrences).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences).toHaveLength(2);
    expect(result.current.eventOccurrences[0]).toEqual({
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
    });
  });

  it('should handle empty class ID gracefully', async () => {
    const { result } = renderHook(() => useEventOccurrences(0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No class ID provided');
    expect(result.current.eventOccurrences).toEqual([]);
  });

  it('should handle no events found', async () => {
    mockRequest.mockResolvedValue({ class_events: [] });

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle GraphQL request errors', async () => {
    const mockError = new Error('Network error');
    mockRequest.mockRejectedValue(mockError);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.eventOccurrences).toEqual([]);
  });

  it('should handle missing optional fields gracefully', async () => {
    const incompleteEventData = {
      class_events: [{
        id: '1',
        start_date: '2024-12-01T10:00:00Z',
        end_date: '2024-12-01T12:00:00Z',
        is_cancelled: false,
        available_booking_slots: null,
        max_booking_slots: null,
        is_highlighted: false,
        participants_aggregate: {
          aggregate: {
            count: 0
          }
        },
        class: {
          id: 1,
          name: 'Test Class',
          description: 'A test class',
          image_url: null,
          location_name: null,
          location_city: null,
          location_country: null,
          event_type: 'Workshop',
          url_slug: 'test-class'
        }
      }]
    };

    mockRequest.mockResolvedValue(incompleteEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences[0]).toEqual({
      id: '1',
      startDate: '2024-12-01T10:00:00Z',
      endDate: '2024-12-01T12:00:00Z',
      isCancelled: false,
      availableSlots: undefined,
      maxSlots: undefined,
      isHighlighted: false,
      participantsCount: 0,
      class: {
        id: 1,
        name: 'Test Class',
        description: 'A test class',
        imageUrl: undefined,
        locationName: undefined,
        locationCity: undefined,
        locationCountry: undefined,
        eventType: 'Workshop',
        urlSlug: 'test-class'
      }
    });
  });

  it('should handle missing participants count gracefully', async () => {
    const eventDataWithoutParticipants = {
      class_events: [{
        ...mockEventData.class_events[0],
        participants_aggregate: null
      }]
    };

    mockRequest.mockResolvedValue(eventDataWithoutParticipants);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences[0].participantsCount).toBe(0);
  });

  it('should refetch data when refetch is called', async () => {
    mockRequest.mockResolvedValue(mockEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change the mock data for refetch
    const updatedEventData = {
      class_events: [{ ...mockEventData.class_events[0], id: '3' }]
    };
    mockRequest.mockResolvedValue(updatedEventData);

    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences[0].id).toBe('3');
    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it('should handle malformed GraphQL response', async () => {
    const malformedData = { class_events: null };

    mockRequest.mockResolvedValue(malformedData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should handle cancelled events correctly', async () => {
    const cancelledEventData = {
      class_events: [{
        ...mockEventData.class_events[0],
        is_cancelled: true
      }]
    };

    mockRequest.mockResolvedValue(cancelledEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences[0].isCancelled).toBe(true);
  });

  it('should handle events with no available slots', async () => {
    const fullEventData = {
      class_events: [{
        ...mockEventData.class_events[0],
        available_booking_slots: 0,
        max_booking_slots: 10
      }]
    };

    mockRequest.mockResolvedValue(fullEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences[0].availableSlots).toBe(0);
    expect(result.current.eventOccurrences[0].maxSlots).toBe(10);
  });
});
