import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export const metadata = {
  title: 'ASYV PassFlow - School Permission Management',
  description:
    'Agahozo-Shalom Youth Village official school permission request and approval management system with real-time status updates.',
  openGraph: {
    title: 'ASYV PassFlow - School Permission Management',
    description:
      'Agahozo-Shalom Youth Village official school permission request and approval management system with real-time status updates.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASYV PassFlow - School Permission Management',
    description:
      'Agahozo-Shalom Youth Village official school permission request and approval management system with real-time status updates.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${plusJakarta.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-white dark:bg-[#060908] text-slate-900 dark:text-white font-sans antialiased selection:bg-[#f97316] selection:text-white dark:selection:bg-[#3ed598] dark:selection:text-[#05140d] transition-colors duration-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
