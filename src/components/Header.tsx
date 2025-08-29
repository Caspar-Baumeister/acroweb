import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, User, Globe } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onSearchClick,
  onProfileClick,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">AcroWorld</h1>
              <p className="text-xs text-muted-foreground">Community Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-sm">
            Events
          </Button>
          <Button variant="ghost" className="text-sm">
            Teachers
          </Button>
          <Button variant="ghost" className="text-sm">
            Community
          </Button>
          <Button variant="ghost" className="text-sm">
            About
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="hidden sm:flex"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={onProfileClick}>
            <User className="h-5 w-5" />
          </Button>

          <Button size="sm" className="hidden sm:flex">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};
