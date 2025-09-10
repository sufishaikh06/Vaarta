
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Users, GraduationCap, Building, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { ChatView } from './chat-view';
import { cn } from '@/lib/utils';
import { VaartaLogo } from '../icons';
import { LoginForm } from '../auth/login-form';
import { Button } from '../ui/button';

export type UserRole = 'student' | 'faculty' | 'parent' | 'guest';

type ViewState = 'role-selection' | 'login' | 'chat';

export function ChatWidget({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [role, setRole] = useState<UserRole>('guest');
  const [viewState, setViewState] = useState<ViewState>('role-selection');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'guest') {
      setViewState('chat');
    } else {
      setViewState('login');
    }
  };

  const handleLoginSuccess = () => {
    setViewState('chat');
  };

  const handleLogout = () => {
    setRole('guest');
    setViewState('role-selection');
  };
  
  const handleBackToRoleSelection = () => {
    setViewState('role-selection');
  }

  const roles = [
    { id: 'student', name: 'Student', icon: <GraduationCap /> },
    { id: 'faculty', name: 'Faculty', icon: <User /> },
    { id: 'parent', name: 'Parent', icon: <Users /> },
    { id: 'guest', name: 'Guest', icon: <Building /> },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
          aria-label="Open chat"
        >
          <MessageSquare className="h-8 w-8" />
        </button>
      )}

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
                onClick={onToggle}
                className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            {/* Main Content */}
            <div className="flex-grow bg-background flex flex-col">
              <AnimatePresence mode="wait">
                {viewState === 'role-selection' && (
                  <motion.div
                    key="role-selection"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center h-full p-8 text-center"
                  >
                    <h3 className="text-2xl font-bold text-foreground mb-2">Welcome to Vaarta</h3>
                    <p className="text-muted-foreground mb-8">Please select your role to get started.</p>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        {roles.map((r) => (
                            <button key={r.id} onClick={() => handleRoleSelect(r.id as UserRole)} className="flex flex-col items-center justify-center gap-2 p-6 bg-secondary hover:bg-accent rounded-lg transition-colors duration-200 group">
                                <div className="h-12 w-12 text-primary group-hover:scale-110 transition-transform">{r.icon}</div>
                                <span className="font-semibold text-foreground">{r.name}</span>
                            </button>
                        ))}
                    </div>
                  </motion.div>
                )}

                {viewState === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                      <LoginForm role={role} onLoginSuccess={handleLoginSuccess} onBack={handleBackToRoleSelection} />
                  </motion.div>
                )}

                {viewState === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="h-full"
                  >
                      <ChatView role={role} onLogout={handleLogout} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
