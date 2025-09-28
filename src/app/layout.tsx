import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { TicketProvider } from "@/contexts/ticket-context";
import { ReportProvider } from "@/contexts/report-context";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Coswin+",
  description: "Système de gestion de tickets informatiques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <TicketProvider>
            <ReportProvider>
              {children}
              <Toaster />
            </ReportProvider>
          </TicketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
