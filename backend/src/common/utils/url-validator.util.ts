export class UrlValidator {
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];
  private static readonly BLOCKED_HOSTS = [
    'localhost', '127.0.0.1', '0.0.0.0', '::1',
    // Private IP ranges will be checked separately
  ];
  
  private static readonly PRIVATE_IP_PATTERNS = [
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^169\.254\./,
    /^fe80:/i
  ];

  static validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      if (!this.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        return false;
      }

      if (this.BLOCKED_HOSTS.includes(parsedUrl.hostname)) {
        return false;
      }
      
      // Check private IP patterns
      if (this.PRIVATE_IP_PATTERNS.some(pattern => pattern.test(parsedUrl.hostname))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  static sanitizeUrl(url: string): string {
    if (!this.validateUrl(url)) {
      throw new Error('Invalid or unsafe URL');
    }
    return url;
  }
}