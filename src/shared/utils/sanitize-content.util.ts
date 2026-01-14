/**
 * Sanitiza conteúdo HTML removendo tags e atributos perigosos
 * Versão simplificada compatível com Vercel (sem dependências pesadas)
 */
export function sanitizeContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Remove tags script, iframe, object, embed, form, input, etc.
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '')
    .replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '');

  // Permite apenas tags seguras: p, br, strong, em, u, a
  // Remove todos os atributos exceto href, target, rel de links
  sanitized = sanitized.replace(/<a\s+([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
    const targetMatch = attrs.match(/target\s*=\s*["']([^"']+)["']/i);
    const relMatch = attrs.match(/rel\s*=\s*["']([^"']+)["']/i);
    
    let cleanAttrs = '';
    if (hrefMatch) {
      const href = hrefMatch[1];
      // Validar que href é http/https (prevenir javascript:, data:, etc)
      if (href.match(/^https?:\/\//i)) {
        cleanAttrs += `href="${href}"`;
      }
    }
    if (targetMatch && targetMatch[1] === '_blank') {
      cleanAttrs += cleanAttrs ? ' ' : '';
      cleanAttrs += 'target="_blank"';
    }
    if (relMatch && relMatch[1].includes('noopener')) {
      cleanAttrs += cleanAttrs ? ' ' : '';
      cleanAttrs += 'rel="noopener"';
    }
    
    return cleanAttrs ? `<a ${cleanAttrs}>` : '<a>';
  });

  // Remove atributos perigosos de outras tags permitidas
  sanitized = sanitized.replace(/<(p|br|strong|em|u)\b[^>]*>/gi, '<$1>');

  // Remove tags não permitidas (mantém apenas p, br, strong, em, u, a)
  sanitized = sanitized.replace(/<(?!\/?(?:p|br|strong|em|u|a)\b)[^>]+>/gi, '');

  // Remove eventos JavaScript (onclick, onerror, etc)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove expressões JavaScript (javascript:, data:, vbscript:, etc)
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');

  return sanitized.trim();
}
