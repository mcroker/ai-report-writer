
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { FileText, Eye, Lightbulb, Download, User, School, BookOpen, StickyNote, Loader2, Target, CheckSquare } from 'lucide-react';

export interface ReportFormValuesPreview {
  studentName: string;
  className: string;
  attendance: string;
  notes?: string;
  // Early Learning Skills - Booleans
  listeningAttentionUnderstanding?: boolean;
  speaking?: boolean;
  grossMotorSkills?: boolean;
  fineMotorSkills?: boolean;
  selfRegulation?: boolean;
  managingSelf?: boolean;
  buildingRelationships?: boolean;
  comprehension?: boolean;
  wordReading?: boolean;
  writing?: boolean;
  number?: boolean;
  numericalPatterns?: boolean;
  pastAndPresent?: boolean;
  peopleCultureCommunities?: boolean;
  theNaturalWorld?: boolean;
  creatingWithMaterials?: boolean;
  beingImaginativeExpressive?: boolean;
}

const skillLabelsMap: Record<keyof ReportFormValuesPreview, string> = {
  listeningAttentionUnderstanding: "Listening, Attention and Understanding",
  speaking: "Speaking",

  grossMotorSkills: "Gross Motor Skills",
  fineMotorSkills: "Fine Motor Skills",
  selfRegulation: "Self-regulation",
  managingSelf: "Managing Self",
  buildingRelationships: "Building Relationships",
  comprehension: "Comprehension",
  wordReading: "Word Reading",
  writing: "Writing",
  number: "Number",
  numericalPatterns: "Numerical Patterns",
  pastAndPresent: "Past and Present",
  peopleCultureCommunities: "People, Culture and Communities",
  theNaturalWorld: "The Natural World",
  creatingWithMaterials: "Creating with Materials",
  beingImaginativeExpressive: "Being Imaginative and Expressive",
  // Add other non-skill keys to satisfy TypeScript if needed, though they won't be used in skill iteration
  studentName: "", className: "", attendance: "", notes: ""
};


interface ReportPreviewDisplayProps {
  reportContent: GenerateReportContentOutput;
  studentData: ReportFormValuesPreview;
  onExportDocx: () => void;
  isLoadingDocx: boolean;
}

export function ReportPreviewDisplay({ reportContent, studentData, onExportDocx, isLoadingDocx }: ReportPreviewDisplayProps) {
  
  const getActiveSkills = () => {
    const skills: string[] = [];
    (Object.keys(skillLabelsMap) as Array<keyof ReportFormValuesPreview>).forEach(key => {
      if (studentData[key] === true && skillLabelsMap[key] !== "") { // Check if it's a skill and true
        skills.push(skillLabelsMap[key]);
      }
    });
    return skills;
  };
  const activeSkills = getActiveSkills();

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-2xl md:text-3xl flex items-center text-primary">
          <FileText className="mr-3 h-7 w-7" />
          {studentData.studentName}'s Report Preview
        </CardTitle>
        <CardDescription>Review the generated report content below. You can export it as a DOCX file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        
        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="font-headline text-xl flex items-center text-primary border-b pb-2 mb-3">
            <User className="mr-2 h-5 w-5" />Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><strong className="font-medium text-foreground">Name:</strong> <span className="text-muted-foreground">{studentData.studentName}</span></p>
            <p><strong className="font-medium text-foreground">Attendance:</strong> <span className="text-muted-foreground">{studentData.attendance}</span></p>
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
              <FileText className="mr-2 h-5 w-5" />Playing And Exploring
            </h4>
            <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{reportContent.playingAndExploring}</p>
          </div>
          <div>
            <h4 className="font-headline text-lg flex items-center text-primary mb-1">
              <Eye className="mr-2 h-5 w-5" />Active Learning
            </h4>
            <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{reportContent.activeLearning}</p>
          </div>
          <div>
            <h4 className="font-headline text-lg flex items-center text-primary mb-1">
              <Lightbulb className="mr-2 h-5 w-5" />Creating And Thinking Critically
            </h4>
            <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{reportContent.creatingAndThinkingCritically}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={onExportDocx} disabled={isLoadingDocx} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base">
          {isLoadingDocx ? 
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Exporting DOCX...</> : 
            <><Download className="mr-2 h-5 w-5" /> Export to DOCX</>
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
