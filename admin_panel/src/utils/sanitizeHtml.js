import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => DOMPurify.sanitize(String(html || ''), {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
  FORBID_ATTR: ['style', 'id', 'name'],
});
