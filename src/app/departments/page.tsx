
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Cpu, Dna, FlaskConical, Laptop, Wrench } from "lucide-react";
import Image from "next/image";

const departments = [
  {
    name: "Computer Engineering",
    description: "Focuses on the design, development, and application of computing systems. Covers subjects like AI, machine learning, and cybersecurity.",
    icon: <Cpu />,
    image: "https://picsum.photos/seed/sanjivani-cs/400/250",
    aiHint: "computer science students"
  },
  {
    name: "Information Technology",
    description: "Deals with the use of computers and software to manage information. Specializations include data science, cloud computing, and IoT.",
    icon: <Laptop />,
    image: "https://picsum.photos/seed/sanjivani-it/400/250",
    aiHint: "information technology office"
  },
  {
    name: "Mechanical Engineering",
    description: "The branch that applies principles of engineering, physics, and materials science for the design and manufacturing of mechanical systems.",
    icon: <Cog />,
    image: "https://picsum.photos/seed/sanjivani-mech/400/250",
    aiHint: "mechanical engineering gears"
  },
  {
    name: "Civil Engineering",
    description: "A professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment.",
    icon: <Wrench />,
    image: "https://picsum.photos/seed/sanjivani-civil/400/250",
    aiHint: "civil engineering bridge"
  },
   {
    name: "Chemical Engineering",
    description: "Involves the production and manufacturing of products through chemical processes. This includes designing equipment, systems, and processes.",
    icon: <FlaskConical />,
    image: "https://picsum.photos/seed/sanjivani-chem/400/250",
    aiHint: "chemical engineering lab"
  },
  {
    name: "Biotechnology",
    description: "Combines biology with technology to create products for healthcare, agriculture, and environmental applications.",
    icon: <Dna />,
    image: "https://picsum.photos/seed/sanjivani-biotech/400/250",
    aiHint: "biotechnology dna strand"
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
                            width={400}
                            height={250}
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
