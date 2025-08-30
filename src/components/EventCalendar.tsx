import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { EventOccurrence } from "@/hooks/useEventOccurrences";
import { format, isSameDay, parseISO } from "date-fns";

interface EventCalendarProps {
  events: EventOccurrence[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  selectedDate,
  onDateSelect,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    try {
      const dateKey = format(parseISO(event.startDate), "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
    } catch (error) {
      console.error("Error parsing event date:", event.startDate, error);
    }
    return acc;
  }, {} as Record<string, EventOccurrence[]>);

  // Debug logging
  console.log("EventCalendar received events:", events);
  console.log("Events grouped by date:", eventsByDate);

  // Custom day renderer to show event indicators
  const renderDay = (day: Date, modifiers: any) => {
    // Validate that day is a valid Date object
    if (!day || isNaN(day.getTime())) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">-</span>
        </div>
      );
    }

    const dateKey = format(day, "yyyy-MM-dd");
    const dayEvents = eventsByDate[dateKey] || [];
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isToday = isSameDay(day, new Date());

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-sm",
            isSelected && "font-bold text-primary-foreground",
            isToday && !isSelected && "font-bold text-accent-foreground"
          )}
        >
          {format(day, "d")}
        </span>

        {/* Event indicators */}
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  event.isHighlighted ? "bg-yellow-400" : "bg-primary",
                  event.isCancelled && "bg-destructive"
                )}
                title={`${event.class.name} - ${format(
                  parseISO(event.startDate),
                  "HH:mm"
                )}`}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            )}
          </div>
        )}
      </div>
    );
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isNaN(date.getTime()) && onDateSelect) {
      onDateSelect(date);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): EventOccurrence[] => {
    // Validate that date is a valid Date object
    if (!date || isNaN(date.getTime())) {
      return [];
    }
    const dateKey = format(date, "yyyy-MM-dd");
    return eventsByDate[dateKey] || [];
  };

  // Get selected date events
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className={className}>
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Event Calendar</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{events.length} Events</Badge>
            <Badge variant="outline">{format(currentMonth, "MMMM yyyy")}</Badge>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            classNames={{
              day: "relative w-9 h-9 p-0",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
            }}
            components={{
              Day: ({ date, ...props }) => renderDay(date, props),
            }}
          />
        </div>

        {/* Selected Date Events */}
        {selectedDate &&
          !isNaN(selectedDate.getTime()) &&
          selectedDateEvents.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">
                Events on {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      event.isCancelled
                        ? "bg-muted/50 border-destructive/20"
                        : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            event.isCancelled &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {event.class.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(event.startDate), "HH:mm")} -{" "}
                          {format(parseISO(event.endDate), "HH:mm")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.isHighlighted && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Featured
                          </Badge>
                        )}
                        {event.isCancelled && (
                          <Badge variant="destructive">Cancelled</Badge>
                        )}
                        {event.availableSlots !== undefined &&
                          event.maxSlots !== undefined && (
                            <Badge variant="outline">
                              {event.availableSlots}/{event.maxSlots} slots
                            </Badge>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* No Events Message */}
        {selectedDate && selectedDateEvents.length === 0 && (
          <div className="border-t pt-4 text-center text-muted-foreground">
            <p>No events scheduled for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for conditional classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
