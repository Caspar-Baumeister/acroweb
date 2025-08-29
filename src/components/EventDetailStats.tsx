import React from 'react';
import { Users, Calendar, Clock, MapPin } from 'lucide-react';

interface EventDetailStatsProps {
  totalEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  averageDuration?: number; // in hours
  locationCount?: number;
}

export const EventDetailStats: React.FC<EventDetailStatsProps> = ({
  totalEvents,
  upcomingEvents,
  totalParticipants,
  averageDuration,
  locationCount = 1,
}) => {
  const stats = [
    {
      label: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Total Participants',
      value: totalParticipants,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Locations',
      value: locationCount,
      icon: MapPin,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  if (averageDuration) {
    stats.push({
      label: 'Avg Duration',
      value: `${averageDuration}h`,
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    });
  }

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Event Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 text-center transition-transform hover:scale-105`}
            >
              <div className={`${stat.color} mb-2 flex justify-center`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Additional insights */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Event Frequency</p>
            <p className="text-lg font-semibold">
              {totalEvents > 0 ? Math.round((upcomingEvents / totalEvents) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">are upcoming</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Average Attendance</p>
            <p className="text-lg font-semibold">
              {totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0}
            </p>
            <p className="text-xs text-muted-foreground">per event</p>
          </div>
        </div>
      </div>
    </div>
  );
};
