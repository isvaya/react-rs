import type { Metadata } from 'next';
import '../index.css';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { ThemeProvider } from '../context/ThemeContext';

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
        <ThemeProvider>
          <Header />
          <div id="root">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
