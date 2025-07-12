// app/layout.tsx
import '@/styles/global.scss';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
