import { renderHook, waitFor, act } from '@testing-library/react';
import { useClassDetails } from '../useClassDetails';
import { request } from '@/lib/graphql';

// Mock the GraphQL request function and graphql-request module
jest.mock('@/lib/graphql', () => ({
  request: jest.fn(),
}));

jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn(),
  gql: jest.fn((strings, ...args) => strings.join('')),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('useClassDetails', () => {
  const mockSlug = 'test-class';

  const mockClassData = {
    classes: [{
      id: 1,
      name: 'Test Class',
      description: 'A test class description',
      image_url: 'https://example.com/image.jpg',
      location_name: 'Test Location',
      location_city: 'Test City',
      location_country: 'Test Country',
      event_type: 'Workshop',
      url_slug: 'test-class',
      class_teachers: [{
        teacher: {
          id: 1,
          name: 'Test Teacher',
          url_slug: 'test-teacher',
          bio: 'A test teacher bio',
          images: [{
            image: { url: 'https://example.com/teacher.jpg' },
            is_profile_picture: true
          }]
        },
        is_owner: true
      }],
      booking_categories: [{
        id: 1,
        name: 'Standard',
        description: 'Standard booking',
        booking_options: [{
          id: 1,
          price: 50,
          currency: 'USD',
          title: 'Standard Ticket',
          subtitle: 'General admission'
        }]
      }]
    }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch class details successfully', async () => {
    mockRequest.mockResolvedValue(mockClassData);

    const { result } = renderHook(() => useClassDetails(mockSlug));

    // Initial loading state
    expect(result.current.loading).toBe(true);
    expect(result.current.classDetails).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.classDetails).toEqual({
      id: 1,
      name: 'Test Class',
      description: 'A test class description',
      imageUrl: 'https://example.com/image.jpg',
      locationName: 'Test Location',
      locationCity: 'Test City',
      locationCountry: 'Test Country',
      eventType: 'Workshop',
      urlSlug: 'test-class',
      teachers: [{
        id: 1,
        name: 'Test Teacher',
        urlSlug: 'test-teacher',
        bio: 'A test teacher bio',
        imageUrl: 'https://example.com/teacher.jpg',
        isOwner: true
      }],
      bookingCategories: [{
        id: 1,
        name: 'Standard',
        description: 'Standard booking',
        bookingOptions: [{
          id: 1,
          price: 50,
          currency: 'USD',
          title: 'Standard Ticket',
          subtitle: 'General admission'
        }]
      }]
    });
  });

  it('should handle empty slug gracefully', async () => {
    const { result } = renderHook(() => useClassDetails(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('No slug provided');
    expect(result.current.classDetails).toBe(null);
  });

  it('should handle class not found', async () => {
    mockRequest.mockResolvedValue({ classes: [] });

    const { result } = renderHook(() => useClassDetails(mockSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Class not found');
    expect(result.current.classDetails).toBe(null);
  });

  it('should handle GraphQL request errors', async () => {
    const mockError = new Error('Network error');
    mockRequest.mockRejectedValue(mockError);

    const { result } = renderHook(() => useClassDetails(mockSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.classDetails).toBe(null);
  });

  it('should handle missing optional fields gracefully', async () => {
    const incompleteClassData = {
      classes: [{
        id: 1,
        name: 'Test Class',
        description: 'A test class description',
        image_url: null,
        location_name: null,
        location_city: null,
        location_country: null,
        event_type: 'Workshop',
        url_slug: 'test-class',
        class_teachers: [],
        booking_categories: []
      }]
    };

    mockRequest.mockResolvedValue(incompleteClassData);

    const { result } = renderHook(() => useClassDetails(mockSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.classDetails).toEqual({
      id: 1,
      name: 'Test Class',
      description: 'A test class description',
      imageUrl: undefined,
      locationName: undefined,
      locationCity: undefined,
      locationCountry: undefined,
      eventType: 'Workshop',
      urlSlug: 'test-class',
      teachers: [],
      bookingCategories: []
    });
  });

  it('should handle missing teacher images gracefully', async () => {
    const classDataWithoutImages = {
      classes: [{
        ...mockClassData.classes[0],
        class_teachers: [{
          teacher: {
            id: 1,
            name: 'Test Teacher',
            url_slug: 'test-teacher',
            bio: 'A test teacher bio',
            images: []
          },
          is_owner: true
        }]
      }]
    };

    mockRequest.mockResolvedValue(classDataWithoutImages);

    const { result } = renderHook(() => useClassDetails(mockSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.classDetails?.teachers[0].imageUrl).toBeUndefined();
  });

  it('should refetch data when refetch is called', async () => {
    mockRequest.mockResolvedValue(mockClassData);

    const { result } = renderHook(() => useClassDetails(mockSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Change the mock data for refetch
    const updatedClassData = {
      classes: [{ ...mockClassData.classes[0], name: 'Updated Class Name' }]
    };
    mockRequest.mockResolvedValue(updatedClassData);

    act(() => {
      result.current.refetch();
    });

    // The loading state should be true immediately after refetch
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.classDetails?.name).toBe('Updated Class Name');
    expect(mockRequest).toHaveBeenCalledTimes(2);
  });

  it('should handle malformed GraphQL response', async () => {
    const malformedData = { classes: null };

    mockRequest.mockResolvedValue(malformedData);

    const { result } = renderHook(() => useClassDetails(mockSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Class not found');
    expect(result.current.classDetails).toBe(null);
  });
});
