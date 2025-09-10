'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "../chat/chat-widget";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpFormValues = z.infer<typeof formSchema>;

interface SignUpFormProps {
    role: UserRole;
    onSignupSuccess: () => void;
    onBack: () => void;
    onNavigateToLogin: () => void;
}

export function SignUpForm({ role, onSignupSuccess, onBack, onNavigateToLogin }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
        const newUser = {
            name: data.name,
            email: data.email,
            role: role,
            // In a real app, you would hash this password. For the prototype, we store it directly.
            // Do not do this in production.
            // password: data.password 
        };

        const docRef = await addDoc(collection(db, "users"), newUser);
        console.log("Document written with ID: ", docRef.id);
        
        toast({
            title: "Account Created!",
            description: "You have been successfully signed up.",
        });
        onSignupSuccess();

    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            title: "Sign Up Failed",
            description: "Could not create your account. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                <ArrowLeft />
            </Button>
            <h3 className="text-xl font-bold capitalize">{role} Sign Up</h3>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email / ERP ID</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
        </form>
        </Form>
        <div className="mt-4 text-center text-sm">
            Already have an account? <Button variant="link" className="p-0 h-auto" onClick={onNavigateToLogin}>Login</Button>
        </div>
    </div>
  );
}
