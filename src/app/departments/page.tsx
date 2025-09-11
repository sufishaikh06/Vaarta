
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Cpu, Dna, FlaskConical, Laptop, Wrench } from "lucide-react";
import Image from "next/image";
import imageData from '@/lib/placeholder-images.json';

const departments = [
  {
    name: "Computer Engineering",
    description: "Focuses on the design, development, and application of computing systems. Covers subjects like AI, machine learning, and cybersecurity.",
    icon: <Cpu />,
    image: imageData.departments.computer.src,
    width: imageData.departments.computer.width,
    height: imageData.departments.computer.height,
    aiHint: imageData.departments.computer.aiHint
  },
  {
    name: "Information Technology",
    description: "Deals with the use of computers and software to manage information. Specializations include data science, cloud computing, and IoT.",
    icon: <Laptop />,
    image: imageData.departments.it.src,
    width: imageData.departments.it.width,
    height: imageData.departments.it.height,
    aiHint: imageData.departments.it.aiHint
  },
  {
    name: "Mechanical Engineering",
    description: "The branch that applies principles of engineering, physics, and materials science for the design and manufacturing of mechanical systems.",
    icon: <Cog />,
    image: imageData.departments.mechanical.src,
    width: imageData.departments.mechanical.width,
    height: imageData.departments.mechanical.height,
    aiHint: imageData.departments.mechanical.aiHint
  },
  {
    name: "Civil Engineering",
    description: "A professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment.",
    icon: <Wrench />,
    image: imageData.departments.civil.src,
    width: imageData.departments.civil.width,
    height: imageData.departments.civil.height,
    aiHint: imageData.departments.civil.aiHint
  },
   {
    name: "Chemical Engineering",
    description: "Involves the production and manufacturing of products through chemical processes. This includes designing equipment, systems, and processes.",
    icon: <FlaskConical />,
    image: imageData.departments.chemical.src,
    width: imageData.departments.chemical.width,
    height: imageData.departments.chemical.height,
    aiHint: imageData.departments.chemical.aiHint
  },
  {
    name: "Biotechnology",
    description: "Combines biology with technology to create products for healthcare, agriculture, and environmental applications.",
    icon: <Dna />,
    image: imageData.departments.biotech.src,
    width: imageData.departments.biotech.width,
    height: imageData.departments.biotech.height,
aiHint: imageData.departments.biotech.aiHint
  },
];

export default function DepartmentsPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Our Departments</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    A diverse range of disciplines to fuel your passion for engineering.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.map((dept) => (
                    <Card key={dept.name} className="overflow-hidden flex flex-col">
                        <Image
                            src={dept.image}
                            alt={dept.name}
                            width={dept.width}
                            height={dept.height}
                            className="w-full h-48 object-cover"
                            data-ai-hint={dept.aiHint}
                        />
                        <CardHeader className="flex-row items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-full text-primary mt-1">
                                {dept.icon}
                            </div>
                            <div>
                                <CardTitle>{dept.name}</CardTitle>
                                <CardDescription className="mt-2 line-clamp-3">{dept.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
