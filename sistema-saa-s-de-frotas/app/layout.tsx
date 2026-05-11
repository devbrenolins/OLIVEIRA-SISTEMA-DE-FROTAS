import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'FleetPro - Sistema de Gestão de Frotas',
  description: 'Sistema completo para gestão de frotas empresariais',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <StoreProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            theme="dark"
            toastOptions={{
              style: {
                background: 'oklch(0.18 0.005 250)',
                border: '1px solid oklch(0.28 0.005 250)',
                color: 'oklch(0.95 0 0)',
              },
            }}
          />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
