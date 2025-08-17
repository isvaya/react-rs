import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { hasLocale } from 'next-intl';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = hasLocale(routing.locales, requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  console.log(`[next-intl] Loading messages for locale: ${locale}`);

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`[next-intl] Failed to load messages for ${locale}:`, error);
    messages = {};
  }

  return {
    locale,
    messages,
  };
});
