
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Languages, Mic, Volume2, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ChatInput from './chat-input';
import { Button } from '../ui/button';
import { UserRole } from '@/app/chat/page';
import { textToSpeech } from '@/ai/flows/tts';
import { useToast } from '@/hooks/use-toast';
import imageData from '@/lib/placeholder-images.json';


interface Message {
  id: number;
  content: string | React.ReactNode;
  role: 'user' | 'bot' | 'system';
}

const initialMessages: Message[] = [
    { id: 1, role: 'bot', content: 'Welcome to Vaarta! How can I assist you today?' },
];

export function ChatLayout({ role }: { role: UserRole }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState<number | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const addMessage = (content: string | React.ReactNode, role: 'user' | 'bot' | 'system') => {
    const newMessage = { id: Date.now(), content, role };
    setMessages(prev => [...prev, newMessage]);
  };

  const handlePlayAudio = async (message: Message) => {
    if (typeof message.content !== 'string' || message.role === 'user') return;

    if (audioRef.current && audioPlaying === message.id) {
        audioRef.current.pause();
        audioRef.current = null;
        setAudioPlaying(null);
        return;
    }

    if (audioRef.current) {
        audioRef.current.pause();
    }
    
    setAudioLoading(message.id);
    setAudioPlaying(null);

    try {
        const response = await textToSpeech(message.content);
        const audioData = response.media;
        
        const newAudio = new Audio(audioData);
        audioRef.current = newAudio;
        
        newAudio.oncanplaythrough = () => {
            newAudio.play();
            setAudioPlaying(message.id);
            setAudioLoading(null);
        };
        newAudio.onended = () => {
            setAudioPlaying(null);
            audioRef.current = null;
        };
        newAudio.onerror = () => {
             toast({ title: "Error", description: "Could not play audio.", variant: "destructive" });
             setAudioLoading(null);
        }

    } catch (error) {
        console.error("TTS Error:", error);
        toast({ title: "Text-to-Speech Failed", description: "Could not generate audio for this message.", variant: "destructive" });
        setAudioLoading(null);
    }
  };


  return (
    <div className="relative w-full h-full flex flex-col bg-card rounded-b-lg shadow-lg border border-border">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn('flex items-end gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {message.role !== 'user' && (
               <Avatar className="h-8 w-8">
                 <AvatarImage src={imageData.avatars.bot} alt="Bot" />
                 <AvatarFallback>V</AvatarFallback>
               </Avatar>
            )}
            <div
              className={cn(
                'max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 shadow-sm flex items-center gap-2',
                message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none',
                 typeof message.content !== 'string' ? 'bg-transparent shadow-none p-0' : ''
              )}
            >
              {typeof message.content === 'string' ? <p className="text-sm">{message.content}</p> : message.content}
              {message.role === 'bot' && typeof message.content === 'string' && (
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handlePlayAudio(message)}>
                    {audioLoading === message.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Volume2 className={cn("h-4 w-4", audioPlaying === message.id ? "text-primary" : "text-muted-foreground")} />
                    )}
                </Button>
              )}
            </div>
             {message.role === 'user' && (
               <Avatar className="h-8 w-8">
                 <AvatarImage src={imageData.avatars[role]} alt={role} />
                 <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
            )}
          </motion.div>
        ))}
      </div>

      <ChatInput onSendMessage={addMessage} role={role} />
      
      {/* FAB */}
      <div className="absolute bottom-24 right-4">
         <motion.div
          animate={isFabOpen ? "open" : "closed"}
          className="relative"
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            variants={{
              open: { scale: 1, opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              closed: { scale: 0, opacity: 0, y: 20 },
            }}
          >
              <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 shadow-lg">
                  <Languages className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 shadow-lg">
                  <Mic className="h-6 w-6" />
              </Button>
          </motion.div>

          <Button 
            onClick={() => setIsFabOpen(!isFabOpen)}
            size="icon" 
            className="rounded-full h-16 w-16 shadow-xl mt-4"
          >
            <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }}>
              <Plus className="h-7 w-7" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
