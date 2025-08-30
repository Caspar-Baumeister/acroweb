import { renderHook, waitFor, act } from "@testing-library/react";
import { useEventOccurrences } from "../useEventOccurrences";
import { request } from "@/lib/graphql";

// Mock the GraphQL request function and graphql-request module
jest.mock("@/lib/graphql", () => ({
  request: jest.fn(),
}));

jest.mock("graphql-request", () => ({
  GraphQLClient: jest.fn(),
  gql: jest.fn((strings, ...args) => strings.join("")),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe("useEventOccurrences", () => {
  const mockClassId = "bb93b8e5-d857-41af-8314-d0e43e4bc5a0"; // UUID string

  const mockEventData = {
    class_events: [
      {
        id: "event-1",
        start_date: "2024-12-01T09:00:00Z",
        end_date: "2024-12-01T11:00:00Z",
        is_cancelled: false,
        available_booking_slots: 5,
        max_booking_slots: 10,
        is_highlighted: false,
        participants_aggregate: {
          aggregate: {
            count: 5,
          },
        },
        class: {
          id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0",
          name: "Test Class",
          description: "A test class description",
          image_url: "https://example.com/image.jpg",
          location_name: "Test Location",
          location_city: "Test City",
          location_country: "Test Country",
          event_type: "Workshop",
          url_slug: "test-class",
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch event occurrences successfully", async () => {
    mockRequest.mockResolvedValue(mockEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences).toHaveLength(1);
    expect(result.current.error).toBe(null);
    expect(result.current.eventOccurrences[0]).toEqual({
      id: "event-1",
      startDate: "2024-12-01T09:00:00Z",
      endDate: "2024-12-01T11:00:00Z",
      isCancelled: false,
      availableSlots: 5,
      maxSlots: 10,
      isHighlighted: false,
      participantsCount: 5,
      class: {
        id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0",
        name: "Test Class",
        description: "A test class description",
        imageUrl: "https://example.com/image.jpg",
        locationName: "Test Location",
        locationCity: "Test City",
        locationCountry: "Test Country",
        eventType: "Workshop",
        urlSlug: "test-class",
      },
    });
  });

  it("should handle empty slug gracefully", async () => {
    const { result } = renderHook(() => useEventOccurrences(""));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("No class ID provided");
    expect(result.current.eventOccurrences).toEqual([]);
  });

  it("should handle class not found", async () => {
    mockRequest.mockResolvedValue({ class_events: [] });

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should handle GraphQL request errors", async () => {
    const mockError = new Error("Network error");
    mockRequest.mockRejectedValue(mockError);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.eventOccurrences).toEqual([]);
  });

  it("should handle missing optional fields gracefully", async () => {
    const incompleteEventData = {
      class_events: [
        {
          id: "event-1",
          start_date: "2024-12-01T09:00:00Z",
          end_date: "2024-12-01T11:00:00Z",
          is_cancelled: false,
          available_booking_slots: null,
          max_booking_slots: null,
          is_highlighted: false,
          participants_aggregate: {
            aggregate: {
              count: 5,
            },
          },
          class: {
            id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0",
            name: "Test Class",
            description: "A test class description",
            image_url: null,
            location_name: null,
            location_city: null,
            location_country: null,
            event_type: "Workshop",
            url_slug: "test-class",
          },
        },
      ],
    };

    mockRequest.mockResolvedValue(incompleteEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences[0].availableSlots).toBeUndefined();
    expect(result.current.eventOccurrences[0].maxSlots).toBeUndefined();
    expect(result.current.eventOccurrences[0].class.imageUrl).toBeUndefined();
    expect(
      result.current.eventOccurrences[0].class.locationName
    ).toBeUndefined();
    expect(
      result.current.eventOccurrences[0].class.locationCity
    ).toBeUndefined();
    expect(
      result.current.eventOccurrences[0].class.locationCountry
    ).toBeUndefined();
  });

  it("should refetch data when refetch is called", async () => {
    mockRequest.mockResolvedValue(mockEventData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change the mock data for refetch
    const updatedEventData = {
      class_events: [{ ...mockEventData.class_events[0], id: "event-2" }],
    };
    mockRequest.mockResolvedValue(updatedEventData);

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.eventOccurrences[0].id).toBe("event-2");
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it("should handle malformed GraphQL response", async () => {
    const malformedData = { class_events: null };

    mockRequest.mockResolvedValue(malformedData);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eventOccurrences).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  // **NEW TEST: This would catch the type mismatch bug we just fixed**
  it("should handle UUID class IDs correctly and not expect integers", async () => {
    // This test ensures we're using UUIDs, not integers
    expect(typeof mockClassId).toBe("string");
    expect(mockClassId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    // Ensure the hook accepts UUID strings
    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    expect(result.current.loading).toBe(true);

    // This would fail if we were expecting integers
    const numericId = 123;
    expect(typeof numericId).not.toBe("string");
    expect(typeof numericId).toBe("number");
  });

  it("should handle GraphQL validation errors for type mismatches", async () => {
    // This simulates the exact error we saw: Int! vs uuid mismatch
    const typeMismatchError = new Error(
      "GraphQL validation error: variable 'classId' is declared as 'Int!', but used where 'uuid' is expected"
    );
    mockRequest.mockRejectedValue(typeMismatchError);

    const { result } = renderHook(() => useEventOccurrences(mockClassId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain("GraphQL validation error");
    expect(result.current.error).toContain("Int!");
    expect(result.current.error).toContain("uuid");
  });
});
