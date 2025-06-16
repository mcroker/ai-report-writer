
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import { generateDoc } from './doc/generateDoc'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { handleGenerateReportServerAction, handleRegenerateFieldServerAction } from './actions';
import type { GenerateReportContentInput, GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { StudentFormFields } from '@/components/student-form-fields';
import { ReportPreviewDisplay, type ReportFormValuesPreview, reportFieldTitles } from '@/components/report-preview-display';
import { ReportPlaceholder } from '@/components/report-placeholder';
import { Loader2, Sparkles, ClipboardList } from 'lucide-react';

const reportSchema = z.object({
  studentName: z.string().min(1, "Student name is required").max(100, "Name too long"),
  attendance: z.string().min(1, "Attendance is required").max(50, "Attendance input too long"),
  notes: z.string().max(1000, "Notes too long, max 1000 chars.").optional(),
  earlyLearningGoals: z.string().max(2000, "Early learning goals too long, max 2000 chars.").optional(),
  religiousEducationProgress: z.enum(["Some", "Good", "Very Good"]).default("Good"),

  listeningAttentionUnderstanding: z.boolean().optional().default(true),
  speaking: z.boolean().optional().default(true),
  grossMotorSkills: z.boolean().optional().default(true),
  fineMotorSkills: z.boolean().optional().default(true),
  selfRegulation: z.boolean().optional().default(true),
  managingSelf: z.boolean().optional().default(true),
  buildingRelationships: z.boolean().optional().default(true),
  comprehension: z.boolean().optional().default(true),
  wordReading: z.boolean().optional().default(true),
  writing: z.boolean().optional().default(true),
  number: z.boolean().optional().default(true),
  numericalPatterns: z.boolean().optional().default(true),
  pastAndPresent: z.boolean().optional().default(true),
  peopleCultureCommunities: z.boolean().optional().default(true),
  theNaturalWorld: z.boolean().optional().default(true),
  creatingWithMaterials: z.boolean().optional().default(true),
  beingImaginativeExpressive: z.boolean().optional().default(true),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

// This type is used for `currentStudentData` state, which holds the inputs used for the last successful AI generation.
// It needs to be compatible with what `GenerateReportContentInput` expects for student details.
// `ReportFormValuesPreview` in `report-preview-display.tsx` should align with this.
type StudentDataSourceForAI = ReportFormValues;


export default function ReportPage() {
  const [reportContent, setReportContent] = useState<GenerateReportContentOutput | null>(null);
  // currentStudentData will store the form values that were used to generate the current reportContent
  const [currentStudentDataForAI, setCurrentStudentDataForAI] = useState<StudentDataSourceForAI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocx, setIsLoadingDocx] = useState(false);
  const [regeneratingFieldKey, setRegeneratingFieldKey] = useState<keyof GenerateReportContentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      studentName: '',
      attendance: '',
      notes: '',
      earlyLearningGoals: '',
      religiousEducationProgress: "Good",
      listeningAttentionUnderstanding: true,
      speaking: true,
      grossMotorSkills: true,
      fineMotorSkills: true,
      selfRegulation: true,
      managingSelf: true,
      buildingRelationships: true,
      comprehension: true,
      wordReading: true,
      writing: true,
      number: true,
      numericalPatterns: true,
      pastAndPresent: true,
      peopleCultureCommunities: true,
      theNaturalWorld: true,
      creatingWithMaterials: true,
      beingImaginativeExpressive: true,
    },
  });

  const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
    setIsLoading(true);
    setReportContent(null);
    setCurrentStudentDataForAI(data); // Store the submitted form data

    // Prepare data for the AI flow (Omit regeneration-specific fields for initial generation)
    const inputForAI: Omit<GenerateReportContentInput, 'currentReportOutput' | 'fieldToRegenerate'> = {
      studentName: data.studentName,
      attendance: data.attendance,
      notes: data.notes || '',
      earlyLearningGoals: data.earlyLearningGoals || '',
      religiousEducationProgress: data.religiousEducationProgress,
      listeningAttentionUnderstanding: data.listeningAttentionUnderstanding,
      speaking: data.speaking,
      grossMotorSkills: data.grossMotorSkills,
      fineMotorSkills: data.fineMotorSkills,
      selfRegulation: data.selfRegulation,
      managingSelf: data.managingSelf,
      buildingRelationships: data.buildingRelationships,
      comprehension: data.comprehension,
      wordReading: data.wordReading,
      writing: data.writing,
      number: data.number,
      numericalPatterns: data.numericalPatterns,
      pastAndPresent: data.pastAndPresent,
      peopleCultureCommunities: data.peopleCultureCommunities,
      theNaturalWorld: data.theNaturalWorld,
      creatingWithMaterials: data.creatingWithMaterials,
      beingImaginativeExpressive: data.beingImaginativeExpressive,
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
      setCurrentStudentDataForAI(null); // Clear if generation failed
    }
    setIsLoading(false);
  };

  const handleRegenerateField = async (fieldKey: keyof GenerateReportContentOutput) => {
    if (!currentStudentDataForAI || !reportContent) {
      toast({ variant: "destructive", title: "Error", description: "Cannot regenerate. Original data or report content is missing." });
      return;
    }
    setRegeneratingFieldKey(fieldKey);

    // Prepare studentInput from currentStudentDataForAI (which is of type ReportFormValues)
    const studentInputPayload: Omit<GenerateReportContentInput, 'currentReportOutput' | 'fieldToRegenerate'> = {
        studentName: currentStudentDataForAI.studentName,
        attendance: currentStudentDataForAI.attendance,
        notes: currentStudentDataForAI.notes || '',
        earlyLearningGoals: currentStudentDataForAI.earlyLearningGoals || '',
        religiousEducationProgress: currentStudentDataForAI.religiousEducationProgress,
        listeningAttentionUnderstanding: currentStudentDataForAI.listeningAttentionUnderstanding,
        speaking: currentStudentDataForAI.speaking,
        grossMotorSkills: currentStudentDataForAI.grossMotorSkills,
        fineMotorSkills: currentStudentDataForAI.fineMotorSkills,
        selfRegulation: currentStudentDataForAI.selfRegulation,
        managingSelf: currentStudentDataForAI.managingSelf,
        buildingRelationships: currentStudentDataForAI.buildingRelationships,
        comprehension: currentStudentDataForAI.comprehension,
        wordReading: currentStudentDataForAI.wordReading,
        writing: currentStudentDataForAI.writing,
        number: currentStudentDataForAI.number,
        numericalPatterns: currentStudentDataForAI.numericalPatterns,
        pastAndPresent: currentStudentDataForAI.pastAndPresent,
        peopleCultureCommunities: currentStudentDataForAI.peopleCultureCommunities,
        theNaturalWorld: currentStudentDataForAI.theNaturalWorld,
        creatingWithMaterials: currentStudentDataForAI.creatingWithMaterials,
        beingImaginativeExpressive: currentStudentDataForAI.beingImaginativeExpressive,
    };


    const result = await handleRegenerateFieldServerAction({
      studentInput: studentInputPayload,
      currentReportOutput: reportContent,
      fieldToRegenerate: fieldKey,
    });

    if (result.success && result.data) {
      setReportContent(result.data);
      const fieldFriendlyName = reportFieldTitles[fieldKey] || fieldKey;
      toast({ title: `${fieldFriendlyName} Regenerated!`, description: "Content has been updated." });
    } else {
      toast({
        variant: "destructive",
        title: `Error Regenerating ${reportFieldTitles[fieldKey] || fieldKey}`,
        description: result.error || "An unknown error occurred.",
      });
    }
    setRegeneratingFieldKey(null);
  };


  const handleExportDocx = async () => {
    if (!reportContent || !currentStudentDataForAI) { 
      toast({ variant: "destructive", title: "Error", description: "No report data available to export." });
      return;
    }
    setIsLoadingDocx(true);
    try {
      const docDataForExport: ReportFormValuesPreview = {
        ...currentStudentDataForAI,
        className: "St Francis", 
        religiousEducationProgress: currentStudentDataForAI.religiousEducationProgress || "Good", // Ensure it has a value for docx
      };

      const blob = await generateDoc(reportContent, docDataForExport);
      saveAs(blob, `${currentStudentDataForAI.studentName.replace(/\s+/g, '_')}_ReportCard.docx`);
      toast({ title: "DOCX Exported Successfully!", description: `${currentStudentDataForAI.studentName}'s report card has been saved.` });
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
                <Button type="submit" disabled={isLoading || regeneratingFieldKey !== null} className="w-full py-3 text-base">
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

          {!isLoading && reportContent && currentStudentDataForAI && (
            <ReportPreviewDisplay
              reportContent={reportContent}
              studentData={{...currentStudentDataForAI, className: "St Francis"}} 
              onExportDocx={handleExportDocx}
              isLoadingDocx={isLoadingDocx}
              onRegenerateField={handleRegenerateField}
              regeneratingFieldKey={regeneratingFieldKey}
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
