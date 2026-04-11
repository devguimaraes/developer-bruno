import { describe, it, expect } from 'vitest';
import { generateSlug } from '.';

describe('Blog Utils', () => {
  describe('generateSlug', () => {
    it('should convert filename to simple slug', () => {
      expect(generateSlug('meu-post.md')).toBe('meu-post');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Post com Acentuacao!.md')).toBe('post-com-acentuacao');
    });

    it('should remove file extension', () => {
      expect(generateSlug('react-hooks.md')).toBe('react-hooks');
    });

    it('should lowercase everything', () => {
      expect(generateSlug('UPPERCASE-POST.md')).toBe('uppercase-post');
    });
  });
});
