
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
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
import type { UserRole, AppUser } from "../chat/chat-widget";
import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpFormValues = z.infer<typeof formSchema>;

interface SignUpFormProps {
    role: UserRole;
    onBack: () => void;
    onNavigateToLogin: () => void;
}

export function SignUpForm({ role, onBack, onNavigateToLogin }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
        const usersRef = collection(db, "users");
        // 1. Check if a user with this email already exists
        const q = query(usersRef, where("email", "==", data.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            toast({
                title: "Sign Up Failed",
                description: "An account with this email already exists. Please login instead.",
                variant: "destructive",
            });
            return;
        }

        // 2. Create the new user object
        const newUser: Omit<AppUser, 'id'> = {
            name: data.name,
            email: data.email,
            role: role,
            createdAt: serverTimestamp(), // Add a timestamp for good practice
        };

        // 3. Add the user to Firestore
        const docRef = await addDoc(usersRef, newUser);
        
        login({ ...newUser, id: docRef.id });

        toast({
            title: "Account Created!",
            description: "You have been successfully signed up and logged in.",
        });
        
    } catch (error: any) {
        console.error("Signup error: ", error);
        toast({
            title: "Sign Up Failed",
            description: error.code === 'permission-denied' 
              ? "Missing or insufficient permissions. Please check Firestore rules."
              : "Could not create your account. Please try again.",
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
                    <FormLabel>Email</FormLabel>
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
                        <div className="relative">
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create a password" 
                                {...field}
                                className="pr-10" 
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-1.2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
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
