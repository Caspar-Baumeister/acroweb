import type { EventOccurrence } from "./graphql";
import type { Event } from "@/components/EventCard";

export const transformEventOccurrence = (
  eventOccurrence: EventOccurrence
): Event => {
  const { class: classData } = eventOccurrence;

  // Get the main teacher (owner) or first available teacher
  let mainTeacher = classData.class_teachers.find((ct) => ct.is_owner);
  if (!mainTeacher && classData.class_teachers.length > 0) {
    mainTeacher = classData.class_teachers[0];
  }

  // Better teacher name handling with fallbacks
  let teacherName = "Unknown Teacher";
  if (mainTeacher?.teacher?.name) {
    teacherName = mainTeacher.teacher.name;
  } else if (classData.class_teachers.length > 0) {
    // Try to get any teacher name
    const anyTeacher = classData.class_teachers.find((ct) => ct.teacher?.name);
    if (anyTeacher?.teacher?.name) {
      teacherName = anyTeacher.teacher.name;
    }
  }

  // Get the first available image
  const teacherImage =
    mainTeacher?.teacher.images.find((img) => img.is_profile_picture)?.image
      .url || mainTeacher?.teacher.images[0]?.image.url;
  ent;

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
    if (!eventType) return "Class";

    switch (eventType.toLowerCase()) {
      case "festival":
        return "Festival";
      case "workshop":
        return "Workshop";
      default:
        return "Class";
    }
  };

  // Format location with better fallbacks
  let location = "Location TBD";
  if (classData.location_name && classData.location_name.trim()) {
    location = classData.location_name;
  } else if (classData.location_city || classData.location_country) {
    location = [classData.location_city, classData.location_country]
      .filter(Boolean)
      .join(", ");
  }

  return {
    id: eventOccurrence.id,
    title: classData.name || "Untitled Event",
    description: classData.description || "No description available",
    startDate: eventOccurrence.start_date,
    endDate: eventOccurrence.end_date,
    location,
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
