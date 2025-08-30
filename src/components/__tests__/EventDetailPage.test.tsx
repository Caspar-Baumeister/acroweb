import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useClassDetails } from "@/hooks/useClassDetails";
import { useEventOccurrences } from "@/hooks/useEventOccurrences";
import { useEventSelection } from "@/hooks/useEventSelection";
import EventDetailPage from "@/app/events/[slug]/page";

// Mock the GraphQL module
jest.mock("@/lib/graphql", () => ({
  request: jest.fn(),
}));

// Mock the queries module
jest.mock("@/lib/queries", () => ({
  GET_CLASS_BY_SLUG: "mock-query",
  GET_EVENT_OCCURRENCES_BY_CLASS: "mock-query",
}));

// Mock the hooks
jest.mock("@/hooks/useClassDetails");
jest.mock("@/hooks/useEventOccurrences");
jest.mock("@/hooks/useEventSelection");

// Mock the problematic components
jest.mock("@/components/EventCalendar", () => ({
  EventCalendar: ({ className }: { className?: string }) => (
    <div data-testid="event-calendar" className={className}>
      Mocked Calendar Component
    </div>
  ),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

const mockUseClassDetails = useClassDetails as jest.MockedFunction<
  typeof useClassDetails
>;
const mockUseEventOccurrences = useEventOccurrences as jest.MockedFunction<
  typeof useEventOccurrences
>;
const mockUseEventSelection = useEventSelection as jest.MockedFunction<
  typeof useEventSelection
>;

describe("EventDetailPage", () => {
  const mockParams = { slug: "test-event" };

  const mockClassDetails = {
    id: 1,
    name: "Test Event",
    description: "A test event description",
    imageUrl: "https://example.com/image.jpg",
    locationName: "Test Location",
    locationCity: "Test City",
    locationCountry: "Test Country",
    eventType: "Workshop",
    urlSlug: "test-event",
    teachers: [
      {
        id: 1,
        name: "Test Teacher",
        urlSlug: "test-teacher",
        imageUrl: "https://example.com/teacher.jpg",
        isOwner: true,
      },
    ],
    bookingCategories: [
      {
        id: 1,
        name: "Standard",
        description: "Standard booking",
        bookingOptions: [
          {
            id: 1,
            price: 50,
            currency: "USD",
            title: "Standard Ticket",
            subtitle: "General admission",
          },
        ],
      },
    ],
  };

  const mockEventOccurrences = [
    {
      id: "1",
      startDate: "2024-12-01T09:00:00Z",
      endDate: "2024-12-01T11:00:00Z",
      isCancelled: false,
      availableSlots: 5,
      maxSlots: 10,
      isHighlighted: false,
      participantsCount: 5,
      isBookable: true,
      class: {
        id: 1,
        name: "Test Event",
        description: "A test event description",
        imageUrl: "https://example.com/image.jpg",
        locationName: "Test Location",
        locationCity: "Test City",
        locationCountry: "Test Country",
        eventType: "Workshop",
        urlSlug: "test-event",
      },
    },
  ];

  const mockSelectedEvent = mockEventOccurrences[0];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseClassDetails.mockReturnValue({
      classDetails: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventSelection.mockReturnValue({
      selectedEvent: null,
      setSelectedEvent: jest.fn(),
      selectNextUpcomingEvent: jest.fn(),
      selectEventById: jest.fn(),
    });
  });

  it("should show loading skeleton initially", () => {
    render(<EventDetailPage params={mockParams} />);

    // Check for skeleton loading UI
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("should render successfully with data", async () => {
    mockUseClassDetails.mockReturnValue({
      classDetails: mockClassDetails,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: mockEventOccurrences,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventSelection.mockReturnValue({
      selectedEvent: mockSelectedEvent,
      setSelectedEvent: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();
    });

    // Check that the main content is rendered
    expect(
      screen.getByRole("heading", { name: "Test Event", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText("A test event description")).toBeInTheDocument();
    expect(screen.getByText("Test Teacher")).toBeInTheDocument();
    expect(screen.getByText("Lead Teacher")).toBeInTheDocument();
    expect(
      screen.getByText("Test Location, Test City, Test Country")
    ).toBeInTheDocument();
    expect(screen.getByText("Workshop")).toBeInTheDocument();
  });

  it("should show error when class details fail to load", async () => {
    mockUseClassDetails.mockReturnValue({
      classDetails: null,
      loading: false,
      error: "Failed to fetch class details",
      refetch: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Class")).toBeInTheDocument();
      expect(
        screen.getByText("Failed to fetch class details")
      ).toBeInTheDocument();
      expect(screen.getByText("Go Back")).toBeInTheDocument();
    });
  });

  it("should show error when event occurrences fail to load", async () => {
    mockUseClassDetails.mockReturnValue({
      classDetails: mockClassDetails,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: [],
      loading: false,
      error: "Failed to fetch events",
      refetch: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Events")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch events")).toBeInTheDocument();
      expect(screen.getByText("Go Back")).toBeInTheDocument();
    });
  });

  it("should show calendar and event selection when data is available", async () => {
    mockUseClassDetails.mockReturnValue({
      classDetails: mockClassDetails,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: mockEventOccurrences,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventSelection.mockReturnValue({
      selectedEvent: mockSelectedEvent,
      setSelectedEvent: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();
    });

    // Check that calendar and event details are shown
    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
    expect(screen.getByText("Selected Event Details")).toBeInTheDocument();
    expect(screen.getByText("Booking Information")).toBeInTheDocument();
  });

  it("should display teacher information correctly", async () => {
    mockUseClassDetails.mockReturnValue({
      classDetails: mockClassDetails,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: mockEventOccurrences,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventSelection.mockReturnValue({
      selectedEvent: mockSelectedEvent,
      setSelectedEvent: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();
    });

    // Check teacher details
    expect(screen.getByText("Test Teacher")).toBeInTheDocument();
    expect(screen.getByText("Lead Teacher")).toBeInTheDocument();
    expect(screen.getByText("Bio coming soon...")).toBeInTheDocument();
  });

  it("should display location information correctly", async () => {
    mockUseClassDetails.mockReturnValue({
      classDetails: mockClassDetails,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: mockEventOccurrences,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventSelection.mockReturnValue({
      selectedEvent: mockSelectedEvent,
      setSelectedEvent: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Check location details
    expect(
      screen.getByText("Test Location, Test City, Test Country")
    ).toBeInTheDocument();
  });

  it("should handle missing optional fields gracefully", async () => {
    const incompleteClassDetails = {
      ...mockClassDetails,
      imageUrl: undefined,
      locationName: undefined,
      locationCity: undefined,
      locationCountry: undefined,
      teachers: [],
    };

    mockUseClassDetails.mockReturnValue({
      classDetails: incompleteClassDetails,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventOccurrences.mockReturnValue({
      eventOccurrences: mockEventOccurrences,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseEventSelection.mockReturnValue({
      selectedEvent: mockSelectedEvent,
      setSelectedEvent: jest.fn(),
    });

    render(<EventDetailPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();
    });

    // Should still render without crashing
    expect(
      screen.getByRole("heading", { name: "Test Event", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText("A test event description")).toBeInTheDocument();
  });
});
