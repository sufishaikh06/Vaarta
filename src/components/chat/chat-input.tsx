'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestFAQs } from '@/ai/flows/contextual-faq-suggestion';
import { UserRole } from '@/app/chat/page';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ApplicationForm } from '@/components/student/application-form';
import { NoticeForm } from '@/components/faculty/notice-form';

interface ChatInputProps {
  onSendMessage: (content: string, role: 'user' | 'bot') => void;
  role: UserRole;
}

export default function ChatInput({ onSendMessage, role }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'application' | 'notice' | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input, 'user');

      // Command handling
      if (input.toLowerCase().includes('leave application')) {
        if (role === 'student') {
            setFormType('application');
            setIsFormOpen(true);
        } else {
            toast({ title: "Access Denied", description: "Only students can submit applications.", variant: "destructive" });
        }
      } else if (input.toLowerCase().includes('post notice')) {
        if (role === 'faculty') {
            setFormType('notice');
            setIsFormOpen(true);
        } else {
            toast({ title: "Access Denied", description: "Only faculty can post notices.", variant: "destructive" });
        }
      } else {
          // Simulate bot response
          setTimeout(() => {
              onSendMessage("I'm sorry, I can't process that request yet. I can help with FAQs, timetables and events.", 'bot');
          }, 500);
      }


      setInput('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion, 'user');
     setTimeout(() => {
        onSendMessage("That's a great question! Here is the information you requested...", 'bot');
    }, 500);
    setInput('');
    setSuggestions([]);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (input.length > 3) {
        setIsSuggesting(true);
        try {
          const result = await suggestFAQs({ userMessage: input });
          setSuggestions(result.suggestedFAQs.slice(0, 3));
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsSuggesting(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onFormSubmit = (data: any) => {
    setIsFormOpen(false);
    onSendMessage(`A new ${formType} has been submitted successfully!`, 'bot');
    toast({
        title: `${formType === 'application' ? 'Application' : 'Notice'} Submitted`,
        description: "Your submission has been recorded.",
    });
  }


  return (
    <>
    <div className="p-4 bg-background border-t">
      <AnimatePresence>
        {(isSuggesting || suggestions.length > 0) && (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 mb-2"
          >
            {isSuggesting && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {!isSuggesting && suggestions.map((s, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                {s}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about fees, exams, or type 'leave application'..."
          className="pr-20 pl-10 min-h-[48px] resize-none"
          rows={1}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
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
    </>
  );
}
