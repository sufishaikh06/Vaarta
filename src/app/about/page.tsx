
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Target, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">About Sanjivani COE</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    A legacy of excellence in technical education since 1983.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Our History & Vision</h2>
                    <p className="text-muted-foreground">
                        Founded in 1983 by the Sanjivani Rural Education Society, our college was established with the mission to provide top-tier technical education to rural students. Over the decades, we have grown into a nationally recognized institution, known for our academic rigor, state-of-the-art infrastructure, and strong industry connections.
                    </p>
                    <p className="text-muted-foreground">
                        Our vision is to empower our students with the knowledge, skills, and values needed to become leaders and innovators who can solve the complex challenges of the 21st century.
                    </p>
                </div>
                <div>
                     <Image
                        src="https://picsum.photos/seed/sanjivani-history/600/450"
                        alt="College building"
                        width={600}
                        height={450}
                        className="rounded-xl shadow-lg"
                        data-ai-hint="college building modern"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
                 <Card>
                    <CardHeader>
                        <Award className="h-12 w-12 mx-auto text-primary" />
                        <CardTitle className="mt-4">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">To deliver quality technical education, foster research and development, and build strong character and ethical values among our students.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Target className="h-12 w-12 mx-auto text-primary" />
                        <CardTitle className="mt-4">Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">To be a premier technical institute, recognized globally for excellence in education, research, and innovation.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Users className="h-12 w-12 mx-auto text-primary" />
                        <CardTitle className="mt-4">Our Values</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Integrity, Excellence, Innovation, Social Responsibility, and Lifelong Learning are the pillars of our institution.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
