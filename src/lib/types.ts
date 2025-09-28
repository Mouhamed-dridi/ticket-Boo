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

export interface Report {
  id: string;
  site: string;
  postName: string;
  problem: string;
  os: string;
  pcType: string;
  description: string;
  createdAt: string;
}
