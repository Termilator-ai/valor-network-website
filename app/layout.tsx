import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import GoogleAdSense from "@/components/GoogleAdSense"

const inter = Inter({ subsets: ["latin"] })

// GA component
function GoogleAnalytics() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-R780C0QL0S"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R780C0QL0S');
          `,
        }}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "Valor Network - The Ultimate Cross-Platform Factions Server",
  description:
    "Join Valor Network, the premier Minecraft factions server with cross-platform support. Experience epic battles, build your empire, and dominate the competition.",
  keywords: "Minecraft, Factions, Server, Cross-Platform, PvP, Gaming, Multiplayer",
  authors: [{ name: "Valor Network" }],
  creator: "Valor Network",
  publisher: "Valor Network",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://valormc.lol",
    title: "Valor Network - The Ultimate Cross-Platform Factions Server",
    description: "Join Valor Network, the premier Minecraft factions server with cross-platform support.",
    siteName: "Valor Network",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Valor Network - Minecraft Factions Server",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valor Network - The Ultimate Cross-Platform Factions Server",
    description: "Join Valor Network, the premier Minecraft factions server with cross-platform support.",
    images: ["/og-image.png"],
    creator: "@ValorNetwork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "nothingtoseehere", // Placeholder for generator, can be removed or replaced
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <GoogleAdSense publisherId="ca-pub-3523990209984697" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
