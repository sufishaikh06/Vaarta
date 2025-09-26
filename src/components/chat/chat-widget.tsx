
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Users, GraduationCap, Building, User, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ChatView } from './chat-view';
import { cn } from '@/lib/utils';
import { VaartaLogo } from '../icons';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';
import { Button } from '../ui/button';

export type UserRole = 'student' | 'faculty' | 'parent' | 'guest';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: any; 
}


type ViewState = 'role-selection' | 'chat';

// Hardcoded users for direct login bypass
const hardcodedUsers: Record<UserRole, AppUser> = {
    student: { id: 'user_student_suraj', name: 'Suraj Kelaginamani', email: 'kelaginamanisuraj777@gmail.com', role: 'student', ERP_id: 'STU54321' },
    faculty: { id: 'user_faculty_1', name: 'Dr. Priya Mehta', email: 'priya.mehta@example.com', role: 'faculty', ERP_id: 'FAC67890' },
    parent: { id: 'user_parent_1', name: 'Mr. Anand Sharma', email: 'anand.sharma@example.com', role: 'parent', child_id: 'user_student_1' },
    guest: { id: 'guest', name: 'Guest', email: '', role: 'guest' },
};

export function ChatWidget({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const { user, login, logout } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('role-selection');
  const fabIcon = imageData.chatbot.fabIcon;

  const handleRoleSelect = (role: UserRole) => {
    const userToLogin = hardcodedUsers[role];
    login(userToLogin);
    setViewState('chat');
  };

  const handleLogout = () => {
    logout();
    setViewState('role-selection');
    onToggle(); // Close chat on logout
  };
  
  const roles = [
    { id: 'student', name: 'Student', icon: <GraduationCap /> },
    { id: 'faculty', name: 'Faculty', icon: <User /> },
    { id: 'parent', name: 'Parent', icon: <Users /> },
    { id: 'guest', name: 'Guest', icon: <Building /> },
  ];

  // Determine the current view
  const currentView = user ? 'chat' : viewState;


  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
          aria-label="Open chat"
        >
          <Image src={fabIcon.src} alt={fabIcon.alt} width={80} height={80} className="object-cover rounded-full" />
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
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b bg-background">
              <div className="flex items-center gap-2">
                <VaartaLogo className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">Vaarta</h2>
              </div>
              <button
                onClick={() => {
                  if (user) logout(); // Log out if closing
                  setViewState('role-selection');
                  onToggle();
                }}
                className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            {/* Main Content */}
            <div className="flex-grow bg-background flex flex-col overflow-y-auto">
              <AnimatePresence mode="wait">
                {currentView === 'role-selection' && (
                  <motion.div
                    key="role-selection"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center h-full p-6"
                  >
                    <h3 className="text-2xl font-bold mb-2 text-center">Welcome to Vaarta!</h3>
                    <p className="text-muted-foreground mb-8 text-center">Please select your role to continue.</p>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      {roles.map((role) => (
                        <Button
                          key={role.id}
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center gap-2 text-lg hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleRoleSelect(role.id as UserRole)}
                        >
                          {role.icon}
                          <span className="text-sm font-medium">{role.name}</span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {currentView === 'chat' && user && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="h-full flex flex-col"
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
