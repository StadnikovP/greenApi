import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('has jsdom environment', () => {
    expect(document).toBeDefined();
  })

  it('supports DOM matchers', () => {
    const element = document.createElement('button');

    element.disabled = true;

    expect(element).toBeDisabled();
  });
});
