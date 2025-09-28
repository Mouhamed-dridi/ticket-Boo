"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useCallback } from "react";
import type { Ticket, TicketStatus, TicketPriority } from "@/lib/types";

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  addTicket: (ticketData: Omit<Ticket, "id" | "status" | "createdAt" | "priority" | "submittedBy"> & {name: string, id: string}) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
}

export const TicketContext = createContext<TicketContextType | undefined>(undefined);

const initialTickets: Ticket[] = [];


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

  const addTicket = useCallback((ticketData: Omit<Ticket, "id" | "status" | "createdAt" | "priority" | "submittedBy"> & {name: string, id: string}) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TICKET-${String(Date.now()).slice(-4)}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
      priority: 'Medium',
      submittedBy: 'user', // This is now static as per logic change
      userName: ticketData.name,
      userMatricule: ticketData.id,
      issueDescription: `Problème avec ${ticketData.deviceName}`
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
