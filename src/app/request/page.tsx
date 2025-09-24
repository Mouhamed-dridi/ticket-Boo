"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTickets } from "@/hooks/use-tickets";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const requestFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  id: z.string().min(1, { message: "ID is required." }),
  deviceProblem: z.string({ required_error: "Please select a problem type." }),
  site: z.string({ required_error: "Please select a site." }),
  postName: z.string({ required_error: "Please select a post name." }),
});

const problemTypes = [
    "Slow performance",
    "Won't turn on",
    "Software issue",
    "Hardware damage",
    "Connectivity problem",
    "Other"
];
const sites = ["Head Office", "Branch A", "Branch B"];
const postNames = ["Manager", "Developer", "Designer", "Support Staff"];

export default function RequestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { addTicket } = useTickets();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      name: "",
      id: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof requestFormSchema>) {
    addTicket({
      deviceName: values.deviceProblem, // Re-using deviceName for the problem
      issueDescription: `Site: ${values.site}, Post: ${values.postName}, User: ${values.name} (${values.id})`,
      priority: 'Medium', // Defaulting priority as it's not in the new form
      submittedBy: user!.username,
    });
    toast({
      title: "Request Submitted!",
      description: "Your IT ticket has been successfully created.",
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Submit a new IT Request</CardTitle>
            <CardDescription>
              Please fill out the form below to report an issue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="deviceProblem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Problem</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a problem type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {problemTypes.map(problem => (
                            <SelectItem key={problem} value={problem}>{problem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="site"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a site" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sites.map(site => (
                             <SelectItem key={site} value={site}>{site}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="postName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a post name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {postNames.map(post => (
                             <SelectItem key={post} value={post}>{post}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
