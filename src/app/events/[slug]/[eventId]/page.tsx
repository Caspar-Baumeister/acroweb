import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface EventOccurrencePageProps {
  params: {
    slug: string;
    eventId: string;
  };
}

export async function generateMetadata({ params }: EventOccurrencePageProps): Promise<Metadata> {
  return {
    title: `Event - ${params.slug} - ${params.eventId}`,
    description: `View details for specific event occurrence`,
  };
}

export default function EventOccurrencePage({ params }: EventOccurrencePageProps) {
  const { slug, eventId } = params;

  // TODO: Fetch specific event occurrence by ID
  // TODO: Handle loading and error states
  // TODO: Redirect to 404 if event not found

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Event Occurrence: {eventId}
          </h1>
          <p className="text-muted-foreground mt-2">
            From class: {slug}
          </p>
        </div>
        
        {/* TODO: EventDetailHeader component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Header Placeholder</h2>
          <p className="text-muted-foreground">
            This will contain the hero image, title, and description for the specific event.
          </p>
        </div>

        {/* TODO: EventOccurrenceCard component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Event Occurrence Details Placeholder</h2>
          <p className="text-muted-foreground">
            This will show detailed information about the specific event occurrence.
          </p>
        </div>

        {/* TODO: BookingInfo component */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Booking Information Placeholder</h2>
          <p className="text-muted-foreground">
            This will show availability, pricing, and booking options for this specific event.
          </p>
        </div>

        {/* TODO: Navigation back to class overview */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Placeholder</h2>
          <p className="text-muted-foreground">
            This will provide navigation back to the class overview and other event occurrences.
          </p>
        </div>
      </div>
    </div>
  );
}
