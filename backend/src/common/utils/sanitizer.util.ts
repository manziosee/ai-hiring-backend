export class SanitizerUtil {
  static sanitizeHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  static sanitizeForLog(input: string): string {
    return input.replace(/[\r\n\t]/g, '_');
  }

  static escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
