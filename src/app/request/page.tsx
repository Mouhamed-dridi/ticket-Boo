"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  name: z.string().min(2, { message: "Le nom et prénom doit comporter au moins 2 caractères." }),
  id: z.string().min(1, { message: "La matricule est requise." }),
  deviceProblem: z.string({ required_error: "Veuillez sélectionner un type de problème." }),
  site: z.string({ required_error: "Veuillez sélectionner un site." }),
  postName: z.string({ required_error: "Veuillez sélectionner un nom de poste." }),
});

const problemTypes = [
    "imprimante étiquette",
    "code barre",
    "souris",
    "écran"
];
const sites = ["misfat 1", "misfat 2", "misfat 3"];

const postNamesBySite: Record<string, string[]> = {
    "misfat 1": [
        "PQ1-B03B10", "PQ1-ATELIER-MAI", "PQ1-ATELIERMATI", "PQ1-B11B14", "PQ1-BYPASS",
        "PQ1-C04C24", "PQ1-C35C38", "PQ1-HYD", "PQ1-HYDAUTO", "PQ1-PAOT", "PQ1-PAOT2",
        "PQ1-PEINT", "PQ1-PEINTAUTO", "PQ1-PRFAAI", "PQ1-ROBOFIL"
    ],
    "misfat 2": ["Poste A2", "Poste B2", "Poste C2"],
    "misfat 3": ["Poste A3", "Poste B3", "Poste C3"],
};
const defaultPostNames = ["Manager", "Développeur", "Designer", "Personnel de soutien"];


export default function RequestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { addTicket } = useTickets();
  const { toast } = useToast();
  
  const [postNames, setPostNames] = useState<string[]>(defaultPostNames);

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      name: "",
      id: "",
    },
  });

  const selectedSite = useWatch({
      control: form.control,
      name: 'site'
  });

  useEffect(() => {
    if (selectedSite) {
        setPostNames(postNamesBySite[selectedSite] || defaultPostNames);
        form.setValue('postName', '');
    } else {
        setPostNames(defaultPostNames);
    }
  }, [selectedSite, form]);

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
      deviceName: values.deviceProblem,
      issueDescription: `Site: ${values.site}, Poste: ${values.postName}, Utilisateur: ${values.name} (${values.id})`,
      priority: 'Medium',
      submittedBy: user!.username,
    });
    toast({
      title: "Demande soumise !",
      description: "Votre ticket informatique a été créé avec succès.",
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Soumettre une nouvelle demande informatique</CardTitle>
            <CardDescription>
              Veuillez remplir le formulaire ci-dessous pour signaler un problème.
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
                        <FormLabel>Nom et Prénom</FormLabel>
                        <FormControl>
                            <Input placeholder="ex: Jean Dupont" {...field} />
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
                        <FormLabel>Matricule</FormLabel>
                        <FormControl>
                            <Input placeholder="ex: 12345" {...field} />
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
                      <FormLabel>Problème d'appareil</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type de problème" />
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
                            <SelectValue placeholder="Sélectionnez un site" />
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
                      <FormLabel>Nom du poste</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un nom de poste" />
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
                <div className="flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Soumettre la demande
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
