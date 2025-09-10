
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, School } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/components/chat/chat-widget';
import { useAuth } from '@/context/auth-context';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/departments', label: 'Departments' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/placements', label: 'Placements' },
  { href: '/contact', label: 'Contact' },
];

const roleDashboards: Record<Exclude<UserRole, 'guest'>, { href: string; label: string }> = {
    student: { href: '/student-dashboard', label: 'Student Dashboard' },
    faculty: { href: '/faculty-dashboard', label: 'Faculty Dashboard' },
    parent: { href: '/parent-dashboard', label: 'Parent Dashboard' },
};

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Sanjivani COE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
            {role && role !== 'guest' && (
              <Button asChild>
                  <Link href={roleDashboards[role].href}>{roleDashboards[role].label}</Link>
              </Button>
            )}
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                    {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'transition-colors hover:text-primary',
                            pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                        )}
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
