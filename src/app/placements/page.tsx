
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap } from "lucide-react";
import Image from "next/image";

const stats = [
    { title: "350+", description: "Companies Visited", icon: <Users /> },
    { title: "1200+", description: "Offers Made (2023-24)", icon: <TrendingUp /> },
    { title: "24 LPA", description: "Highest Package", icon: <Zap /> },
];

const recruiters = [
    "tcs.png", "infosys.png", "wipro.png", "cognizant.png", "capgemini.png", "accenture.png", "tech-mahindra.png", "hcl.png"
];

export default function PlacementsPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Training & Placements</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Launching successful careers through dedicated training and strong industry partnerships.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.description}</CardTitle>
                            <div className="text-primary">{stat.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stat.title}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-8">Our Top Recruiters</h2>
                 <div className="flex flex-wrap items-center justify-center gap-8">
                     {recruiters.map(logo => (
                         <div key={logo} className="grayscale hover:grayscale-0 transition-all">
                             <Image
                                src={`https://asset.brandfetch.io/idq5d70Mxf/id54y6O2i0.svg?updated=1721033481682`}
                                alt={logo.split('.')[0]}
                                width={120}
                                height={60}
                                className="object-contain"
                                data-ai-hint="company logo"
                            />
                         </div>
                     ))}
                 </div>
            </div>

             <div className="bg-secondary p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-8">Placement Highlights</h2>
                <ul className="space-y-4 max-w-2xl mx-auto text-muted-foreground">
                    <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">1</Badge> 
                        <p>Consistent placement record of over 90% for eligible students.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">2</Badge> 
                        <p>Dedicated pre-placement training covering aptitude, technical skills, and soft skills.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">3</Badge> 
                        <p>MoUs with leading companies for internships and live projects.</p>
                    </li>
                     <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">4</Badge> 
                        <p>Strong alumni network in top-tier companies across the globe.</p>
                    </li>
                </ul>
             </div>

        </div>
    );
}
