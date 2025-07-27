import { describe, beforeEach, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About page', () => {
  beforeEach(() => {
    render(<About />);
  });

  it('renders the main heading', () => {
    const heading = screen.getByRole('heading', { level: 1, name: /^About$/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the greeting text', () => {
    const greeting = screen.getByRole('heading', {
      level: 3,
      name: /Hi there! I am Tanya/i,
    });
    expect(greeting).toBeInTheDocument();
  });

  it('renders the first paragraph of about text', () => {
    const firstParagraph = screen.getByText(
      /Once upon a time, I was just looking for something “for the soul”/i
    );
    expect(firstParagraph).toBeInTheDocument();
  });

  it('renders all four about-text paragraphs', () => {
    const paras = screen.getAllByText((_, elem) => {
      return (
        elem?.tagName.toLowerCase() === 'p' &&
        elem.classList.contains('about-text')
      );
    });
    expect(paras).toHaveLength(4);
  });
});
