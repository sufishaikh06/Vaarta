'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
}

export function ChatInput({ onSendMessage, isStreaming }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <TooltipProvider>
      <div className="p-4 bg-background border-t">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="pr-20 min-h-[48px] resize-none"
            rows={1}
            disabled={isStreaming}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsRecording(prev => !prev)}>
                        <Mic className={cn("h-5 w-5 text-muted-foreground", isRecording && "text-primary animate-pulse")} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Voice Input (coming soon)</TooltipContent>
            </Tooltip>
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isStreaming} className="h-8 w-8">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
