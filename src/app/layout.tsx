import type { Metadata } from 'next';
import '../index.css';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Providers } from '../context/Providers';

export const metadata: Metadata = {
  title: 'Pokémon',
  description: 'Finf your Pokémon...',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div id="root">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
