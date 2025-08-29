import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface EventDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  return {
    title: `Event Details - ${params.slug}`,
    description: `View details and upcoming events for ${params.slug}`,
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = params;

  // TODO: Fetch class details by slug
  // TODO: Handle loading and error states
  // TODO: Redirect to 404 if class not found

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Event Details: {slug}
          </h1>
          <p className="text-muted-foreground mt-2">
            This page is under construction. Coming soon with beautiful calendar and booking functionality!
          </p>
        </div>
        
        {/* TODO: EventDetailHeader component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Header Placeholder</h2>
          <p className="text-muted-foreground">
            This will contain the hero image, title, and description.
          </p>
        </div>

        {/* TODO: EventDetailInfo component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Information Placeholder</h2>
          <p className="text-muted-foreground">
            This will contain teacher details, location, and category information.
          </p>
        </div>

        {/* TODO: EventCalendar component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Calendar Placeholder</h2>
          <p className="text-muted-foreground">
            This will contain the beautiful shadcn calendar with upcoming events.
          </p>
        </div>

        {/* TODO: EventOccurrenceCard component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Event Details Placeholder</h2>
          <p className="text-muted-foreground">
            This will show details of the selected event occurrence.
          </p>
        </div>

        {/* TODO: BookingInfo component */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Information Placeholder</h2>
          <p className="text-muted-foreground">
            This will show availability, pricing, and booking options.
          </p>
        </div>
      </div>
    </div>
  );
}
