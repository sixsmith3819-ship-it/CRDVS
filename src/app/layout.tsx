import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { CommandPaletteProvider } from '@/components/ui/CommandPaletteProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CRDVS — Criminal Record Digital Verification System',
    template: '%s | CRDVS',
  },
  description: 'Secure Criminal Record Digital Verification System for authorized criminal justice personnel.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Theme initialization script - runs before React hydration */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('crdvs-theme');
                  if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <CommandPaletteProvider>
          {children}
          <ToastProvider />
        </CommandPaletteProvider>
      </body>
    </html>
  )
}
