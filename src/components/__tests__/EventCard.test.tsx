import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventCard, Event } from "../EventCard";

const mockEvent: Event = {
  id: "1",
  title: "Test Event",
  description: "This is a test event description",
  startDate: "2024-05-20T19:00:00",
  endDate: "2024-05-20T21:00:00",
  location: "Test Location",
  teacher: { name: "Test Teacher" },
  category: "Workshop",
  isBookable: true,
  isHighlighted: false,
  price: 50,
};

describe("EventCard", () => {
  it("renders event information correctly", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test event description")
    ).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("Test Teacher")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("Workshop")).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const { rerender } = render(
      <EventCard event={mockEvent} variant="compact" />
    );
    expect(screen.getByText("Test Event")).toBeInTheDocument();

    rerender(<EventCard event={mockEvent} variant="featured" />);
    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });

  it("shows highlighted badge when event is highlighted", () => {
    const highlightedEvent = { ...mockEvent, isHighlighted: true };
    render(<EventCard event={highlightedEvent} />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("calls onBook when book button is clicked", () => {
    const mockOnBook = jest.fn();
    render(<EventCard event={mockEvent} onBook={mockOnBook} />);

    const bookButton = screen.getByText("Book Now");
    fireEvent.click(bookButton);

    expect(mockOnBook).toHaveBeenCalledWith("1");
  });

  it("calls onViewDetails when details button is clicked", () => {
    const mockOnViewDetails = jest.fn();
    render(<EventCard event={mockEvent} onViewDetails={mockOnViewDetails} />);

    const detailsButton = screen.getByText("Details");
    fireEvent.click(detailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith("1");
  });

  it("does not show book button when event is not bookable", () => {
    const nonBookableEvent = { ...mockEvent, isBookable: false };
    render(<EventCard event={nonBookableEvent} />);

    expect(screen.queryByText("Book Now")).not.toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    render(<EventCard event={mockEvent} />);

    // Should show formatted date (May 20, 2024)
    expect(screen.getByText(/May 20/)).toBeInTheDocument();
  });

  it("applies correct category colors", () => {
    const { rerender } = render(<EventCard event={mockEvent} />);

    // Workshop should have blue colors
    const workshopBadge = screen.getByText("Workshop");
    expect(workshopBadge).toHaveClass("bg-blue-100", "text-blue-800");

    // Test Festival category
    const festivalEvent = { ...mockEvent, category: "Festival" as const };
    rerender(<EventCard event={festivalEvent} />);

    const festivalBadge = screen.getByText("Festival");
    expect(festivalBadge).toHaveClass("bg-purple-100", "text-purple-800");
  });

  it("handles missing teacher gracefully", () => {
    const eventWithoutTeacher = { ...mockEvent };
    delete eventWithoutTeacher.teacher;

    render(<EventCard event={eventWithoutTeacher} />);
    expect(screen.queryByText("Test Teacher")).not.toBeInTheDocument();
  });

  it("handles missing price gracefully", () => {
    const eventWithoutPrice = { ...mockEvent };
    delete eventWithoutPrice.price;

    render(<EventCard event={eventWithoutPrice} />);
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });
});
