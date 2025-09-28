"use client";

import { useAuth } from "@/hooks/use-auth";
import { useReports } from "@/hooks/use-reports";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Server, HardDrive, Monitor, AlertTriangle, FileText, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import type { Report } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function ReportDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { reports, loading: reportsLoading } = useReports();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
    );
  }, [reports]);

  if (authLoading || reportsLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span>{report.problem}</span>
        </CardTitle>
        <CardDescription>
          {report.site} - {report.postName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
          <p className="text-sm">{report.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{report.pcType}</span>
        </div>
        <div className="flex items-center gap-3">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{report.os}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            Créé le {format(parseISO(report.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Tableau de bord des rapports
            </h1>
            <Button onClick={() => router.push('/report')}>Créer un rapport</Button>
          </div>
          {sortedReports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
                <Server className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-6 text-xl font-semibold">Aucun rapport trouvé</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Créez un rapport pour commencer à voir les données ici.
                </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
