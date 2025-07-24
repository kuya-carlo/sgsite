// app/layout.tsx
import "@/styles/global.scss";
import { ReactNode } from "react";

export const metadata = {
  title: "Seekers Guild Events",
  description:
    "A platform for upcoming events hosted by Seekers Guild and its partners",
  metadataBase: new URL("https://sgsite.vercel.app"),
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
