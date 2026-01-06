import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  metadataBase: new URL("https://devbaby.com"),
  title: {
    default: "Dev Baby Photography | Professional Newborn & Baby Photography",
    template: "%s | Dev Baby Photography",
  },
  description: "Capture your baby's precious first moments with award-winning photography services. Newborn, milestone, and first birthday sessions. Book your session today!",
  keywords: ["baby photography", "newborn photography", "maternity shoot", "baby photoshoot", "dev baby photography", "professional photographer"],
  authors: [{ name: "Rohit Rathod" }],
  creator: "Dev Baby Photography",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devbaby.com/",
    title: "Dev Baby Photography",
    description: "Professional Newborn & Baby Photography services. Creating timeless memories for your family.",
    siteName: "Dev Baby Photography",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or use a placeholder if appropriate
        width: 1200,
        height: 630,
        alt: "Dev Baby Photography Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevBabyPhoto",
    creator: "@DevBabyPhoto",
    title: "Dev Baby Photography",
    description: "Capture your baby's precious first moments with award-winning photography services.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Dev Baby Photography",
              image: ["https://devbaby.com/og-image.jpg"],
              description: "Professional newborn and baby photography studio specializing in capturing precious moments from newborn to first birthday.",
              url: "https://devbaby.com",
              telephone: "+91 9427765032",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Surat",
                addressLocality: "Gujarat",
                addressRegion: "GJ", // Corrected from CA
                postalCode: "395001", // Example Surat code, update if specific
                addressCountry: "IN",
              },
              priceRange: "$299-$449",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                  ],
                  opens: "09:00",
                  closes: "18:00"
                }
              ],
              sameAs: [
                "https://instagram.com/devbaby",
                "https://facebook.com/devbaby",
                "https://twitter.com/DevBabyPhoto"
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
