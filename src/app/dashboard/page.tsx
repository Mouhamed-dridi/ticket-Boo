"use client";

import { useAuth } from "@/hooks/use-auth";
import { useTickets } from "@/hooks/use-tickets";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Download, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import type { Ticket, TicketStatus } from "@/lib/types";
import { fr } from 'date-fns/locale';


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { tickets, loading: ticketsLoading, updateTicketStatus } = useTickets();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  const { activeTickets, archivedTickets } = useMemo(() => {
    const sortedTickets = [...tickets].sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
    return {
      activeTickets: sortedTickets.filter(t => t.status === "Pending"),
      archivedTickets: sortedTickets.filter(t => t.status === "Done" || t.status === "Cancelled"),
    };
  }, [tickets]);

  const handleDownload = () => {
    const csvHeader = "ID,Utilisateur,Matricule,Appareil,Site,Nom du poste,Statut,Créé le\n";
    
    const escapeCsvCell = (cellData: string) => {
      if (/[",\n]/.test(cellData)) {
        return `"${cellData.replace(/"/g, '""')}"`;
      }
      return cellData;
    };

    const csvRows = tickets.map(t => 
      [
        escapeCsvCell(t.id),
        escapeCsvCell(t.userName),
        escapeCsvCell(t.userMatricule),
        escapeCsvCell(t.deviceName),
        escapeCsvCell(t.site),
        escapeCsvCell(t.postName),
        escapeCsvCell(t.status),
        escapeCsvCell(format(parseISO(t.createdAt), 'yyyy-MM-dd HH:mm:ss'))
      ].join(',')
    ).join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || ticketsLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const statusTranslations: Record<TicketStatus, string> = {
    Pending: "En attente",
    Done: "Terminé",
    Cancelled: "Annulé",
  };

  const TicketTable = ({ data }: { data: Ticket[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Appareil</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Nom du poste</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.userName} ({ticket.userMatricule})</TableCell>
                <TableCell>{ticket.deviceName}</TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell>{ticket.postName}</TableCell>
                <TableCell className="text-center"><Badge variant={ticket.status === 'Pending' ? 'secondary' : 'outline'}>{statusTranslations[ticket.status]}</Badge></TableCell>
                <TableCell>{format(parseISO(ticket.createdAt), 'd MMM yyyy', { locale: fr })}</TableCell>
                <TableCell className="text-right">
                    {ticket.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => updateTicketStatus(ticket.id, 'Done')} aria-label="Marquer comme terminé">
                                <CheckCircle className="h-5 w-5 text-green-500"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => updateTicketStatus(ticket.id, 'Cancelled')} aria-label="Annuler">
                                <XCircle className="h-5 w-5 text-red-500"/>
                            </Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => updateTicketStatus(ticket.id, 'Pending')} aria-label="Rouvrir la demande">
                            <RefreshCcw className="h-5 w-5 text-blue-500" />
                        </Button>
                    )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                Aucun ticket trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Tableau de bord administrateur</h1>
                <Button onClick={handleDownload} disabled={tickets.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger en CSV
                </Button>
            </div>
            <Tabs defaultValue="active">
                <TabsList>
                    <TabsTrigger value="active">Demandes Actives</TabsTrigger>
                    <TabsTrigger value="archive">Archive</TabsTrigger>
                </TabsList>
                <Card className="mt-4">
                    <CardContent className="p-0">
                        <TabsContent value="active" className="m-0">
                            <TicketTable data={activeTickets} />
                        </TabsContent>
                        <TabsContent value="archive" className="m-0">
                            <TicketTable data={archivedTickets} />
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
      </main>
    </div>
  );
}
