import React from 'react';
import type { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';
import { menuItems } from './NavItems';
import { PATHS } from '../../enums/enum';
import { Link } from 'react-router-dom';

describe('menuItems', () => {
  it('defines items whose label is a <Link to={…}> with the right `to` prop', () => {
    expect(menuItems).toHaveLength(2);

    menuItems.forEach((item) => {
      expect(React.isValidElement(item.label)).toBe(true);

      const linkEl = item.label as ReactElement<{ to: string }, typeof Link>;

      expect(linkEl.props.to).toBe(item.key);

      expect([PATHS.MAIN, PATHS.ABOUT]).toContain(item.key);
    });
  });
});
