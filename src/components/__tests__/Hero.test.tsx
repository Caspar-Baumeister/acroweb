import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "../Hero";

describe("Hero", () => {
  const mockProps = {
    onSearch: jest.fn(),
    onLocationChange: jest.fn(),
    onDateChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main heading", () => {
    render(<Hero {...mockProps} />);

    expect(screen.getByText("Discover the World of")).toBeInTheDocument();
    expect(screen.getByText("Acro Yoga")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<Hero {...mockProps} />);

    expect(
      screen.getByText(
        /Connect with teachers, find workshops, and join a global community/
      )
    ).toBeInTheDocument();
  });

  it("renders search inputs", () => {
    render(<Hero {...mockProps} />);

    expect(
      screen.getByPlaceholderText(
        "Search for events, teachers, or workshops..."
      )
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();

    const inputs = screen.getAllByDisplayValue("");
    const dateInput = inputs.find(
      (input) => input.getAttribute("type") === "date"
    );
    expect(dateInput).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(<Hero {...mockProps} />);

    const searchButton = screen.getByRole("button", { name: /Find Events/i });
    expect(searchButton).toBeInTheDocument();
  });

  it("renders stats section", () => {
    render(<Hero {...mockProps} />);

    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("Events Worldwide")).toBeInTheDocument();
    expect(screen.getByText("100+")).toBeInTheDocument();
    expect(screen.getByText("Expert Teachers")).toBeInTheDocument();
    expect(screen.getByText("10K+")).toBeInTheDocument();
    expect(screen.getByText("Community Members")).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<Hero {...mockProps} />);

    expect(
      screen.getByRole("button", { name: /Browse Events/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Join Community/i })
    ).toBeInTheDocument();
  });

  it("calls onSearch when search button is clicked", () => {
    render(<Hero {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(
      "Search for events, teachers, or workshops..."
    );
    const searchButton = screen.getByRole("button", { name: /Find Events/i });

    fireEvent.change(searchInput, { target: { value: "yoga workshop" } });
    fireEvent.click(searchButton);

    expect(mockProps.onSearch).toHaveBeenCalledWith("yoga workshop");
  });

  it("calls onLocationChange when location input changes", () => {
    render(<Hero {...mockProps} />);

    const locationInput = screen.getByPlaceholderText("Location");
    fireEvent.change(locationInput, { target: { value: "Berlin" } });

    expect(mockProps.onLocationChange).toHaveBeenCalledWith("Berlin");
  });

  it("calls onDateChange when date input changes", () => {
    render(<Hero {...mockProps} />);

    const inputs = screen.getAllByDisplayValue("");
    const dateInput = inputs.find(
      (input) => input.getAttribute("type") === "date"
    );
    expect(dateInput).toBeInTheDocument();

    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: "2024-06-15" } });
      expect(mockProps.onDateChange).toHaveBeenCalledWith("2024-06-15");
    }
  });

  it("handles search with empty query", () => {
    render(<Hero {...mockProps} />);

    const searchButton = screen.getByRole("button", { name: /Find Events/i });
    fireEvent.click(searchButton);

    expect(mockProps.onSearch).toHaveBeenCalledWith("");
  });

  it("renders with responsive design classes", () => {
    render(<Hero {...mockProps} />);

    const container = screen
      .getByText("Discover the World of")
      .closest("section");
    expect(container).toHaveClass("py-20");

    const heading = screen.getByText("Discover the World of");
    expect(heading).toHaveClass("text-4xl", "md:text-6xl");
  });

  it("renders search form with proper structure", () => {
    render(<Hero {...mockProps} />);

    const searchForm = screen
      .getByPlaceholderText("Search for events, teachers, or workshops...")
      .closest("div");
    expect(searchForm).toHaveClass("relative");

    // Find the search container by looking for the parent that has the background styling
    const searchContainer = screen
      .getByPlaceholderText("Search for events, teachers, or workshops...")
      .closest("div")?.parentElement?.parentElement?.parentElement;
    expect(searchContainer).toHaveClass(
      "bg-background",
      "rounded-2xl",
      "shadow-lg"
    );
  });
});
