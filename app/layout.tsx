import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Dev Baby Photography | Professional Newborn & Baby Photography",
  description: "Capture your baby's precious first moments with award-winning photography services. Newborn, milestone, and first birthday sessions. Book your session today!",
  authors: [{ name: "Rohit Rathod" }],
  openGraph: {
    type: "website",
    url: "https://devbaby.com/",
    title: "Dev Baby Photography | Professional Newborn & Baby Photography",
    description: "Capture your baby's precious first moments with award-winning photography services. Newborn, milestone, and first birthday sessions.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevBabyPhoto",
    title: "Dev Baby Photography | Professional Newborn & Baby Photography",
    description: "Capture your baby's precious first moments with award-winning photography services.",
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
              description: "Professional newborn and baby photography studio specializing in capturing precious moments from newborn to first birthday.",
              url: "https://devbaby.com",
              telephone: "+91 9427765032",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Surat",
                addressLocality: "Gujarat",
                addressRegion: "CA",
                postalCode: "90210",
                addressCountry: "IN",
              },
              priceRange: "$299-$449",
              openingHours: "Mo-Sa 09:00-18:00",
              sameAs: ["https://instagram.com/devbaby", "https://facebook.com/devbaby"],
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
