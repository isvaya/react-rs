'use client';

import Link from 'next/link';
import { PATHS } from '../../enums/enum';

export const menuItems = [
  { key: PATHS.MAIN, label: <Link href={PATHS.MAIN}>Main</Link> },
  { key: PATHS.ABOUT, label: <Link href={PATHS.ABOUT}>About</Link> },
];
