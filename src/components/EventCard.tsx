import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock, Users } from "lucide-react";

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  teacher: {
    name: string;
    imageUrl?: string;
  };
  category: "Festival" | "Workshop" | "Class";
  isBookable: boolean;
  isHighlighted: boolean;
  price?: number;
  imageUrl?: string;
  availableSlots?: number;
  maxSlots?: number;
  participantsCount?: number;
}

interface EventCardProps {
  event: Event;
  onBook?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  variant?: "default" | "compact" | "featured";
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onBook,
  onViewDetails,
  variant = "default",
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Festival":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Workshop":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Class":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return `$${price}`;
  };

  const formatSlots = (available?: number, max?: number) => {
    if (available === undefined || max === undefined) return null;
    return `${available}/${max} slots available`;
  };

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex">
          {/* Image section */}
          {event.imageUrl && (
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>
          )}
          {/* Content section */}
          <div className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge
                    variant="secondary"
                    className={getCategoryColor(event.category)}
                  >
                    {event.category}
                  </Badge>
                  {event.isHighlighted && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.startDate)}</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{formatTime(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{event.teacher.name}</span>
              </div>
              {event.availableSlots !== undefined &&
                event.maxSlots !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{formatSlots(event.availableSlots, event.maxSlots)}</span>
                  </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-3">
              <div className="flex items-center gap-2">
                {formatPrice(event.price) && (
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(event.price)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {onViewDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(event.id)}
                  >
                    Details
                  </Button>
                )}
                {event.isBookable && onBook && (
                  <Button size="sm" onClick={() => onBook(event.id)}>
                    Book Now
                  </Button>
                )}
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
        {event.imageUrl && (
          <div className="relative h-48 w-full">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                {event.category}
              </Badge>
              {event.isHighlighted && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  Featured
                </Badge>
              )}
            </div>
          </div>
        )}
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {event.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{event.teacher.name}</span>
          </div>
          {event.availableSlots !== undefined &&
            event.maxSlots !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{formatSlots(event.availableSlots, event.maxSlots)}</span>
              </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-3">
          <div className="flex items-center gap-2">
            {formatPrice(event.price) && (
              <span className="text-lg font-semibold text-primary">
                {formatPrice(event.price)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(event.id)}
              >
                Details
              </Button>
            )}
            {event.isBookable && onBook && (
              <Button size="sm" onClick={() => onBook(event.id)}>
                Book Now
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {event.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <Badge
              variant="secondary"
              className={getCategoryColor(event.category)}
            >
              {event.category}
            </Badge>
            {event.isHighlighted && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              >
                Featured
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.startDate)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{formatTime(event.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{event.teacher.name}</span>
        </div>
        {event.availableSlots !== undefined && event.maxSlots !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{formatSlots(event.availableSlots, event.maxSlots)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3">
        <div className="flex items-center gap-2">
          {formatPrice(event.price) && (
            <span className="text-lg font-semibold text-primary">
              {formatPrice(event.price)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(event.id)}
            >
              Details
            </Button>
          )}
          {event.isBookable && onBook && (
            <Button size="sm" onClick={() => onBook(event.id)}>
              Book Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
