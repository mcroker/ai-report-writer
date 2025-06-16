
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import {
  FileText, Eye, Lightbulb, Download, User, StickyNote, Loader2, RefreshCcw, Brain, Target, Edit3, Zap,
  MessageSquare, Users, ShieldCheck, Bike, Leaf, Paintbrush, Drama, BookOpen,
  Calculator, Globe, Landmark 
} from 'lucide-react';
import { ReactNode } from 'react';

export interface ReportFormValuesPreview {
  studentName: string;
  className: string;
  attendance: string;
  notes?: string;
  earlyLearningGoals?: string;
  religiousEducationProgress: "Some" | "Good" | "Very Good"; // Added this line

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
  studentName: "", className: "", attendance: "", notes: "", earlyLearningGoals: "", religiousEducationProgress: "Good"
};

export const reportFieldTitles: Record<keyof GenerateReportContentOutput, string> = {
  playingAndExploring: "Playing and Exploring",
  activeLearning: "Active Learning",
  creatingAndThinkingCritically: "Creating and Thinking Critically",
  communcationAndLanguageNextSteps: "Communication and Language Next Steps",
  physicalDevelopmentNextSteps: "Physical Development Next Steps",
  personalSocialEmotionalDevelopmentNextSteps: "Personal, Social & Emotional Development Next Steps",
  literacyNextSteps: "Literacy Next Steps",
  mathematicsNextSteps: "Mathematics Next Steps",
  understandingTheWorldNextSteps: "Understanding the World Next Steps",
  expressiveArtsAndDesignNextSteps: "Expressive Arts & Design Next Steps",
  religousEductionComments: "Religious Education Comments",
  generalComments: "General Comments",
};

const PlaySquare = ({ className }: { className?: string }) => <Drama className={className} />;

const reportFieldIcons: Record<keyof GenerateReportContentOutput, JSX.Element> = {
  playingAndExploring: <PlaySquare className="mr-2 h-5 w-5" />,
  activeLearning: <Zap className="mr-2 h-5 w-5" />,
  creatingAndThinkingCritically: <Lightbulb className="mr-2 h-5 w-5" />,
  communcationAndLanguageNextSteps: <MessageSquare className="mr-2 h-5 w-5" />,
  physicalDevelopmentNextSteps: <Bike className="mr-2 h-5 w-5" />,
  personalSocialEmotionalDevelopmentNextSteps: <Users className="mr-2 h-5 w-5" />,
  literacyNextSteps: <BookOpen className="mr-2 h-5 w-5" />,
  mathematicsNextSteps: <Calculator className="mr-2 h-5 w-5" />,
  understandingTheWorldNextSteps: <Globe className="mr-2 h-5 w-5" />,
  expressiveArtsAndDesignNextSteps: <Paintbrush className="mr-2 h-5 w-5" />,
  religousEductionComments: <Landmark className="mr-2 h-5 w-5" />,
  generalComments: <FileText className="mr-2 h-5 w-5" />,
};


interface ReportPreviewDisplayProps {
  reportContent: GenerateReportContentOutput;
  studentData: ReportFormValuesPreview;
  onExportDocx: () => void;
  isLoadingDocx: boolean;
  onRegenerateField: (fieldKey: keyof GenerateReportContentOutput) => void;
  regeneratingFieldKey: keyof GenerateReportContentOutput | null;
}

// Helper component for each regenerable text field
const RegenerableSection: React.FC<{
  fieldKey: keyof GenerateReportContentOutput;
  content: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
  icon?: JSX.Element;
}> = ({ fieldKey, content, onRegenerate, isRegenerating, icon }) => {
  const title = reportFieldTitles[fieldKey] || fieldKey.toString();
  const displayIcon = icon || <Edit3 className="mr-2 h-5 w-5" />;

  return (
    <div>
      <h4 className="font-headline text-lg flex items-center justify-between text-primary mb-1">
        <span className="flex items-center">
          {displayIcon}
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-7 w-7 text-primary/80 hover:text-primary"
          onClick={onRegenerate}
          disabled={isRegenerating}
          aria-label={`Regenerate ${title}`}
        >
          {isRegenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </h4>
      <p className="text-muted-foreground ml-7 text-sm leading-relaxed">{content}</p>
    </div>
  );
};


export function ReportPreviewDisplay({
  reportContent,
  studentData,
  onExportDocx,
  isLoadingDocx,
  onRegenerateField,
  regeneratingFieldKey
}: ReportPreviewDisplayProps) {

  const getActiveSkills = () => {
    const skills: string[] = [];
    (Object.keys(skillLabelsMap) as Array<keyof ReportFormValuesPreview>).forEach(key => {
      if (studentData[key] === true && skillLabelsMap[key] !== "" && key !== 'studentName' && key !== 'className' && key !== 'attendance' && key !== 'notes' && key !== 'earlyLearningGoals' && key !== 'religiousEducationProgress') {
        skills.push(skillLabelsMap[key]);
      }
    });
    return skills;
  };

  const addField: (fieldKey: keyof GenerateReportContentOutput) => ReactNode
    = (fieldKey: keyof GenerateReportContentOutput) => {
      return <RegenerableSection
        key={fieldKey}
        fieldKey={fieldKey}
        content={reportContent[fieldKey]}
        onRegenerate={() => onRegenerateField(fieldKey)}
        isRegenerating={regeneratingFieldKey === fieldKey}
        icon={reportFieldIcons[fieldKey]}
      />
    }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-2xl md:text-3xl flex items-center text-primary">
          <FileText className="mr-3 h-7 w-7" />
          {studentData.studentName}'s Report Preview
        </CardTitle>
        <CardDescription>Review the generated report content. Click the refresh icon next to a section to regenerate its content.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6 max-h-[calc(100vh-250px)] overflow-y-auto">

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="font-headline text-xl flex items-center text-primary border-b pb-2 mb-3">
            <User className="mr-2 h-5 w-5" />Effective Learning Goals
          </h3>
          <div className="space-y-6">
            {([
              "playingAndExploring",
              "activeLearning",
              "creatingAndThinkingCritically"
            ] as Array<keyof GenerateReportContentOutput>).map(addField)}
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="font-headline text-xl flex items-center text-primary border-b pb-2 mb-3">
            <User className="mr-2 h-5 w-5" />Next Steps
          </h3>
          <div className="space-y-6">
            {([
              "communcationAndLanguageNextSteps",
              "physicalDevelopmentNextSteps",
              "personalSocialEmotionalDevelopmentNextSteps",
              "literacyNextSteps",
              "mathematicsNextSteps",
              "understandingTheWorldNextSteps",
              "expressiveArtsAndDesignNextSteps"
            ] as Array<keyof GenerateReportContentOutput>).map(addField)}
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="font-headline text-xl flex items-center text-primary border-b pb-2 mb-3">
            <User className="mr-2 h-5 w-5" />Comments
          </h3>
          <div className="space-y-6">
            {(["religousEductionComments", "generalComments"] as Array<keyof GenerateReportContentOutput>).map(addField)}
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
