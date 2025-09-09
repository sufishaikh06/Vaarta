import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, GraduationCap, MessageSquareHeart, Users } from 'lucide-react';
import { VaartaBotLogo } from '@/components/icons';
import Image from 'next/image';

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'Multilingual Chat',
    description: 'Speaks your language. Get answers in English, Hindi, and regional languages.',
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: 'Instant Info',
    description: 'Access FAQs, timetables, notices, and documents in one place.',
  },
  {
    icon: <MessageSquareHeart className="h-10 w-10 text-primary" />,
    title: 'Easy Communication',
    description: 'Students can apply for leave, and faculty can broadcast notices effortlessly.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'For Everyone',
    description: 'Separate, role-based access for students, faculty, and parents.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <VaartaBotLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">VaartaBot</span>
          </Link>
          <Button asChild>
            <Link href="/chat">Launch Chat</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-800">
              Welcome to <span className="text-primary">VaartaBot</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Your intelligent, multilingual assistant for seamless college communication. Simplifying campus life, one conversation at a time.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/chat">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need, All in One Place</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                VaartaBot streamlines communication for the entire college community.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Smart, Simple, and Secure</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Built for the demands of a modern educational institution. VaartaBot leverages cutting-edge AI and robust cloud infrastructure to deliver a reliable experience.
                    </p>
                    <ul className="mt-6 space-y-4 text-muted-foreground">
                        <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">AI-Powered Assistance:</span> Get relevant answers and suggestions instantly.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">Role-Based Access:</span> Tailored interfaces for Students, Faculty, and Parents.</span>
                        </li>
                         <li className="flex items-start">
                            <CheckIcon className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
                            <span><span className="font-semibold text-foreground">Secure by Design:</span> All communications are secured and access is controlled.</span>
                        </li>
                    </ul>
                </div>
                <div className="order-1 md:order-2">
                    <Image 
                        src="https://picsum.photos/600/400" 
                        alt="Chatbot Interface"
                        data-ai-hint="chatbot interface"
                        width={600}
                        height={400}
                        className="rounded-xl shadow-2xl"
                    />
                </div>
            </div>
        </section>

      </main>

      <footer className="py-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} VaartaBot. A Smart India Hackathon Project.</p>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}