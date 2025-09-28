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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const reportFormSchema = z.object({
  site: z.string({ required_error: "Veuillez sélectionner un site." }),
  postName: z.string({ required_error: "Veuillez sélectionner un nom de poste." }),
  problem: z.string({ required_error: "Veuillez sélectionner un problème." }),
  os: z.string({ required_error: "Veuillez sélectionner un système d'exploitation." }),
  pcType: z.string({ required_error: "Veuillez sélectionner un type de PC." }),
  description: z.string().min(1, { message: "La description est requise." }),
});

const sites = ["misfat 1", "misfat 2", "misfat 3"];

const postNamesBySite: Record<string, string[]> = {
    "misfat 1": [
        "PQ1-B03B10", "PQ1-ATELIER-MAI", "PQ1-ATELIERMATI", "PQ1-B11B14", "PQ1-BYPASS",
        "PQ1-C04C24", "PQ1-C35C38", "PQ1-HYD", "PQ1-HYDAUTO", "PQ1-PAOT", "PQ1-PAOT2",
        "PQ1-PEINT", "PQ1-PEINTAUTO", "PQ1-PRFAAI", "PQ1-ROBOFIL"
    ],
    "misfat 2": [
        "PQ2-D30", "PQ2-D06D16", "PQ2-D27", "PQ2-F66C30", "PQ2-LCART", "PQ2-LCARTAUTO",
        "PQ2-LFAI", "PQ2-LFAV1", "PQ2-LFAV2", "PQ2-LFAV3", "PQ2-LFAVAUTO", "PQ2-LFGR1",
        "PQ2-LFGR2", "PQ2-LFGR3"
    ],
    "misfat 3": [
        "PQ3-BANDE", "PQ3-D03D31", "PQ3-D18", "PQ3-D28D14", "PQ3-D29", "PQ3-ESSENCE",
        "PQ3-G19", "PQ3-G26", "PQ3-G33", "PQ3-G39", "PQ3-H04", "PQ3-H08H27", "PQ3-H39",
        "PQ3-H46", "PQ3-H53", "PQ3-H55", "PQ3-ISOTHERME", "PQ3-KITJOINT", "PQ3-LFAAI",
        "PQ3-LFAH", "PQ3-LFAP", "PQ3-LFH53", "PQ3-LFHYD", "PQ3-LFN-H53", "PQ3-LFVN02",
        "PQ3-LFVN1", "PQ3-LINP", "PQ3-M02M12", "PQ3-M21M41", "PQ3-MONOBLOC",
        "PQ3-N25N29", "PQ3-Q01M43"
    ],
};
const defaultPostNames = ["Manager", "Développeur", "Designer", "Personnel de soutien"];

const problemTypes = [
    "probleme ecran", 
    "probleme lentuser systeme", 
    "probleme docuchette",
    "imp etiquette",
    "demande cereaton copt gedtet coswin"
];

const osTypes = ["windows 10", "windows 11"];
const pcTypes = ["dell intel", "other"];

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [postNames, setPostNames] = useState<string[]>(defaultPostNames);

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
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
    if (!authLoading && (!user || user.role !== 'admin')) {
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

  function onSubmit(values: z.infer<typeof reportFormSchema>) {
    console.log(values);
    toast({
      title: "Rapport soumis !",
      description: "Votre rapport de suivi a été envoyé avec succès.",
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Créer un rapport de suivi</CardTitle>
            <CardDescription>
              Veuillez remplir le formulaire pour créer un nouveau rapport de suivi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                </div>
                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problème</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un problème" />
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                    control={form.control}
                    name="os"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>OS</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un OS" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {osTypes.map(os => (
                                <SelectItem key={os} value={os}>{os}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="pcType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type PC</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un type de PC" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {pcTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez le problème en détail..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Soumettre le rapport
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
