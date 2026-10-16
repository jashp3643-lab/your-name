import './globals.css';
import Providers from '@/components/Providers';
import DeviceFrame from '@/components/DeviceFrame';

export const metadata = {
  title: 'YONO SBI',
  description: 'YONO SBI: Mobile banking app for State Bank of India. Synthetic demo data.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'YONO SBI',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

// NOTE: tools/harness/build.mjs reproduces exactly this tree (<Providers><DeviceFrame>) for verification builds.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YONO SBI" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Providers>
          <DeviceFrame>{children}</DeviceFrame>
        </Providers>
      </body>
    </html>
  );
}
