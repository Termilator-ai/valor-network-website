import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

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
    url: "https://valornetwork.com",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
