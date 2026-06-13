import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";
import { Soundscape } from "@/components/Soundscape";
import { GlobalWeatherLayer, WeatherDial, WeatherProvider } from "@/components/WeatherOverlay";
import { SeasonProvider, SeasonalDispatcher, SeasonDial } from "@/components/Season";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SeasonProvider>
          <WeatherProvider>
            <SeasonalDispatcher />
            <GlobalWeatherLayer />
            {children}
            <Soundscape />
            <SeasonDial />
            <WeatherDial />
          </WeatherProvider>
        </SeasonProvider>
      </body>
    </html>
  );
}
