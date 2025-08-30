"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, User, Plus } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle = () => console.log("Menu toggle"),
  onProfileClick = () => console.log("Profile click"),
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
            <Image
              src="/logo_play_store_512.png"
              alt="AcroWorld Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
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
            Shop
          </Button>
          <Button variant="ghost" className="text-sm">
            About
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
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
