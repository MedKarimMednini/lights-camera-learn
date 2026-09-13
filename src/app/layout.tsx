import type { Metadata } from "next";
import { Libre_Franklin, Fjalla_One, Cutive_Mono } from "next/font/google";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

const fjallaOne = Fjalla_One({
  variable: "--font-fjalla-one",
  weight: "400",
  subsets: ["latin"],
});

const cutiveMono = Cutive_Mono({
  variable: "--font-cutive-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lights Camera Learn",
  description: "International filmmaking education internship program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreFranklin.variable} ${fjallaOne.variable} ${cutiveMono.variable} font-sans h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/styles/sqs-site.css" />
        <link rel="stylesheet" href="/styles/sqs-commerce.css" />
      </head>
      <body>
        {children}
        
        {/* Squarespace Core Scripts */}
        <script src="/assets.squarespace.com/@sqs/polyfiller/1.6/modern.js" defer></script>
        <script src="/assets.squarespace.com/universal/scripts-compressed/common-vendors-stable-784b947826b4c445-min.en-US.js" defer></script>
        <script src="/assets.squarespace.com/universal/scripts-compressed/common-vendors-b318b15483dd810a-min.en-US.js" defer></script>
        <script src="/assets.squarespace.com/universal/scripts-compressed/common-606aac31f510b103-min.en-US.js" defer></script>
        <script src="/assets.squarespace.com/universal/scripts-compressed/commerce-cd85e6ecc41abac7-min.en-US.js" defer></script>
        <script src="/assets.squarespace.com/universal/scripts-compressed/performance-9611e68ec914bcf5-min.en-US.js" defer></script>
        <script src="/static1.squarespace.com/static/ta/55f0a9b0e4b0f3eb70352f6d/360/scripts/site-bundle.js" defer></script>
      </body>
    </html>
  );
}
