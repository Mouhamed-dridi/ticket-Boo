"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useCallback } from "react";
import type { Ticket, TicketStatus, TicketPriority } from "@/lib/types";

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  addTicket: (ticketData: Omit<Ticket, "id" | "status" | "createdAt">) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
}

export const TicketContext = createContext<TicketContextType | undefined>(undefined);

const initialTickets: Ticket[] = [
    {
        id: 'TICKET-001',
        deviceName: 'Dell XPS 15',
        issueDescription: 'Screen is flickering after the latest windows update. It seems to be a driver issue.',
        priority: 'High',
        status: 'Pending',
        submittedBy: 'user',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'TICKET-002',
        deviceName: 'Logitech MX Master 3',
        issueDescription: 'The scroll wheel is not working. I have tried reconnecting it but the issue persists.',
        priority: 'Medium',
        status: 'Pending',
        submittedBy: 'user',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'TICKET-003',
        deviceName: 'Office Printer HP-2B',
        issueDescription: 'Printer is out of black ink. Needs a new cartridge.',
        priority: 'Low',
        status: 'Done',
        submittedBy: 'user',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];


export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTickets = localStorage.getItem("ticketyTickets");
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        setTickets(initialTickets);
        localStorage.setItem("ticketyTickets", JSON.stringify(initialTickets));
      }
    } catch (error) {
      console.error("Failed to process tickets from localStorage", error);
      setTickets(initialTickets);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistTickets = (updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem("ticketyTickets", JSON.stringify(updatedTickets));
  };

  const addTicket = useCallback((ticketData: Omit<Ticket, "id" | "status" | "createdAt">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TICKET-${String(Date.now()).slice(-4)}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    const updatedTickets = [newTicket, ...tickets];
    persistTickets(updatedTickets);
  }, [tickets]);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status } : ticket
    );
    persistTickets(updatedTickets);
  }, [tickets]);

  return (
    <TicketContext.Provider value={{ tickets, loading, addTicket, updateTicketStatus }}>
      {children}
    </TicketContext.Provider>
  );
}
