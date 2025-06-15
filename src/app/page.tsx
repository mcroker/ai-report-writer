
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { handleGenerateReportServerAction } from './actions';
import type { GenerateReportContentInput, GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { StudentFormFields } from '@/components/student-form-fields';
import { ReportPreviewDisplay, type ReportFormValuesPreview } from '@/components/report-preview-display';
import { ReportPlaceholder } from '@/components/report-placeholder';
import { Loader2, Sparkles, ClipboardList, Download } from 'lucide-react';

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
  const [isLoadingDocx, setIsLoadingDocx] = useState(false);
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
    setCurrentStudentData(data as ReportFormValuesPreview); 

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

  const handleExportDocx = async () => {
    if (!reportContent || !currentStudentData) {
      toast({ variant: "destructive", title: "Error", description: "No report data available to export." });
      return;
    }
    setIsLoadingDocx(true);
    try {
      const doc = new Document({
        creator: "ReportMaster",
        title: `${currentStudentData.studentName}'s Report Card`,
        description: `Report card for ${currentStudentData.studentName}`,
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1).valueOf(),
                right: convertInchesToTwip(1).valueOf(),
                bottom: convertInchesToTwip(1).valueOf(),
                left: convertInchesToTwip(1).valueOf(),
              },
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${currentStudentData.studentName}'s Report Card`, bold: true, size: 36, font: "Times New Roman" })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            new Paragraph({
              text: "Student Information",
              heading: HeadingLevel.HEADING_1,
              style: "Heading1",
              spacing: { after: 200, before: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Name: ", bold: true, font: "Times New Roman", size: 24 }),
                new TextRun({ text: currentStudentData.studentName || "", font: "Times New Roman", size: 24 }),
              ],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Class: ", bold: true, font: "Times New Roman", size: 24 }),
                new TextRun({ text: currentStudentData.className || "", font: "Times New Roman", size: 24 }),
              ],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Attendance: ", bold: true, font: "Times New Roman", size: 24 }),
                new TextRun({ text: currentStudentData.attendance || "", font: "Times New Roman", size: 24 }),
              ],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [new TextRun({ text: "Grades:", bold: true, font: "Times New Roman", size: 24 })],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 100 },
            }),
            ...(currentStudentData.grades || "").split('\n').map(line => new Paragraph({
              children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })],
              indent: { left: convertInchesToTwip(0.75).valueOf() }, 
              spacing: { after: 50 },
            })),
            
            ...(currentStudentData.notes && currentStudentData.notes.trim() !== '' ? [
              new Paragraph({
                children: [new TextRun({ text: "Teacher Notes:", bold: true, font: "Times New Roman", size: 24 })],
                indent: { left: convertInchesToTwip(0.5).valueOf() },
                spacing: { after: 100, before: 150 },
              }),
              ...(currentStudentData.notes || "").split('\n').map(line => new Paragraph({
                children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })],
                indent: { left: convertInchesToTwip(0.75).valueOf() },
                spacing: { after: 50 },
              }))
            ] : []),
            
            new Paragraph({
              text: "Summary of Performance",
              heading: HeadingLevel.HEADING_1,
              style: "Heading1",
              spacing: { after: 200, before: 300 },
            }),
            new Paragraph({
              children: [new TextRun({ text: reportContent.summary || "", font: "Times New Roman", size: 24 })],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: "Observations",
              heading: HeadingLevel.HEADING_1,
              style: "Heading1",
              spacing: { after: 200, before: 300 },
            }),
            new Paragraph({
              children: [new TextRun({ text: reportContent.observations || "", font: "Times New Roman", size: 24 })],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: "Suggestions for Improvement",
              heading: HeadingLevel.HEADING_1,
              style: "Heading1",
              spacing: { after: 200, before: 300 },
            }),
            new Paragraph({
              children: [new TextRun({ text: reportContent.suggestions || "", font: "Times New Roman", size: 24 })],
              indent: { left: convertInchesToTwip(0.5).valueOf() },
              spacing: { after: 200 },
            }),
          ],
          headers: {
            default: undefined, 
          },
          footers: {
            default: new Paragraph({ 
                children: [new TextRun({ text: "Generated by ReportMaster", size: 18, italic: true, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
            }),
          },
        }],
        styles: {
          paragraphStyles: [
            {
              id: "Normal",
              name: "Normal",
              next: "Normal",
              quickFormat: true,
              run: {
                size: 24, 
                font: "Times New Roman",
              },
              paragraph: {
                spacing: { after: 120 }, 
              },
            },
            {
              id: "Heading1",
              name: "Heading 1",
              basedOn: "Normal",
              next: "Normal",
              quickFormat: true,
              run: {
                size: 28, 
                bold: true,
                font: "Times New Roman",
              },
              paragraph: {
                spacing: { after: 240, before: 240 }, 
              },
            }
          ],
        },
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${currentStudentData.studentName.replace(/\s+/g, '_')}_ReportCard.docx`);
      toast({ title: "DOCX Exported Successfully!", description: `${currentStudentData.studentName}'s report card has been saved.` });
    } catch (e) {
      console.error("DOCX Generation Error:", e);
      toast({ variant: "destructive", title: "DOCX Export Failed", description: "An error occurred while generating the DOCX file." });
    } finally {
      setIsLoadingDocx(false);
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
              onExportDocx={handleExportDocx}
              isLoadingDocx={isLoadingDocx}
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
