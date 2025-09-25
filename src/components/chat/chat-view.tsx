
'use client';
import { useState, useEffect, useRef } from 'react';
import type { UserRole, AppUser } from './chat-widget';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Send, Mic, Volume2, LogOut, Loader2, Bot, FileText, CheckCircle2, Languages } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { saveApplicationClient } from '@/lib/firebase-actions';
import { textToSpeech } from '@/ai/flows/tts';

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

type Language = { code: string, name: string };
type ConversationState = 'idle' | 'applying_leave_faculty_name' | 'applying_leave_faculty_email' | 'applying_leave_subject' | 'applying_leave_reason';

const supportedLanguages: Language[] = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'हिन्दी' },
    { code: 'mr-IN', name: 'मराठी' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ' },
]

export function ChatView({ role, onLogout }: { role: UserRole; onLogout: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: `Welcome, ${role}! How can I help you today?` },
  ]);
  const [input, setInput] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'application' | 'notice' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(supportedLanguages[0]);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const applicationData = useRef<Partial<any>>({});
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      recognition.lang = selectedLanguage.code;

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
        if (event.error !== 'network') {
            toast({ title: "Voice Error", description: `An error occurred: ${event.error}`, variant: "destructive" });
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition not supported in this browser.");
    }
  }, [toast, selectedLanguage]);

  const onFormSubmit = (data: any) => {
    setIsFormOpen(false);
    addMessage('bot', `A new ${formType} has been submitted successfully!`);
    toast({
        title: `${formType === 'application' ? 'Application' : 'Notice'} Submitted`,
        description: "Your submission has been recorded.",
    });
  }

  const addMessage = (role: 'user' | 'bot', text?: string, component?: React.ReactNode) => {
    const id = `${Date.now()}-${Math.random()}`;
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

    // Check for conversational state first
    if (conversationState !== 'idle') {
        await handleLeaveApplicationConversation(userInput);
        return;
    }

    // Command/intent handling
    if (userInput.toLowerCase().includes('apply for leave')) {
      if (role === 'student') {
        setConversationState('applying_leave_faculty_name');
        addMessage('bot', "Sure, I can help with that. Who is the faculty member you want to send this to?");
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
        const output = await answerQuestion({
            question: userInput,
            userId: user?.id,
            userRole: user?.role,
        });
        addMessage('bot', output.answer);
      } catch (e) {
        console.error(e);
        addMessage('bot', 'Sorry, I am having trouble connecting to my knowledge base. Please try again in a moment.');
      }
    }
  };

  const handleLeaveApplicationConversation = async (userInput: string) => {
      switch (conversationState) {
          case 'applying_leave_faculty_name':
              applicationData.current.facultyName = userInput;
              setConversationState('applying_leave_faculty_email');
              addMessage('bot', `Got it. What is ${userInput}'s email address?`);
              break;
          case 'applying_leave_faculty_email':
              applicationData.current.facultyEmail = userInput;
              setConversationState('applying_leave_subject');
              addMessage('bot', "Great. What should be the subject of the email?");
              break;
          case 'applying_leave_subject':
              applicationData.current.subject = userInput;
              setConversationState('applying_leave_reason');
              addMessage('bot', "Perfect. Now, please tell me the reason for your leave.");
              break;
          case 'applying_leave_reason':
              applicationData.current.reason = userInput;
              setConversationState('idle');
              addMessage('bot', "Thank you. I'm drafting the application now based on the details you provided.");

              try {
                  const output = await draftApplication({
                      reason: applicationData.current.reason,
                      facultyName: applicationData.current.facultyName,
                      studentName: user?.name || "the student"
                  });

                  const fullApplicationData = {
                      ...applicationData.current,
                      body: output.body
                  };
                  
                  addMessage('bot', undefined, 
                    <ApplicationPreview 
                      application={fullApplicationData} 
                      onConfirm={() => {
                          addMessage('bot', `Your application has been sent to ${applicationData.current.facultyName}.`);
                          applicationData.current = {};
                      }} 
                    />
                  );

              } catch (e) {
                  console.error(e);
                  addMessage('bot', 'Sorry, I had trouble drafting the application. Please try again.');
                  applicationData.current = {};
              }
              break;
      }
  }

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
      // Update language before starting
      recognitionRef.current.lang = selectedLanguage.code;
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };
  
  const handlePlayAudio = async (message: Message) => {
    if (typeof message.text !== 'string' || message.role === 'user') return;

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
        const response = await textToSpeech(message.text);
        if(!response || !response.media) {
             toast({ 
                title: "Text-to-Speech Failed", 
                description: "Audio generation limit reached. Please try again later or upgrade your plan.",
                variant: "destructive" 
            });
            setAudioLoading(null);
            return;
        }
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

    } catch (error: any) {
        console.error("TTS Error:", error);
        const errorMessage = error.message && error.message.includes('429') 
            ? "Audio generation limit reached for today."
            : "Could not generate audio for this message.";
        toast({ title: "Text-to-Speech Failed", description: errorMessage, variant: "destructive" });
        setAudioLoading(null);
    }
  };

  const renderFormattedText = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\n|^)([\-\*] )(.*)/g, '$1<li>$3</li>') // Unordered lists
      .replace(/(\n|^)(\d+\. )(.*)/g, '$1<li>$3</li>') // Ordered lists
      .replace(/(<li>.*<\/li>)/gs, (match) => {
        if (match.includes('<li')) { // Check if it's a list item
             if (text.match(/(\n|^)(\d+\. )/)) {
                return `<ol class="list-decimal pl-5">${match.replace(/<li>/g, '<li class="mb-1">')}</ol>`;
            }
            return `<ul class="list-disc pl-5">${match.replace(/<li>/g, '<li class="mb-1">')}</ul>`;
        }
        return match;
      })
      .replace(/\n/g, '<br />');

    return (
      <div
        className="prose prose-sm text-foreground max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };


  return (
    <TooltipProvider>
    <div className="flex-grow flex flex-col h-full bg-card">
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
                'max-w-xs md:max-w-md rounded-xl px-4 py-3 shadow-sm flex items-start gap-2',
                msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'
              )}
            >
              {msg.isTyping ? (
                 <div className="flex items-center gap-1.5 p-1">
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></span>
                </div>
              ) : (
                <div className="flex-grow">
                  {msg.text && renderFormattedText(msg.text)}
                  {msg.component}
                </div>
              )}
               {msg.role === 'bot' && msg.text && (
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handlePlayAudio(msg)}>
                    {audioLoading === msg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Volume2 className={cn("h-4 w-4", audioPlaying === msg.id ? "text-primary" : "text-muted-foreground")} />
                    )}
                </Button>
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
            placeholder={
              conversationState.startsWith('applying_leave')
                ? `Enter ${conversationState.split('_').slice(2).join(' ')}...`
                : "Ask me anything, or type 'apply for leave'..."
            }
            className="pr-20 pl-12 min-h-[48px] resize-none"
            rows={1}
          />
           <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
             <Popover>
                <PopoverTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Languages className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice Language</TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                    <div className="flex flex-col gap-1">
                        {supportedLanguages.map(lang => (
                            <Button
                                key={lang.code}
                                variant={selectedLanguage.code === lang.code ? 'default' : 'ghost'}
                                onClick={() => setSelectedLanguage(lang)}
                                className="justify-start"
                            >
                                {lang.name}
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleMicClick}>
                        <Mic className={cn("h-5 w-5 text-muted-foreground", isRecording && "text-primary animate-pulse")} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Voice Input ({selectedLanguage.name})</TooltipContent>
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

function ApplicationPreview({ application, onConfirm }: { application: any, onConfirm: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !application) return;
    setIsSubmitting(true);
    
    await saveApplicationClient({
        student_id: user.id,
        type: 'leave',
        content: `Subject: ${application.subject}\n\n${application.body}`,
        status: 'pending',
        faculty_id: 'placeholder_faculty_id', // This is now a placeholder
        faculty_name: application.facultyName,
        faculty_email: application.facultyEmail,
    });

    toast({
        title: 'Application Sent!',
        description: 'Your application has been sent to the faculty for review.',
    });
    onConfirm();
    setIsSubmitting(false);
  };

  if (!application || !application.body) {
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
        <p><strong className="text-muted-foreground">To:</strong> {application.facultyName} ({application.facultyEmail})</p>
        <p><strong className="text-muted-foreground">Subject:</strong> {application.subject}</p>
        <p className="whitespace-pre-wrap">{application.body}</p>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2" />}
        Confirm and Send Email
      </Button>
    </div>
  );
}
