
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ChatWidgetWrapper } from '@/components/chat/chat-widget-wrapper';
import { AuthProvider } from '@/context/auth-context';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Sanjivani College of Engineering',
  description: 'A prototype website for the Vaarta project.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <AuthProvider>
          <FirebaseErrorListener />
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ChatWidgetWrapper />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
