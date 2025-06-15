"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { FileText, Eye, Lightbulb, Download, User, School, BookOpen, StickyNote, Loader2, CheckCircle } from 'lucide-react';

export interface ReportFormValuesPreview {
  studentName: string;
  className: string;
  grades: string;
  attendance: string;
  notes?: string;
}

interface ReportPreviewDisplayProps {
  reportContent: GenerateReportContentOutput;
  studentData: ReportFormValuesPreview;
  onExportPdf: () => void;
  isLoadingPdf: boolean;
}

export function ReportPreviewDisplay({ reportContent, studentData, onExportPdf, isLoadingPdf }: ReportPreviewDisplayProps) {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-2xl md:text-3xl flex items-center text-primary">
          <FileText className="mr-3 h-7 w-7" />
          {studentData.studentName}'s Report Preview
        </CardTitle>
        <CardDescription>Review the generated report content below. You can export it as a PDF.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        
        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="font-headline text-xl flex items-center text-primary border-b pb-2 mb-3">
            <User className="mr-2 h-5 w-5" />Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><strong className="font-medium text-foreground">Name:</strong> <span className="text-muted-foreground">{studentData.studentName}</span></p>
            <p><strong className="font-medium text-foreground">Class:</strong> <span className="text-muted-foreground">{studentData.className}</span></p>
            <p><strong className="font-medium text-foreground">Attendance:</strong> <span className="text-muted-foreground">{studentData.attendance}</span></p>
          </div>
          <div>
            <strong className="font-medium text-foreground flex items-center mb-1"><BookOpen className="mr-2 h-4 w-4 text-primary" />Grades:</strong>
            <pre className="whitespace-pre-wrap font-body bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">{studentData.grades}</pre>
          </div>
          {studentData.notes && studentData.notes.trim() !== '' && (
            <div>
              <strong className="font-medium text-foreground flex items-center mb-1"><StickyNote className="mr-2 h-4 w-4 text-primary" />Teacher Notes:</strong>
              <pre className="whitespace-pre-wrap font-body bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">{studentData.notes}</pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-headline text-lg flex items-center text-primary mb-1">
              <FileText className="mr-2 h-5 w-5" />Summary
            </h4>
            <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{reportContent.summary}</p>
          </div>
          <div>
            <h4 className="font-headline text-lg flex items-center text-primary mb-1">
              <Eye className="mr-2 h-5 w-5" />Observations
            </h4>
            <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{reportContent.observations}</p>
          </div>
          <div>
            <h4 className="font-headline text-lg flex items-center text-primary mb-1">
              <Lightbulb className="mr-2 h-5 w-5" />Suggestions
            </h4>
            <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{reportContent.suggestions}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={onExportPdf} disabled={isLoadingPdf} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base">
          {isLoadingPdf ? 
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Exporting PDF...</> : 
            <><Download className="mr-2 h-5 w-5" /> Export to PDF</>
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
