import { useState, useEffect } from "react";
import { request } from "@/lib/graphql";
import { GET_CLASS_BY_SLUG } from "@/lib/queries";

export interface ClassDetails {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  locationName?: string;
  locationCity?: string;
  locationCountry?: string;
  eventType: string;
  urlSlug: string;
  teachers: Array<{
    id: string;
    name: string;
    urlSlug: string;
    imageUrl?: string;
    isOwner: boolean;
  }>;
  bookingCategories: Array<{
    id: string;
    name: string;
    description: string;
    bookingOptions: Array<{
      id: string;
      price: number;
      currency: string;
      title: string;
      subtitle?: string;
    }>;
  }>;
}

interface UseClassDetailsReturn {
  classDetails: ClassDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClassDetails(slug: string): UseClassDetailsReturn {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassDetails = async () => {
    if (!slug) {
      setError("No slug provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const variables = { slug };
      const data = await request(GET_CLASS_BY_SLUG, variables);

      if (data.classes && data.classes.length > 0) {
        const classData = data.classes[0];

        // Transform the raw GraphQL data to our interface
        const transformedClass: ClassDetails = {
          id: classData.id,
          name: classData.name,
          description: classData.description,
          imageUrl: classData.image_url ?? undefined,
          locationName: classData.location_name ?? undefined,
          locationCity: classData.location_city ?? undefined,
          locationCountry: classData.location_country ?? undefined,
          eventType: classData.event_type,
          urlSlug: classData.url_slug,
          teachers: classData.class_teachers.map((ct: any) => ({
            id: ct.teacher.id,
            name: ct.teacher.name,
            urlSlug: ct.teacher.url_slug,
            imageUrl: ct.teacher.images?.[0]?.image?.url,
            isOwner: ct.is_owner,
          })),
          bookingCategories: classData.booking_categories.map((bc: any) => ({
            id: bc.id,
            name: bc.name,
            description: bc.description,
            bookingOptions: bc.booking_options.map((bo: any) => ({
              id: bo.id,
              price: bo.price,
              currency: bo.currency,
              title: bo.title,
              subtitle: bo.subtitle,
            })),
          })),
        };

        setClassDetails(transformedClass);
      } else {
        setError("Class not found");
      }
    } catch (err) {
      console.error("Error fetching class details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch class details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [slug]);

  const refetch = () => {
    setLoading(true);
    fetchClassDetails();
  };

  return {
    classDetails,
    loading,
    error,
    refetch,
  };
}
