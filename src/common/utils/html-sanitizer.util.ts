export class HtmlSanitizerUtil {
  private static readonly HTML_ENTITIES: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  static escapeHtml(text: string): string {
    if (!text) return '';
    return text.replace(/[&<>"'`=\/]/g, (s) => this.HTML_ENTITIES[s]);
  }

  static sanitizeEmailContent(content: string): string {
    // Remove script tags and their content
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove dangerous attributes
    content = content.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    content = content.replace(/\s*javascript\s*:/gi, '');
    
    // Escape remaining HTML entities in user content
    const userContentRegex = /\$\{([^}]+)\}/g;
    content = content.replace(userContentRegex, (match, variable) => {
      return `\${${this.escapeHtml(variable)}}`;
    });
    
    return content;
  }

  static createSafeEmailTemplate(template: string, variables: Record<string, string>): string {
    let safeTemplate = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const escapedValue = this.escapeHtml(value);
      safeTemplate = safeTemplate.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), escapedValue);
    }
    
    return safeTemplate;
  }
}