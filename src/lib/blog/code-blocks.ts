/**
 * Initialize code block enhancements:
 * - Add language labels from class names or data attributes
 * - Add copy buttons to all pre blocks
 */
export function initializeCodeBlocks() {
  if (typeof window === 'undefined') return;

  // Find all pre elements with code inside
  const preElements = document.querySelectorAll('pre');

  preElements.forEach((pre) => {
    const code = pre.querySelector('code');

    if (!code) return;

    // Detect language from various sources
    let language = pre.getAttribute('data-language') ||
                   code.getAttribute('data-language') ||
                   code.className.match(/language-(\w+)/)?.[1] ||
                   code.className.match(/lang-(\w+)/)?.[1] ||
                   '';

    // Try to detect from Astro/Shiki class
    if (!language && code.classList.contains('astro-code')) {
      const astroLang = code.className.match(/astro-code-(\w+)/)?.[1];
      if (astroLang) language = astroLang;
    }

    // Default to 'code' if no language detected
    if (!language || language === 'astro-code') {
      language = 'code';
    }

    // Set data-language attribute for CSS styling
    pre.setAttribute('data-language', language);

    // Skip if copy button already exists
    if (pre.querySelector('.copy-button')) return;

    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.setAttribute('aria-label', 'Copiar código');

    // Create icon using textContent for safety
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('width', '16');
    icon.setAttribute('height', '16');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '9');
    rect.setAttribute('y', '9');
    rect.setAttribute('width', '13');
    rect.setAttribute('height', '13');
    rect.setAttribute('rx', '2');
    rect.setAttribute('ry', '2');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');

    icon.appendChild(rect);
    icon.appendChild(path);

    const label = document.createElement('span');
    label.textContent = 'Copy';

    copyButton.appendChild(icon);
    copyButton.appendChild(label);

    // Copy button click handler
    copyButton.addEventListener('click', async () => {
      const codeText = code.textContent || '';

      try {
        await navigator.clipboard.writeText(codeText);

        // Show copied state
        copyButton.classList.add('copied');

        // Clear and recreate with checkmark
        while (copyButton.firstChild) {
          copyButton.removeChild(copyButton.firstChild);
        }

        const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkIcon.setAttribute('width', '16');
        checkIcon.setAttribute('height', '16');
        checkIcon.setAttribute('viewBox', '0 0 24 24');
        checkIcon.setAttribute('fill', 'none');
        checkIcon.setAttribute('stroke', 'currentColor');
        checkIcon.setAttribute('stroke-width', '2');
        checkIcon.setAttribute('stroke-linecap', 'round');
        checkIcon.setAttribute('stroke-linejoin', 'round');

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', '20 6 9 17 4 12');

        checkIcon.appendChild(polyline);

        const copiedLabel = document.createElement('span');
        copiedLabel.textContent = 'Copied!';

        copyButton.appendChild(checkIcon);
        copyButton.appendChild(copiedLabel);

        // Reset after 2 seconds
        setTimeout(() => {
          copyButton.classList.remove('copied');

          while (copyButton.firstChild) {
            copyButton.removeChild(copyButton.firstChild);
          }

          copyButton.appendChild(icon);
          copyButton.appendChild(label);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });

    pre.appendChild(copyButton);
  });
}
