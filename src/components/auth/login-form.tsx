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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
    role: UserRole;
    onLoginSuccess: () => void;
    onBack: () => void;
    onNavigateToSignup: () => void;
}

export function LoginForm({ role, onLoginSuccess, onBack, onNavigateToSignup }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call for login
    setTimeout(() => {
      // In a real app, you would validate credentials here.
      // For the prototype, we'll just check for a mock user.
      const mockEmails: Record<string, string> = {
        student: "rohan.sharma@example.com",
        faculty: "priya.mehta@example.com",
        parent: "anand.sharma@example.com",
      }

      if (data.email === mockEmails[role] && data.password === "password") {
        toast({
          title: "Login Successful",
          description: `Welcome, ${role}!`,
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 1000);
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
                    <Input type="password" placeholder="Enter your password" {...field} />
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
