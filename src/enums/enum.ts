export const PATHS = {
  MAIN: '/',
  ABOUT: '/about',
  DETAILS: '/details',
  NOT_FOUND: '/not_found',
} as const;

export type PATHS = (typeof PATHS)[keyof typeof PATHS];
