import type { Metadata } from "next";
import { Poppins, Nunito, Merriweather, Playfair_Display, Raleway, Creepster, Mountains_of_Christmas, Pacifico, Ultra, Roboto_Condensed, Fredoka, Comic_Neue, Bangers, Orbitron, Rye, Special_Elite, Cinzel, Cinzel_Decorative, Oswald, Source_Sans_3, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import Script from "next/script";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-merriweather" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

// Holiday Fonts
const creepster = Creepster({ subsets: ["latin"], weight: "400", variable: "--font-creepster" });
const mountainsOfChristmas = Mountains_of_Christmas({ subsets: ["latin"], weight: "700", variable: "--font-mountains-of-christmas" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico" });
const ultra = Ultra({ subsets: ["latin"], weight: "400", variable: "--font-ultra" });
const robotoCondensed = Roboto_Condensed({ subsets: ["latin"], weight: "400", variable: "--font-roboto-condensed" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400","600"], variable: "--font-fredoka" });
const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["400","700"], variable: "--font-comic-neue" });
const shareTechMono = Share_Tech_Mono({ subsets:["latin"], weight:"400", variable:"--font-share-tech-mono" });
const bangers = Bangers({ subsets: ["latin"], weight: "400", variable: "--font-bangers" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400","600"], variable: "--font-orbitron" });
const rye = Rye({ subsets:["latin"], weight:"400", variable:"--font-rye" });
const specialElite = Special_Elite({ subsets:["latin"], weight:"400", variable:"--font-special-elite" });
const cinzel = Cinzel({ subsets:["latin"], weight:["400","600","700"], variable:"--font-cinzel" });
const cinzelDecorative = Cinzel_Decorative({ subsets:["latin"], weight:["400","700"], variable:"--font-cinzel-decorative" });
const oswald = Oswald({ subsets:["latin"], weight:["400","600"], variable:"--font-oswald" });
const sourceSans3 = Source_Sans_3({ subsets:["latin"], weight:["400","600"], variable:"--font-source-sans3" });

// Moved outside component to ensure stable reference between server & client
const schoolSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Anytown Elementary School",
  "url": "https://www.elementaryschoolnewsletters.com/",
  "logo": "https://www.elementaryschoolnewsletters.com/public/book-icon.svg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Education Lane",
    "addressLocality": "Anytown",
    "addressRegion": "CA",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "telephone": "+1-555-123-4567"
};

export const metadata: Metadata = {
  title: "Elementary School Newsletters | Builder & Templates",
  description: "Create engaging elementary school classroom & PTA newsletters with a free drag-and-drop builder. Accessible themes, kid-friendly fonts, instant exports.",
  keywords: [
    'elementary school newsletter',
    'classroom newsletter template',
    'pta newsletter builder',
    'teacher communication tool',
    'school newsletter creator'
  ],
  openGraph: {
    title: 'Elementary School Newsletter Builder',
    description: 'Drag-and-drop editor for classroom & PTA newsletters. Accessible, fast, free during beta.',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Use next/script for deterministic script handling to avoid hydration mismatches */}
        <Script id="school-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }} />
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4218207840308637"
          />
        )}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          poppins.variable,
          nunito.variable,
          merriweather.variable,
          playfairDisplay.variable,
          raleway.variable,
          creepster.variable,
            mountainsOfChristmas.variable,
            pacifico.variable,
            ultra.variable,
            robotoCondensed.variable,
            fredoka.variable,
            comicNeue.variable,
            shareTechMono.variable,
            bangers.variable,
            orbitron.variable,
            rye.variable,
            specialElite.variable,
            cinzel.variable,
            cinzelDecorative.variable,
            oswald.variable,
            sourceSans3.variable
        )}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}