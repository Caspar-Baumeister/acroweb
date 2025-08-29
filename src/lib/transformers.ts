import type { EventOccurrence } from "./graphql";
import type { Event } from "@/components/EventCard";

export const transformEventOccurrence = (
  eventOccurrence: EventOccurrence
): Event => {
  const { class: classData } = eventOccurrence;

  // Get the main teacher (owner)
  const mainTeacher = classData.class_teachers.find((ct) => ct.is_owner);
  const teacherName = mainTeacher?.teacher.name || "Unknown Teacher";

  // Get the first available image
  const teacherImage =
    mainTeacher?.teacher.images.find((img) => img.is_profile_picture)?.image
      .url || mainTeacher?.teacher.images[0]?.image.url;

  // Get the first available price
  const firstCategory = classData.booking_categories[0];
  const firstOption = firstCategory?.booking_options[0];
  const price = firstOption?.price;
  const currency = firstOption?.currency || "USD";

  // Determine if event is bookable
  const isBookable =
    eventOccurrence.available_booking_slots > 0 &&
    !eventOccurrence.is_cancelled;

  // Map event type to category
  const getCategory = (
    eventType: string
  ): "Festival" | "Workshop" | "Class" => {
    switch (eventType.toLowerCase()) {
      case "festival":
        return "Festival";
      case "workshop":
        return "Workshop";
      default:
        return "Class";
    }
  };

  // Format location
  const location = [classData.location_city, classData.location_country]
    .filter(Boolean)
    .join(", ");

  return {
    id: eventOccurrence.id,
    title: classData.name,
    description: classData.description || "No description available",
    startDate: eventOccurrence.start_date,
    endDate: eventOccurrence.end_date,
    location: location || classData.location_name || "Location TBD",
    teacher: {
      name: teacherName,
      imageUrl: teacherImage,
    },
    category: getCategory(classData.event_type),
    isBookable,
    isHighlighted: eventOccurrence.is_highlighted,
    price: price,
    imageUrl: classData.image_url,
    availableSlots: eventOccurrence.available_booking_slots,
    maxSlots: eventOccurrence.max_booking_slots,
    participantsCount: eventOccurrence.participants_aggregate.aggregate.count,
  };
};
