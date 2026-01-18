import { render } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import StructuredData from './StructuredData';

// Mock the site config
vi.mock('@/config/site', () => ({
  siteConfig: {
    brazilianMarket: {
      phoneNumber: '123',
      serviceAreas: ['Rio'],
      currency: 'BRL',
      language: ['pt-BR'],
    },
    // Injecting malicious script tag
    author: '</script><script>alert("XSS")</script>',
    description: 'Test Description',
    domain: 'https://example.com',
    avatar: '/avatar.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    seo: {
      keywords: ['test'],
      image: '/image.jpg',
      locale: 'pt_BR',
    },
    title: 'Test Title',
    email: 'test@example.com',
  },
}));

describe('StructuredData Security', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be safe against XSS injection in JSON-LD', () => {
    const { container } = render(<StructuredData />);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    let foundUnescapedTag = false;

    scripts.forEach((script) => {
      // If the content contains the closing script tag, the browser would terminate the script block early
      // and execute the subsequent malicious script.
      // Therefore, we MUST NOT find "</script>" inside the JSON string.
      // It should be escaped to "\u003c/script>".
      if (script.innerHTML.includes('</script>')) {
        foundUnescapedTag = true;
      }
    });

    // Now we expect this to be FALSE, because we fixed it.
    expect(foundUnescapedTag).toBe(false);

    // Additionally, verify that it IS escaped
    let foundEscapedTag = false;
    scripts.forEach((script) => {
      if (script.innerHTML.includes('\\u003c/script>')) {
        foundEscapedTag = true;
      }
    });
    expect(foundEscapedTag).toBe(true);
  });
});
