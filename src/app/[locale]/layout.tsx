import '@/index.css';
import type { Metadata } from 'next';

import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { Providers } from '../../context/Providers';

import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Pokémon',
  description: 'Find your Pokémon...',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <main>
              <div>{children}</div>
              {/* <aside>{modal}</aside> */}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
