"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { handleGenerateReportServerAction } from './actions';
import type { GenerateReportContentInput, GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { StudentFormFields } from '@/components/student-form-fields';
import { ReportPreviewDisplay, type ReportFormValuesPreview } from '@/components/report-preview-display';
import { ReportPlaceholder } from '@/components/report-placeholder';
import { Loader2, Sparkles, ClipboardList } from 'lucide-react';

const reportSchema = z.object({
  studentName: z.string().min(1, "Student name is required").max(100, "Name too long"),
  className: z.string().min(1, "Class name is required").max(50, "Class name too long"),
  grades: z.string().min(1, "Grades are required").max(1000, "Grades input too long, max 1000 chars."),
  attendance: z.string().min(1, "Attendance is required").max(50, "Attendance input too long"),
  notes: z.string().max(1000, "Notes too long, max 1000 chars.").optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const [reportContent, setReportContent] = useState<GenerateReportContentOutput | null>(null);
  const [currentStudentData, setCurrentStudentData] = useState<ReportFormValuesPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      studentName: '',
      className: '',
      grades: '',
      attendance: '',
      notes: '',
    },
  });

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setIsLoading(true);
    setReportContent(null); 
    setCurrentStudentData(data as ReportFormValuesPreview); // Store form data for PDF

    const inputForAI: GenerateReportContentInput = {
      studentName: data.studentName,
      className: data.className,
      grades: data.grades,
      attendance: data.attendance,
      notes: data.notes || '',
    };

    const result = await handleGenerateReportServerAction(inputForAI);

    if (result.success && result.data) {
      setReportContent(result.data);
      toast({ title: "Report Generated Successfully!", description: "The student report preview is ready below." });
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Report",
        description: result.error || "An unknown error occurred. Please try again.",
      });
    }
    setIsLoading(false);
  };

  const handleExportPdf = () => {
    if (!reportContent || !currentStudentData) {
      toast({ variant: "destructive", title: "Error", description: "No report data available to export." });
      return;
    }
    setIsLoadingPdf(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20; // Initial Y position
      const lineSpacing = 7; // Spacing between lines
      const sectionTitleSpacing = lineSpacing * 1.5; // Spacing after a section title
      const sectionSpacing = 10; // Spacing after a full section
      
      const fieldIndent = margin + 5; // Indent for field labels and content blocks
      const valueIndent = fieldIndent + 30; // Indent for field values (Name: [Value])
      const textBlockWidth = pageWidth - fieldIndent - margin; // Width for multiline text blocks

      // Helper function to check for page overflow and add new page if needed
      const checkAndAddPage = (neededHeight: number) => {
        if (yPos + neededHeight > pageHeight - margin) { // Check if content fits, leaving bottom margin
          doc.addPage();
          yPos = margin; // Reset Y position for new page
        }
      };
      
      // Report Title
      doc.setFont("times", "bold"); // Using standard PDF fonts
      doc.setFontSize(22);
      doc.text(`${currentStudentData.studentName}'s Report Card`, pageWidth / 2, yPos, { align: 'center' });
      yPos += sectionSpacing * 1.5; // More space after main title

      // Student Details Section
      checkAndAddPage(sectionTitleSpacing + 4 * lineSpacing); // Estimate height
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("Student Information", margin, yPos);
      yPos += sectionTitleSpacing;

      const addDetailLine = (label: string, value: string) => {
        checkAndAddPage(lineSpacing);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(label, fieldIndent, yPos);
        doc.setFont("helvetica", "normal");
        const valueLines = doc.splitTextToSize(value, pageWidth - valueIndent - margin); // Text width for value part
        doc.text(valueLines, valueIndent, yPos);
        yPos += (valueLines.length * lineSpacing) + (lineSpacing / 2); // Add a bit of padding after each line item
      };
      
      addDetailLine("Name:", currentStudentData.studentName);
      addDetailLine("Class:", currentStudentData.className);
      addDetailLine("Attendance:", currentStudentData.attendance);
      
      // Grades (multiline)
      checkAndAddPage(sectionTitleSpacing);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Grades:", fieldIndent, yPos);
      yPos += lineSpacing;
      doc.setFont("helvetica", "normal");
      const gradesLines = doc.splitTextToSize(currentStudentData.grades, textBlockWidth);
      checkAndAddPage(gradesLines.length * lineSpacing);
      doc.text(gradesLines, fieldIndent, yPos);
      yPos += gradesLines.length * lineSpacing + (lineSpacing / 2);

      // Teacher Notes (multiline, optional)
      if (currentStudentData.notes && currentStudentData.notes.trim() !== '') {
        checkAndAddPage(sectionTitleSpacing);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Teacher Notes:", fieldIndent, yPos);
        yPos += lineSpacing;
        doc.setFont("helvetica", "normal");
        const notesLines = doc.splitTextToSize(currentStudentData.notes, textBlockWidth);
        checkAndAddPage(notesLines.length * lineSpacing);
        doc.text(notesLines, fieldIndent, yPos);
        yPos += notesLines.length * lineSpacing + (lineSpacing / 2);
      }
      yPos += sectionSpacing; // Space before next major section

      // AI Generated Content Sections
      const addAISection = (title: string, content: string) => {
        checkAndAddPage(sectionTitleSpacing + lineSpacing * 2); // Estimate height
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text(title, margin, yPos);
        yPos += sectionTitleSpacing;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const contentLines = doc.splitTextToSize(content, pageWidth - fieldIndent - margin); // Use fieldIndent for content block alignment
        checkAndAddPage(contentLines.length * lineSpacing);
        doc.text(contentLines, fieldIndent, yPos);
        yPos += contentLines.length * lineSpacing + sectionSpacing;
      };

      addAISection("Summary of Performance", reportContent.summary);
      addAISection("Observations", reportContent.observations);
      addAISection("Suggestions for Improvement", reportContent.suggestions);

      doc.save(`${currentStudentData.studentName.replace(/\s+/g, '_')}_ReportCard.pdf`);
      toast({ title: "PDF Exported Successfully!", description: `${currentStudentData.studentName}'s report card has been saved.` });
    } catch (e) {
      console.error("PDF Generation Error:", e);
      toast({ variant: "destructive", title: "PDF Export Failed", description: "An error occurred while generating the PDF." });
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight">ReportMaster</h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-2xl mx-auto">
          Streamline your student reporting. Input student data, and let AI assist in crafting insightful report content.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="w-full shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="font-headline text-2xl md:text-3xl flex items-center text-primary">
              <ClipboardList className="mr-3 h-7 w-7" />
              Student Data Input
            </CardTitle>
            <CardDescription>Fill in the student's details to generate a report.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <StudentFormFields />
                <Button type="submit" disabled={isLoading} className="w-full py-3 text-base">
                  {isLoading ? (
                    <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Report...</>
                  ) : (
                    <> <Sparkles className="mr-2 h-5 w-5" /> Generate Report with AI</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-8">
          {isLoading && (
            <div className="md:col-span-1 flex flex-col items-center justify-center h-full p-8 bg-card rounded-lg shadow-lg border min-h-[300px]">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
              <p className="font-headline text-2xl text-muted-foreground mb-2">Crafting Your Report...</p>
              <p className="text-sm text-muted-foreground text-center">Our AI is hard at work. This may take a few moments.</p>
            </div>
          )}

          {!isLoading && reportContent && currentStudentData && (
            <ReportPreviewDisplay
              reportContent={reportContent}
              studentData={currentStudentData}
              onExportPdf={handleExportPdf}
              isLoadingPdf={isLoadingPdf}
            />
          )}
          
          {!isLoading && !reportContent && (
            <ReportPlaceholder />
          )}
        </div>
      </main>
    </div>
  );
}
