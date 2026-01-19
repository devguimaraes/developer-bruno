import { render } from '@testing-library/react';
import { ChartStyle } from './chart';
import { describe, it, expect } from 'vitest';

describe('ChartStyle', () => {
  it('sanitizes harmful characters from color config', () => {
    const config = {
      risk: {
        color: 'red</style><img src=x onerror=alert(1)>'
      }
    };

    const { container } = render(<ChartStyle id="test" config={config} />);

    const styleTag = container.querySelector('style');
    expect(styleTag).not.toBeNull();

    // The content INSIDE the style tag should not contain the malicious closing tag
    expect(styleTag?.innerHTML).not.toContain('</style>');
    // It should strip the < and > so <img shouldn't exist
    expect(styleTag?.innerHTML).not.toContain('<img');

    // Check that it was actually sanitized
    expect(styleTag?.innerHTML).toContain('red/styleimg');
  });
});
