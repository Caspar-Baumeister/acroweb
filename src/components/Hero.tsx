import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";

interface HeroProps {
  onSearch?: (query: string) => void;
  onLocationChange?: (location: string) => void;
  onDateChange?: (date: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onLocationChange,
  onDateChange,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [date, setDate] = React.useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    if (onDateChange) {
      onDateChange(value);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Discover the World of
            <span className="text-primary block">Acro Yoga</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Connect with teachers, find workshops, and join a global community
            of acro practitioners
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-background rounded-2xl shadow-lg p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search for events, teachers, or workshops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Date Input */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-4">
              <Button
                onClick={handleSearch}
                size="lg"
                className="w-full md:w-auto px-8 h-12 text-base"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Events
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Events Worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Expert Teachers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Community Members</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button size="lg" className="px-8 py-3 text-base">
            Browse Events
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 text-base">
            Join Community
          </Button>
        </div>
      </div>
    </section>
  );
};
