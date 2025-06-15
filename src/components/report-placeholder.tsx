"use client";
import { FileText } from 'lucide-react';

export function ReportPlaceholder() {
  return (
    <div className="md:col-span-1 flex flex-col items-center justify-center h-full bg-card p-8 rounded-lg border-2 border-dashed border-border shadow-sm min-h-[300px] md:min-h-full">
      <FileText className="h-16 w-16 text-muted-foreground/30 mb-6" />
      <h3 className="font-headline text-xl text-muted-foreground text-center mb-2">Report Preview Area</h3>
      <p className="text-sm text-muted-foreground text-center leading-relaxed">
        Once you fill out the student's information and click "Generate Report",
        <br />
        a preview of the report will appear here.
      </p>
    </div>
  );
}
