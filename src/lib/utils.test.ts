import { describe, it, expect } from 'vitest';
import { serializeJSONForScript } from './utils';

describe('serializeJSONForScript', () => {
  it('should serialize valid JSON objects', () => {
    const data = { key: 'value', number: 123 };
    const result = serializeJSONForScript(data);
    expect(result).toBe('{"key":"value","number":123}');
  });

  it('should escape < characters to prevent XSS', () => {
    const data = {
      evil: '<script>alert("XSS")</script>'
    };
    const result = serializeJSONForScript(data);
    // Expect < to be replaced by \u003c
    // JSON.stringify escapes quotes, so we expect \"XSS\"
    expect(result).toContain('\\u003cscript>alert(\\"XSS\\")\\u003c/script>');
    expect(result).not.toContain('<script>');
  });

  it('should handle complex nested objects', () => {
    const data = {
      nested: {
        array: ['<one>', '<two>'],
        obj: { val: '<three>' }
      }
    };
    const result = serializeJSONForScript(data);
    expect(result).toContain('\\u003cone>');
    expect(result).toContain('\\u003ctwo>');
    expect(result).toContain('\\u003cthree>');
  });

  it('should handle non-serializable values safely', () => {
    expect(serializeJSONForScript(undefined)).toBe('null');
    expect(serializeJSONForScript(() => {})).toBe('null');
  });
});
