import type { Metadata } from 'next'
import { Poppins, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

const lora = Lora({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: 'Smart Parenting Assistant | AI Mental Health Support for New Mothers',
  description: 'AI-powered mental health companion for new mothers in India. Get personalized parenting advice, mood tracking, and emotional support in Hinglish.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${lora.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <Providers>
            {children}
            <Analytics />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
