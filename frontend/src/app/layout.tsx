import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agric-onchain Finance',
  description: 'Blockchain-backed agricultural trade finance platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
