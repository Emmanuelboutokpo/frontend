import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});


export const metadata: Metadata = {
  title: "BestReserv | Découvrez, réservez, profitez",
  description: "Hébergements, restaurants et loisirs sélectionnés au Bénin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="fr">
      <body
        className={`flex min-h-screen flex-col ${jakarta.variable} ${playfair.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
       <main className="flex-1 pb-20 lg:pb-0">
        {children}
       </main>
      </body>
    </html>
  );
}
