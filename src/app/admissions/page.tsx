
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, UserCheck } from "lucide-react";

const admissionSteps = [
    {
        step: 1,
        title: "Online Application",
        description: "Fill out the online application form with your academic and personal details. Ensure all information is accurate.",
        icon: <FileText />
    },
    {
        step: 2,
        title: "Entrance Exam & Merit List",
        description: "Appear for the required entrance examinations (MHT-CET/JEE). Admission is based on the merit list declared by the competent authority.",
        icon: <UserCheck />
    },
    {
        step: 3,
        title: "Counseling & Seat Allotment",
        description: "Participate in the Centralized Admission Process (CAP) for counseling and seat allotment based on your merit rank.",
        icon: <CheckCircle />
    }
];

export default function AdmissionsPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Admissions Process</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Your journey to becoming a Sanjivani engineer starts here.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    {/* Dotted line connector */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-px bg-border border-l-2 border-dashed"></div>

                    {admissionSteps.map((item, index) => (
                        <div key={item.step} className="grid md:grid-cols-2 gap-8 items-center mb-12">
                            <div className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                                                {item.step}
                                            </div>
                                            <CardTitle className="text-2xl">{item.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className={`hidden md:flex items-center justify-center ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                                <div className="p-6 bg-primary/10 rounded-full text-primary">
                                    {React.cloneElement(item.icon, { className: "h-12 w-12" })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <h3 className="text-2xl font-bold">Ready to Apply?</h3>
                    <p className="text-muted-foreground mt-2">Visit the official admissions portal for more details.</p>
                    <Button size="lg" className="mt-6">Visit DTE Maharashtra Website</Button>
                </div>
            </div>
        </div>
    );
}
