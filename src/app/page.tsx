
'use client';
import { useState } from 'react';
import { ChatWidget } from '@/components/chat/chat-widget';
import { Button } from '@/components/ui/button';
import { VaartaLogo } from '@/components/icons';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-blue-50">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <VaartaLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-gray-800">Vaarta</span>
          </a>
          <Button onClick={() => setIsChatOpen(true)}>Launch Chat</Button>
        </nav>
      </header>

      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-800 leading-tight">
                Your College, <span className="text-primary">Smarter.</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg md:text-xl text-muted-foreground">
                Welcome to Vaarta, the AI-powered assistant for seamless college communication. Get instant answers, automate tasks, and stay connected.
              </p>
              <Button size="lg" className="mt-8" onClick={() => setIsChatOpen(true)}>
                Get Started
              </Button>
            </div>
             <div className="hidden md:block">
               <img src="https://picsum.photos/seed/college/600/500" data-ai-hint="college campus" alt="College Campus" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Open chat"
        >
          <MessageSquare className="h-8 w-8" />
        </button>
      )}

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

       <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Vaarta. A Smart India Hackathon Project.</p>
      </footer>
    </div>
  );
}
