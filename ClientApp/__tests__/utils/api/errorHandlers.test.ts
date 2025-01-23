import { consoleError, ALERT_MESSAGES } from '@/utils/api/errorHandlers';

describe('axiosErrorUtils', () => {
  describe('consoleError', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear any mocks before each test
    });

    it('should log the error message with a title and code', () => {
      const title = 'Error';
      const message = 'Something went wrong';
      const code = 500;
      
      // Mock console.error to track the log
      console.error = jest.fn();

      consoleError(title, message, code);

      // Check if console.error was called with the correct arguments
      expect(console.error).toHaveBeenCalledWith(`ERROR: ${title} ${code} - ${message}`);
    });

    it('should log the error message with only the title and message if no code is provided', () => {
      const title = 'Error';
      const message = 'Something went wrong';
      
      // Mock console.error to track the log
      console.error = jest.fn();

      consoleError(title, message);

      // Check if console.error was called with the correct arguments
      expect(console.error).toHaveBeenCalledWith(`ERROR: ${title} - ${message}`);
    });
  });

  describe('ALERT_MESSAGES', () => {
    it('should contain all the expected error messages', () => {
      const expectedKeys = [
        'badRequest', 'unauthorized', 'forbidden', 'notFound', 'conflict',
        'serverError', 'serviceUnavailable', 'networkError', 'sessionExpired',
        'originDnsError', 'defaultError'
      ];

      // Check that the keys exist in the ALERT_MESSAGES object
      expectedKeys.forEach(key => {
        expect(ALERT_MESSAGES).toHaveProperty(key);
      });
    });

    it('should have correct titles and messages for common client-side errors', () => {
      expect(ALERT_MESSAGES.badRequest.title).toBe('Bad Request');
      expect(ALERT_MESSAGES.badRequest.message).toBe('The server could not understand your request. Please check and try again.');
      
      expect(ALERT_MESSAGES.unauthorized.title).toBe('Unauthorized Access');
      expect(ALERT_MESSAGES.unauthorized.message).toBe('You are not authorized to access this resource. Please log in.');
      
      expect(ALERT_MESSAGES.forbidden.title).toBe('Forbidden');
      expect(ALERT_MESSAGES.forbidden.message).toBe('You do not have permission to view this resource.');
      
      expect(ALERT_MESSAGES.notFound.title).toBe('Resource Not Found');
      expect(ALERT_MESSAGES.notFound.message).toBe('The requested resource was not found on the server.');
      
      expect(ALERT_MESSAGES.conflict.title).toBe('Conflict');
      expect(ALERT_MESSAGES.conflict.message).toBe('The request could not be completed due to a conflict with the current state of the resource.');
    });

    it('should have correct titles and messages for server-side errors', () => {
      expect(ALERT_MESSAGES.serverError.title).toBe('Internal Server Error');
      expect(ALERT_MESSAGES.serverError.message).toBe('An error occurred on the server. Please try again later.');
      
      expect(ALERT_MESSAGES.serviceUnavailable.title).toBe('Service Unavailable');
      expect(ALERT_MESSAGES.serviceUnavailable.message).toBe('The server is currently unavailable. Please try again later.');
    });

    it('should have correct titles and messages for custom errors', () => {
      expect(ALERT_MESSAGES.networkError.title).toBe('Network Error');
      expect(ALERT_MESSAGES.networkError.message).toBe('Please check your internet connection or server status.');
      
      expect(ALERT_MESSAGES.sessionExpired.title).toBe('Session Expired');
      expect(ALERT_MESSAGES.sessionExpired.message).toBe('Your session has expired. Please log in again to continue.');
      
      expect(ALERT_MESSAGES.originDnsError.title).toBe('Service Unreachable');
      expect(ALERT_MESSAGES.originDnsError.message).toBe('The server is currently unreachable due to DNS issues. Please try again later.');
    });

    it('should have the default error message', () => {
      expect(ALERT_MESSAGES.defaultError.title).toBe('Error');
      expect(ALERT_MESSAGES.defaultError.message).toBe('An unexpected error occurred. Please try again later.');
    });
  });
});
