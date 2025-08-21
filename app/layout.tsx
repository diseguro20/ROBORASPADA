import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Robô 98% Acertivo Analista de Apostas e Raspadinhas",
  description:
    "Robô 98% Acertivo Analista de Apostas e Raspadinhas - Descubra quais raspadinhas estão pagando melhor hoje",
  icons: {
    icon: "/images/robo-logo.png",
    shortcut: "/images/robo-logo.png",
    apple: "/images/robo-logo.png",
  },
  openGraph: {
    title: "Robô 98% Acertivo Analista de Apostas e Raspadinhas",
    description:
      "Robô 98% Acertivo Analista de Apostas e Raspadinhas - Descubra quais raspadinhas estão pagando melhor hoje",
    images: ["/images/robo-logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robô 98% Acertivo Analista de Apostas e Raspadinhas",
    description:
      "Robô 98% Acertivo Analista de Apostas e Raspadinhas - Descubra quais raspadinhas estão pagando melhor hoje",
    images: ["/images/robo-logo.png"],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
