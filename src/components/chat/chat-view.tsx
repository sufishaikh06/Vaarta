
'use client';
import { useState, useEffect, useRef } from 'react';
import type { UserRole, AppUser } from './chat-widget';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Send, Mic, Volume2, LogOut, Loader2, Paperclip, Bot, FileText, CheckCircle2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ApplicationForm } from '../student/application-form';
import { NoticeForm } from '../faculty/notice-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { draftApplication } from '@/ai/flows/application-drafter';
import { answerQuestion } from '@/ai/flows/rag-flow';
import { useAuth } from '@/context/auth-context';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text?: string;
  component?: React.ReactNode;
  isTyping?: boolean;
}

// SpeechRecognition API interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export function ChatView({ role, onLogout }: { role: UserRole; onLogout: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: `Welcome, ${role}! How can I help you today?` },
  ]);
  const [input, setInput] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'application' | 'notice' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({ title: "Voice Error", description: `An error occurred: ${event.error}`, variant: "destructive" });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition not supported in this browser.");
    }
  }, [toast]);

  const onFormSubmit = (data: any) => {
    setIsFormOpen(false);
    addMessage('bot', `A new ${formType} has been submitted successfully!`);
    toast({
        title: `${formType === 'application' ? 'Application' : 'Notice'} Submitted`,
        description: "Your submission has been recorded.",
    });
  }

  const addMessage = (role: 'user' | 'bot', text?: string, component?: React.ReactNode) => {
    const id = Date.now().toString();
    setMessages((prev) => [...prev.filter(m => !m.isTyping), { id, role, text, component }]);
    return id;
  };
  
  const addTypingIndicator = () => {
    setMessages((prev) => [...prev, { id: 'typing', role: 'bot', isTyping: true }]);
  }

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    const userInput = input;
    addMessage('user', userInput);
    setInput('');
    addTypingIndicator();

    // Command/intent handling
    if (userInput.toLowerCase().includes('apply for leave')) {
      if (role === 'student') {
        try {
          const output = await draftApplication({ userInput });
          addMessage('bot', undefined, <ApplicationPreview application={output} />);
        } catch (e) {
          console.error(e);
          addMessage('bot', 'Sorry, I had trouble drafting the application. Please try again.');
        }
      } else {
        addMessage('bot', "This feature is only available for students.");
      }
    } else if (userInput.toLowerCase().includes('post notice')) {
      if (role === 'faculty') {
        setFormType('notice');
        setIsFormOpen(true);
        setMessages(prev => prev.filter(m => !m.isTyping));
      } else {
        addMessage('bot', "This feature is only available for faculty members.");
      }
    } else {
      // Default to RAG flow
      try {
        const output = await answerQuestion({ question: userInput, userId: user?.id, userRole: user?.role });
        addMessage('bot', output.answer);
      } catch (e) {
        console.error(e);
        addMessage('bot', 'Sorry, I am having trouble connecting to my knowledge base. Please try again in a moment.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        toast({ title: "Not Supported", description: "Voice input is not supported in your browser.", variant: "destructive" });
        return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };


  return (
    <TooltipProvider>
    <div className="flex-grow flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn('flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'bot' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-xs md:max-w-md rounded-xl px-4 py-3 shadow-sm flex flex-col gap-2',
                msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'
              )}
            >
              {msg.isTyping ? (
                 <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></span>
                </div>
              ) : (
                <>
                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                {msg.component}
                </>
              )}
            </div>
             {msg.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-background border-t">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask me anything, or type 'apply for leave'...`}
            className="pr-20 pl-12 min-h-[48px] resize-none"
            rows={1}
          />
           <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Attach File (Not implemented)</TooltipContent>
            </Tooltip>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleMicClick}>
                        <Mic className={cn("h-5 w-5 text-muted-foreground", isRecording && "text-primary animate-pulse")} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Voice Input</TooltipContent>
            </Tooltip>
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()} className="h-8 w-8">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
       {/* Footer with Role & Logout */}
        <div className="p-2 border-t bg-secondary/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Logged in as <strong className="capitalize text-foreground">{role}</strong></span>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground">
                <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
        </div>
    </div>
    
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {formType === 'application' ? 'Leave Application' : 'Post a New Notice'}
                </DialogTitle>
            </DialogHeader>
            {formType === 'application' && <ApplicationForm onSubmit={onFormSubmit} />}
            {formType === 'notice' && <NoticeForm onSubmit={onFormSubmit} />}
        </DialogContent>
    </Dialog>

    </TooltipProvider>
  );
}

function ApplicationPreview({ application }: { application: any }) {
  const { toast } = useToast();
  const handleSubmit = () => {
    toast({
      title: 'Application Sent!',
      description: 'Your application has been formatted and sent for approval.',
    });
  };

  if (!application) {
    return (
        <div className="p-4 bg-background rounded-lg border">
            <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Drafting your application...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 bg-background rounded-lg border">
      <div className="flex items-center gap-3 mb-3">
        <FileText className="h-6 w-6 text-primary" />
        <h4 className="font-bold text-lg">Application Draft</h4>
      </div>
      <div className="space-y-2 text-sm border-l-2 border-primary/50 pl-3">
        <p><strong className="text-muted-foreground">To:</strong> Dr. Priya Mehta (HOD, Computer Science)</p>
        <p><strong className="text-muted-foreground">Subject:</strong> {application.subject}</p>
        <p className="whitespace-pre-wrap">{application.body}</p>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit}>
        <CheckCircle2 className="mr-2" /> Confirm and Send Email
      </Button>
    </div>
  );
}
