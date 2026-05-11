// @ts-ignore: allow importing global CSS without explicit type declarations
import "./globals.css";

export const metadata = {
  title: "Participants App",
  description: "Fullstack technical assignment",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}