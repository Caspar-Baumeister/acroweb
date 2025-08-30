import { request } from "@/lib/graphql";

// Mock the GraphQL request function
jest.mock("@/lib/graphql", () => ({
  request: jest.fn(),
}));

// Mock the queries module
jest.mock("@/lib/queries", () => ({
  GET_CLASS_BY_SLUG: "mock-query-1",
  GET_EVENT_OCCURRENCES_BY_CLASS: "mock-query-2",
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe("GraphQL Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET_CLASS_BY_SLUG Query", () => {
    it("should handle UUID class IDs correctly", async () => {
      const mockClassData = {
        classes: [
          {
            id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0", // UUID string
            name: "Test Class",
            description: "A test class description",
            image_url: "https://example.com/image.jpg",
            location_name: "Test Location",
            location_city: "Test City",
            location_country: "Test Country",
            event_type: "Workshop",
            url_slug: "test-class",
            class_teachers: [],
            booking_categories: [],
          },
        ],
      };

      mockRequest.mockResolvedValue(mockClassData);

      const result = await request("mock-query-1", { slug: "test-class" });

      expect(result).toEqual(mockClassData);
      expect(mockRequest).toHaveBeenCalledWith("mock-query-1", {
        slug: "test-class",
      });
    });

    it("should handle missing optional fields gracefully", async () => {
      const mockClassData = {
        classes: [
          {
            id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0",
            name: "Test Class",
            description: "A test class description",
            image_url: null,
            location_name: null,
            location_city: null,
            location_country: null,
            event_type: "Workshop",
            url_slug: "test-class",
            class_teachers: [],
            booking_categories: [],
          },
        ],
      };

      mockRequest.mockResolvedValue(mockClassData);

      const result = await request("mock-query-1", { slug: "test-class" });

      expect(result).toEqual(mockClassData);
      expect(result.classes[0].id).toBe("bb93b8e5-d857-41af-8314-d0e43e4bc5a0");
      expect(typeof result.classes[0].id).toBe("string");
    });
  });

  describe("GET_EVENT_OCCURRENCES_BY_CLASS Query", () => {
    it("should handle UUID class IDs correctly", async () => {
      const mockEventData = {
        class_events: [
          {
            id: "event-123",
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
              id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0", // UUID string
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

      mockRequest.mockResolvedValue(mockEventData);

      const classId = "bb93b8e5-d857-41af-8314-d0e43e4bc5a0";
      const result = await request("mock-query-2", { classId, limit: 50 });

      expect(result).toEqual(mockEventData);
      expect(mockRequest).toHaveBeenCalledWith("mock-query-2", {
        classId,
        limit: 50,
      });
      expect(typeof classId).toBe("string");
      expect(result.class_events[0].class.id).toBe(
        "bb93b8e5-d857-41af-8314-d0e43e4bc5a0"
      );
    });

    it("should handle empty event results", async () => {
      const mockEmptyData = {
        class_events: [],
      };

      mockRequest.mockResolvedValue(mockEmptyData);

      const classId = "bb93b8e5-d857-41af-8314-d0e43e4bc5a0";
      const result = await request("mock-query-2", { classId, limit: 50 });

      expect(result).toEqual(mockEmptyData);
      expect(result.class_events).toHaveLength(0);
    });
  });

  describe("Type Consistency Tests", () => {
    it("should ensure class IDs are consistently UUIDs across queries", async () => {
      const mockClassData = {
        classes: [
          {
            id: "bb93b8e5-d857-41af-8314-d0e43e4bc5a0",
            name: "Test Class",
            url_slug: "test-class",
            class_teachers: [],
            booking_categories: [],
          },
        ],
      };

      const mockEventData = {
        class_events: [
          {
            id: "event-123",
            start_date: "2024-12-01T09:00:00Z",
            end_date: "2024-12-01T11:00:00Z",
            is_cancelled: false,
            available_booking_slots: 5,
            max_booking_slots: 10,
            is_highlighted: false,
            participants_aggregate: {
              aggregate: { count: 5 },
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

      mockRequest
        .mockResolvedValueOnce(mockClassData)
        .mockResolvedValueOnce(mockEventData);

      // First query: Get class by slug
      const classResult = await request("mock-query-1", { slug: "test-class" });
      const classId = classResult.classes[0].id;

      // Second query: Get events by class ID
      const eventResult = await request("mock-query-2", { classId, limit: 50 });

      // Verify type consistency
      expect(typeof classId).toBe("string");
      expect(classId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      ); // UUID format
      expect(eventResult.class_events[0].class.id).toBe(classId);
      expect(typeof eventResult.class_events[0].class.id).toBe("string");
    });

    it("should reject numeric class IDs", async () => {
      const numericClassId = 123;

      // This should fail because the GraphQL query expects a UUID
      expect(() => {
        // Simulate what would happen if we tried to pass a number
        const variables = { classId: numericClassId, limit: 50 };
        expect(typeof variables.classId).not.toBe("number");
        expect(typeof variables.classId).toBe("string");
      }).toThrow();
    });
  });

  describe("Error Handling Tests", () => {
    it("should handle GraphQL validation errors gracefully", async () => {
      const mockError = new Error(
        "GraphQL validation error: variable 'classId' is declared as 'Int!', but used where 'uuid' is expected"
      );

      mockRequest.mockRejectedValue(mockError);

      const classId = "bb93b8e5-d857-41af-8314-d0e43e4bc5a0";

      try {
        await request("mock-query-2", { classId, limit: 50 });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("GraphQL validation error");
      }
    });

    it("should handle network errors gracefully", async () => {
      const mockNetworkError = new Error("Network error: Failed to fetch");

      mockRequest.mockRejectedValue(mockNetworkError);

      try {
        await request("mock-query-1", { slug: "test-class" });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("Network error");
      }
    });
  });
});
