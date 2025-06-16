
"use client";

import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { Calculator, Ear, MessageCircle, Brain, ScanText, PenLine, Bike, Hand, ShieldCheck, UserCheck, Users, Landmark, Globe, Leaf, Paintbrush, Sparkles, CheckSquare } from 'lucide-react';

export interface SkillsGroupConfig {
  name: keyof GenerateReportContentOutput,
  title: string,
  icon?: JSX.Element,
  skills: { label: string, name: string, icon?: JSX.Element }[],
}

export interface SkillsGroupResults extends SkillsGroupConfig {
  nextSteps?: string,
  skills: { label: string, name: string, value: boolean, icon?: JSX.Element }[],
}

export const earlyLearningSkillGroups: SkillsGroupConfig[] = [
  {
    title: "Communication and Language",
    icon: <MessageCircle className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "listeningAttentionUnderstanding", label: "Listening, Attention and Understanding", icon: <Ear className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "speaking", label: "Speaking", icon: <MessageCircle className="mr-2 h-4 w-4 text-primary/80" /> },
    ],
    name: 'communcationAndLanguageNextSteps'
  },
  {
    title: "Physical Development",
    icon: <Bike className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "grossMotorSkills", label: "Gross Motor Skills", icon: <Bike className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "fineMotorSkills", label: "Fine Motor Skills", icon: <Hand className="mr-2 h-4 w-4 text-primary/80" /> },
    ],
    name: 'physicalDevelopmentNextSteps'
  },
  {
    title: "Personal, Social and Emotional Development",
    icon: <Users className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "selfRegulation", label: "Self-regulation", icon: <ShieldCheck className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "managingSelf", label: "Managing Self", icon: <UserCheck className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "buildingRelationships", label: "Building Relationships", icon: <Users className="mr-2 h-4 w-4 text-primary/80" /> },
    ],
    name: 'personalSocialEmotionalDevelopmentNextSteps',
  },
  {
    title: "Literacy",
    icon: <MessageCircle className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "comprehension", label: "Comprehension", icon: <Brain className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "wordReading", label: "Word Reading", icon: <ScanText className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "writing", label: "Writing", icon: <PenLine className="mr-2 h-4 w-4 text-primary/80" /> },
    ],
    name: 'literacyNextSteps',
  },
  {
    title: "Mathematics",
    icon: <Calculator className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "number", label: "Number", icon: <Calculator className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "numericalPatterns", label: "Numerical Patterns", icon: <Calculator className="mr-2 h-4 w-4 text-primary/80" /> }
    ],
    name: 'mathematicsNextSteps',
  },
  {
    title: "Understanding the World",
    icon: <Globe className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "pastAndPresent", label: "Past and Present", icon: <Landmark className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "peopleCultureCommunities", label: "People, Culture and Communities", icon: <Users className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "theNaturalWorld", label: "The Natural World", icon: <Leaf className="mr-2 h-4 w-4 text-primary/80" /> },
    ],
    name: 'understandingTheWorldNextSteps',
  },
  {
    title: "Expressive Arts and Design",
    icon: <Sparkles className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "creatingWithMaterials", label: "Creating with Materials", icon: <Paintbrush className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "beingImaginativeExpressive", label: "Being Imaginative and Expressive", icon: <Sparkles className="mr-2 h-4 w-4 text-primary/80" /> },
    ],
    name: 'expressiveArtsAndDesignNextSteps',
  }
];

export function getSkillValues(currentStudentData: ReportFormValuesPreview, reportContent?: GenerateReportContentOutput): SkillsGroupResults[] {
  return earlyLearningSkillGroups.map(group => ({
    ...group,
    nextSteps: (reportContent !== undefined)
      ? reportContent[group.name as keyof GenerateReportContentOutput]
      : undefined,
    skills: group.skills.map(skill => ({
      label: skill.label,
      name: skill.name,
      value: currentStudentData[skill.name as keyof ReportFormValuesPreview] as boolean || false
    }))
  }))
}