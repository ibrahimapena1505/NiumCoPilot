import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeRegistry } from '../components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Nium Intelligence Demo',
  description: 'Demo platform for Nium knowledge exploration and integrations',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}