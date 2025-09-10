
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container py-12 px-4 md:px-6">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Get in Touch</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    We are here to help. Contact us for any queries regarding admissions, academics, or events.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your Name" required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Your Email" required />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="Query Subject" required />
                            </div>
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." required />
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
                <div className="space-y-8">
                     <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <MapPin className="h-8 w-8 text-primary" />
                            <CardTitle>Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Sanjivani College of Engineering, Kopargaon, Tal. Kopargaon, Dist. Ahmednagar, Maharashtra, India. Pincode-423603</p>
                        </CardContent>
                    </Card>
                     <div className="grid sm:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader className="flex-row items-center gap-4">
                                <Phone className="h-8 w-8 text-primary" />
                                <CardTitle>Phone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">+91-2423-222862</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex-row items-center gap-4">
                                <Mail className="h-8 w-8 text-primary" />
                                <CardTitle>Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">principal@sanjivani.org.in</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
