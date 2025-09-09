'use client';
import { useState } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VaartaLogo } from '@/components/icons';
import Link from 'next/link';

export type UserRole = 'student' | 'faculty' | 'parent';

export default function ChatPage() {
  const [role, setRole] = useState<UserRole>('student');
  
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
       <div className="w-full max-w-5xl h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <VaartaLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-primary">Vaarta</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Acting as:</span>
             <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <ChatLayout role={role} />
      </div>
    </main>
  );
}
