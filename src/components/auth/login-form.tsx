
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
    role: UserRole;
    onBack: () => void;
    onNavigateToSignup: () => void;
}

export function LoginForm({ role, onBack, onNavigateToSignup }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // For this prototype, we are not checking the password.
      // A real application would use Firebase Authentication for secure password handling.

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", data.email), where("role", "==", role));
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("No account found with this email for the selected role. Please sign up.");
      }

      // Assuming one user per email/role combo
      const userDoc = querySnapshot.docs[0];
      
      const user = { id: userDoc.id, ...userDoc.data() } as AppUser;
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${user.name}!`,
      });
      login(user);

    } catch (error: any) {
       toast({
          title: "Login Failed",
          description: error.message || "An error occurred during login.",
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
            <h3 className="text-xl font-bold capitalize">{role} Login</h3>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                 <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot?
                    </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      {...field}
                      className="pr-10"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
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
                Login
            </Button>
        </form>
        </Form>
        <div className="mt-4 text-center text-sm">
            Don't have an account? <Button variant="link" className="p-0 h-auto" onClick={onNavigateToSignup}>Sign up</Button>
        </div>
    </div>
  );
}
