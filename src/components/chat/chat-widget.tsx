
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Users, GraduationCap, Building, User } from 'lucide-react';
import { useState } from 'react';
import { ChatView } from './chat-view';
import { cn } from '@/lib/utils';
import { VaartaLogo } from '../icons';

export type UserRole = 'student' | 'faculty' | 'parent' | 'guest';

export function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [role, setRole] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setRole('guest');
    setIsAuthenticated(false);
  };

  const roles = [
    { id: 'student', name: 'Student', icon: <GraduationCap /> },
    { id: 'faculty', name: 'Faculty', icon: <User /> },
    { id: 'parent', name: 'Parent', icon: <Users /> },
    { id: 'guest', name: 'Guest', icon: <Building /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full h-full md:w-[440px] md:h-[80vh] md:max-h-[700px] bg-card border border-border rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <VaartaLogo className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Vaarta</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Main Content */}
          <div className="flex-grow bg-background flex flex-col">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                 <h3 className="text-2xl font-bold text-foreground mb-2">Welcome to Vaarta</h3>
                 <p className="text-muted-foreground mb-8">Please select your role to get started.</p>
                 <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {roles.map((r) => (
                        <button key={r.id} onClick={() => handleLogin(r.id as UserRole)} className="flex flex-col items-center justify-center gap-2 p-6 bg-secondary hover:bg-accent rounded-lg transition-colors duration-200 group">
                            <div className="h-12 w-12 text-primary group-hover:scale-110 transition-transform">{r.icon}</div>
                            <span className="font-semibold text-foreground">{r.name}</span>
                        </button>
                    ))}
                 </div>
              </div>
            ) : (
              <ChatView role={role} onLogout={handleLogout} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
