"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useCallback } from "react";
import type { Report } from "@/lib/types";

type ReportData = Omit<Report, "id" | "createdAt">;

interface ReportContextType {
  reports: Report[];
  loading: boolean;
  addReport: (reportData: ReportData) => void;
}

export const ReportContext = createContext<ReportContextType | undefined>(
  undefined
);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem("coswinPlusReports");
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    } catch (error) {
      console.error("Failed to process reports from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistReports = (updatedReports: Report[]) => {
    setReports(updatedReports);
    localStorage.setItem("coswinPlusReports", JSON.stringify(updatedReports));
  };

  const addReport = useCallback(
    (reportData: ReportData) => {
      const newReport: Report = {
        ...reportData,
        id: `REPORT-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
      };
      const updatedReports = [newReport, ...reports];
      persistReports(updatedReports);
    },
    [reports]
  );

  return (
    <ReportContext.Provider value={{ reports, loading, addReport }}>
      {children}
    </ReportContext.Provider>
  );
}
