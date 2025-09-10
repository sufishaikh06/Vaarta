'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Users, GraduationCap, Building, User } from 'lucide-react';
import { useState } from 'react';
import { ChatView } from './chat-view';
import { cn } from '@/lib/utils';
import { VaartaLogo } from '../icons';
import { LoginForm } from '../auth/login-form';
import { SignUpForm } from '../auth/signup-form';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

export type UserRole = 'student' | 'faculty' | 'parent' | 'guest';
export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

type ViewState = 'role-selection' | 'login' | 'signup' | 'chat';

export function ChatWidget({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const { user, login, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('guest');
  const [viewState, setViewState] = useState<ViewState>('role-selection');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'guest') {
      login({ id: 'guest', name: 'Guest', email: '', role: 'guest' });
    } else {
      setViewState('login');
    }
  };

  const handleLogout = () => {
    logout();
    setViewState('role-selection');
  };
  
  const handleBackToRoleSelection = () => {
    setViewState('role-selection');
  };

  const navigateToSignup = () => setViewState('signup');
  const navigateToLogin = () => setViewState('login');

  const roles = [
    { id: 'student', name: 'Student', icon: <GraduationCap /> },
    { id: 'faculty', name: 'Faculty', icon: <User /> },
    { id: 'parent', name: 'Parent', icon: <Users /> },
    { id: 'guest', name: 'Guest', icon: <Building /> },
  ];

  // Determine the current view
  let currentView: ViewState = viewState;
  if (user) {
    currentView = 'chat';
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50 overflow-hidden"
          aria-label="Open chat"
        >
           <Image src="/bot-icon.png" alt="Chat Bot Icon" layout="fill" objectFit="cover" />
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
                {currentView === 'role-selection' && (
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

                {currentView === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                      <LoginForm 
                        role={selectedRole}
                        onBack={handleBackToRoleSelection} 
                        onNavigateToSignup={navigateToSignup}
                      />
                  </motion.div>
                )}
                
                {currentView === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                      <SignUpForm
                        role={selectedRole}
                        onBack={navigateToLogin}
                        onNavigateToLogin={navigateToLogin}
                      />
                  </motion.div>
                )}

                {currentView === 'chat' && user && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="h-full"
                  >
                      <ChatView role={user.role} onLogout={handleLogout} />
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
