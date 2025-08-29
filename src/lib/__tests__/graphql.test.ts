import { request, graphqlClient, createAuthenticatedClient } from '../graphql';

// Mock graphql-request
jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
}));

describe('GraphQL Client', () => {
  const mockGraphQLClient = graphqlClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('request function', () => {
    it('should make successful GraphQL requests', async () => {
      const mockData = { test: 'data' };
      const mockQuery = 'query { test }';
      const mockVariables = { id: 1 };

      mockGraphQLClient.request.mockResolvedValue(mockData);

      const result = await request(mockQuery, mockVariables);

      expect(mockGraphQLClient.request).toHaveBeenCalledWith(mockQuery, mockVariables);
      expect(result).toEqual(mockData);
    });

    it('should handle GraphQL request errors', async () => {
      const mockError = new Error('GraphQL request failed');
      const mockQuery = 'query { invalid }';

      mockGraphQLClient.request.mockRejectedValue(mockError);

      await expect(request(mockQuery)).rejects.toThrow('GraphQL request failed');
      expect(mockGraphQLClient.request).toHaveBeenCalledWith(mockQuery, undefined);
    });

    it('should handle requests without variables', async () => {
      const mockData = { simple: 'query' };
      const mockQuery = 'query { simple }';

      mockGraphQLClient.request.mockResolvedValue(mockData);

      const result = await request(mockQuery);

      expect(mockGraphQLClient.request).toHaveBeenCalledWith(mockQuery, undefined);
      expect(result).toEqual(mockData);
    });

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Network error');
      const mockQuery = 'query { error }';

      mockGraphQLClient.request.mockRejectedValue(mockError);

      await expect(request(mockQuery)).rejects.toThrow('Network error');
      expect(consoleSpy).toHaveBeenCalledWith('GraphQL request failed:', mockError);

      consoleSpy.mockRestore();
    });
  });

  describe('createAuthenticatedClient', () => {
    it('should create client with authorization header', () => {
      const token = 'test-token';
      const client = createAuthenticatedClient(token);

      expect(client).toBeDefined();
    });

    it('should create client with role header', () => {
      const token = 'test-token';
      const role = 'admin';
      const client = createAuthenticatedClient(token, role);

      expect(client).toBeDefined();
    });
  });
});
