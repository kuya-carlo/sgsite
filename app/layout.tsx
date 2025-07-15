// app/layout.tsx
import '@/styles/global.scss';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'Seekers Guild Events',
  description: 'A platform for upcoming events hosted by Seekers Guild and its partners',
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
