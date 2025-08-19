import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const locales = ['en', 'ru'] as const;

export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation(routing);
