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
import type { Ticket, TicketPriority } from "@/lib/types";


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
    const csvHeader = "ID,Submitted By,Device Name,Issue Description,Priority,Status,Created At\n";
    
    const escapeCsvCell = (cellData: string) => {
      // If the cell data contains a comma, double quote, or newline, wrap it in double quotes.
      if (/[",\n]/.test(cellData)) {
        // Also, double up any existing double quotes.
        return `"${cellData.replace(/"/g, '""')}"`;
      }
      return cellData;
    };

    const csvRows = tickets.map(t => 
      [
        escapeCsvCell(t.id),
        escapeCsvCell(t.submittedBy),
        escapeCsvCell(t.deviceName),
        escapeCsvCell(t.issueDescription),
        escapeCsvCell(t.priority),
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
  
  const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
    const priorityClasses = {
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return <Badge className={`${priorityClasses[priority]} border-none`}>{priority}</Badge>;
  };

  const TicketTable = ({ data }: { data: Ticket[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">User</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.submittedBy}</TableCell>
                <TableCell>{ticket.deviceName}</TableCell>
                <TableCell className="max-w-xs truncate">{ticket.issueDescription}</TableCell>
                <TableCell className="text-center"><PriorityBadge priority={ticket.priority} /></TableCell>
                <TableCell className="text-center"><Badge variant={ticket.status === 'Pending' ? 'secondary' : 'outline'}>{ticket.status}</Badge></TableCell>
                <TableCell>{format(parseISO(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                    {ticket.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => updateTicketStatus(ticket.id, 'Done')} aria-label="Mark as Done">
                                <CheckCircle className="h-5 w-5 text-green-500"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => updateTicketStatus(ticket.id, 'Cancelled')} aria-label="Cancel">
                                <XCircle className="h-5 w-5 text-red-500"/>
                            </Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => updateTicketStatus(ticket.id, 'Pending')} aria-label="Re-open request">
                            <RefreshCcw className="h-5 w-5 text-blue-500" />
                        </Button>
                    )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No tickets found.
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
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <Button onClick={handleDownload} disabled={tickets.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as CSV
                </Button>
            </div>
            <Tabs defaultValue="active">
                <TabsList>
                    <TabsTrigger value="active">Active Requests</TabsTrigger>
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
