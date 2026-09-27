import type { Metadata, Viewport } from 'next';
import { Baloo_2 } from 'next/font/google';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-game',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Góc Bếp Hàn - Korean Kitchen Tycoon',
  description: 'Trò chơi mô phỏng quản lý quán ăn đường phố Hàn Quốc ấm cúng (Cozy Cooking Simulator). Xào Tokbokki, cuộn Kimbap, nấu Ramyeon và phục vụ khách hàng!',
  keywords: ['Korean Kitchen', 'Cooking Game', 'Tokbokki', 'Kimbap', 'Ramyeon', 'Cozy Game', 'Game Nau An'],
  authors: [{ name: 'Goc Bep Han Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={baloo.variable}>
      <body className="font-game antialiased bg-stone-950 text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
