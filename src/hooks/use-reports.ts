"use client";

import { useContext } from "react";
import { ReportContext } from "@/contexts/report-context";

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
