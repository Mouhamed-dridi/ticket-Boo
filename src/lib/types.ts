export type UserRole = "admin" | "user";

export interface User {
  username: string;
  role: UserRole;
}

export type TicketStatus = "Pending" | "Done" | "Cancelled";
export type TicketPriority = "Low" | "Medium" | "High";

export interface Ticket {
  id: string;
  deviceName: string;
  issueDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  submittedBy: string;
  createdAt: string;
  site: string;
  postName: string;
  userName: string;
  userMatricule: string;
}
