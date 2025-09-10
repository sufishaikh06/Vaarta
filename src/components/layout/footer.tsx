
import Link from 'next/link';
import { School } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-2">
             <Link href="/" className="flex items-center gap-2 mb-2">
              <School className="h-6 w-6 text-primary" />
              <span className="font-bold">Sanjivani COE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
                Kopargaon, Ahmednagar, Maharashtra, India.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/admissions" className="text-muted-foreground hover:text-primary">Admissions</Link></li>
              <li><Link href="/departments" className="text-muted-foreground hover:text-primary">Departments</Link></li>
              <li><Link href="/placements" className="text-muted-foreground hover:text-primary">Placements</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact Us</h4>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: principal@sanjivani.org.in</li>
                <li>Phone: +91-2423-222862</li>
             </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sanjivani College of Engineering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
