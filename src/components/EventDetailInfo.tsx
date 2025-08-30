import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  urlSlug: string;
  imageUrl?: string;
  isOwner: boolean;
}

interface EventDetailInfoProps {
  teachers: Teacher[];
  locationName?: string;
  locationCity?: string;
  locationCountry?: string;
  eventType: string;
  totalEvents: number;
  upcomingEvents: number;
}

export const EventDetailInfo: React.FC<EventDetailInfoProps> = ({
  teachers,
  locationName,
  locationCity,
  locationCountry,
  eventType,
  totalEvents,
  upcomingEvents,
}) => {
  const formatLocation = () => {
    const parts = [];
    if (locationName) parts.push(locationName);
    if (locationCity) parts.push(locationCity);
    if (locationCountry) parts.push(locationCountry);

    return parts.length > 0 ? parts.join(", ") : "Location TBD";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Teachers Section */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Teachers
        </h2>
        <div className="space-y-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
            >
              {teacher.imageUrl && (
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{teacher.name}</h3>
                  {teacher.isOwner && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      Lead Teacher
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm italic">
                  Bio coming soon...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location & Stats Section */}
      <div className="space-y-6">
        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </h2>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">{formatLocation()}</p>
          </div>
        </div>

        {/* Event Type */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Type
          </h2>
          <div className="p-4 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="text-base px-3 py-1">
              {eventType}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{totalEvents}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">
                {upcomingEvents}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
