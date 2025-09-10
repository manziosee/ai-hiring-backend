export class UrlValidator {
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];
  private static readonly BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'];

  static validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      if (!this.ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        return false;
      }

      if (this.BLOCKED_HOSTS.includes(parsedUrl.hostname)) {
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