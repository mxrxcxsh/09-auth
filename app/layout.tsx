import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Provider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';
import 'modern-normalize';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Created by junior full-stack developer Andrii Khomenko',
  openGraph: {
    title: 'NoteHub',
    description:
      'NoteHub is an app for creating, organizing, and managing your notes.',
    url: 'https://notehub.com',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="min-h-full flex flex-col">
        <Provider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <div id="modal-root"></div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
