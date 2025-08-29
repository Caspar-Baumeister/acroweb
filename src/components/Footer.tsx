import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-bold text-primary">AcroWorld</h3>
                <p className="text-sm text-muted-foreground">Community Hub</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The central hub for the global acro yoga community. Connect with
              teachers, discover events, and build meaningful relationships with
              fellow practitioners.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
              <Button variant="outline" size="sm">
                About
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Events
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Teachers
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Workshops
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Festivals
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Community
                </Button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Safety Guidelines
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="h-auto p-0 justify-start text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  hello@acroworld.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-sm text-muted-foreground">
                  Global Community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Youtube className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2024 AcroWorld. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Built with ❤️ for the acro yoga community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
