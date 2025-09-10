
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VaartaLogo } from '@/components/icons';
import { ArrowRight, BookOpen, Briefcase, Users, Cpu, Laptop, Cog, Wrench } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
          <Image
            src="https://picsum.photos/seed/sanjivani-hero/1800/800"
            alt="Sanjivani College Campus"
            fill
            className="object-cover -z-10 brightness-50"
            data-ai-hint="college campus building"
          />
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Welcome to Sanjivani College of Engineering
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
              Fostering innovation and excellence in engineering education for over four decades.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/admissions">
                Apply Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">About Sanjivani</h2>
              <p className="mt-4 text-muted-foreground">
                Sanjivani College of Engineering, established in 1983, is a premier institute dedicated to providing high-quality technical education. Our vision is to be a leading center of learning, research, and innovation, nurturing professionals who can make a significant contribution to society.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://picsum.photos/seed/sanjivani-about/600/400"
                alt="Students collaborating"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                data-ai-hint="students collaborating classroom"
              />
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-12 md:py-20 bg-secondary">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Departments</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
              Explore our diverse range of engineering disciplines.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Computer Engineering', icon: <Cpu /> },
                { name: 'Information Technology', icon: <Laptop /> },
                { name: 'Mechanical Engineering', icon: <Cog /> },
                { name: 'Civil Engineering', icon: <Wrench /> },
              ].map((dept) => (
                <Card key={dept.name}>
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      {dept.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardContent>
                </Card>
              ))}
            </div>
             <Button asChild variant="link" className="mt-6 text-primary">
                <Link href="/departments">
                  View All Departments <ArrowRight className="ml-1" />
                </Link>
              </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
