import { describe, it, expect } from 'vitest';
import { serializeJSONForScript } from './utils';

describe('serializeJSONForScript', () => {
  it('should serialize a simple object', () => {
    const data = { key: 'value' };
    expect(serializeJSONForScript(data)).toBe('{"key":"value"}');
  });

  it('should escape script tags', () => {
    const data = { content: '</script><script>alert(1)</script>' };
    const serialized = serializeJSONForScript(data);
    expect(serialized).not.toContain('<script');
    expect(serialized).not.toContain('</script');
    expect(serialized).toContain('\\u003c/script\\u003e\\u003cscript\\u003e');
  });

  it('should escape unicode line separators', () => {
    const data = { content: 'Line 1\u2028Line 2' };
    const serialized = serializeJSONForScript(data);
    expect(serialized).toContain('\\u2028');
    expect(serialized).not.toContain('\u2028');
  });
});
