import { render } from '@testing-library/react';
import { ChartContainer, ChartConfig } from './chart';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ChartContainer Security', () => {
  it('should sanitize color values to prevent XSS via </style>', () => {
    // Malicious color value trying to break out of style tag
    const maliciousColor = 'blue</style><script>console.log("XSS")</script>';

    const config: ChartConfig = {
      test: {
        label: 'Test',
        color: maliciousColor,
      },
    };

    const { container } = render(
      <ChartContainer config={config}>
        <div>Chart Content</div>
      </ChartContainer>
    );

    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();

    const content = styleTag?.innerHTML || '';

    // Verify that the closing style tag is NOT present
    expect(content).not.toContain('</style>');
    // Verify that the script tag is NOT present
    expect(content).not.toContain('<script>');
    // Verify that the content was sanitized (brackets removed)
    expect(content).toContain('blue/stylescriptconsole.log("XSS")/script');
  });
});
