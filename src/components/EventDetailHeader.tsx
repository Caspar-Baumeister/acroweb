import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EventDetailHeaderProps {
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  isHighlighted?: boolean;
}

export const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({
  title,
  description,
  imageUrl,
  category,
  isHighlighted = false,
}) => {
  return (
    <div className="relative mb-8">
      {/* Hero Image */}
      {imageUrl && (
        <div className="relative h-80 w-full rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="secondary"
                className="bg-primary/90 text-primary-foreground border-0"
              >
                {category}
              </Badge>
              {isHighlighted && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            
            <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      )}
      
      {/* Fallback when no image */}
      {!imageUrl && (
        <div className="bg-card rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge
              variant="secondary"
              className="bg-primary/90 text-primary-foreground border-0"
            >
              {category}
            </Badge>
            {isHighlighted && (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              >
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
