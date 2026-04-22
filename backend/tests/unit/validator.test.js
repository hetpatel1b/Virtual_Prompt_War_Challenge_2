/**
 * Input Validation Unit Tests
 */

require('../setup');

const { sanitizeInput } = require('../../middleware/validator');

describe('Input Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>Hello');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toContain('Hello');
    });

    it('should remove HTML tags', () => {
      const result = sanitizeInput('<div>some <b>text</b></div>');
      expect(result).not.toContain('<div>');
      expect(result).not.toContain('<b>');
      expect(result).toContain('some');
      expect(result).toContain('text');
    });

    it('should remove javascript: protocol', () => {
      const result = sanitizeInput('javascript:alert(1)');
      expect(result).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const result = sanitizeInput('onerror=alert(1) onclick=attack()');
      expect(result).not.toMatch(/on\w+=/);
    });

    it('should trim whitespace', () => {
      const result = sanitizeInput('  Hello World  ');
      expect(result).toBe('Hello World');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });

    it('should preserve normal text', () => {
      const normalText = 'What is the minimum voting age in India?';
      expect(sanitizeInput(normalText)).toBe(normalText);
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle complex XSS payloads', () => {
      const payload = '<img src=x onerror=alert(1)><script>document.cookie</script>';
      const result = sanitizeInput(payload);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('onerror=');
    });
  });
});
