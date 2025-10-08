
import { Inter } from 'next/font/google'
import { SessionProvider } from './providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SpeaklyPlan - Aprende Inglés en 6 Meses',
  description: 'Plan gratuito de 6 meses para aprender inglés específicamente diseñado para CTOs y profesionales de tecnología',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
