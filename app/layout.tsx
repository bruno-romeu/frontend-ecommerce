import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { Suspense } from "react"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"

const lato = Inter({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-sans-serif",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BALM | E-commerce",
  description:
    "Sua loja de velas e aromas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${lato.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<div>Carregando...</div>}>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
