
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { font } from './common';

interface SectionConfig {
  title: string,
  skills: { label: string, value?: boolean }[],
  nextSteps: string
}

export function skillsTable(reportContent: GenerateReportContentOutput, currentStudentData: ReportFormValuesPreview): Table {

  const earlyLearningSkillGroups: SectionConfig[] = [
    {
      title: "Communication and Language",
      skills: [
        { label: "listening Attention and Understanding", value: currentStudentData.listeningAttentionUnderstanding },
        { label: "Speaking", value: currentStudentData.speaking },
      ],
      nextSteps: reportContent.communcationAndLanguageNextSteps
    },
    {
      title: "Physical Development",
      skills: [
        { label: "Gross Motor Skills", value: currentStudentData.grossMotorSkills },
        { label: "Fine Motor Skills", value: currentStudentData.fineMotorSkills },
      ],
      nextSteps: reportContent.physicalDevelopmentNextSteps
    },
    {
      title: "Personal, Social and Emotional Development",
      skills: [
        { label: "Self-regulation", value: currentStudentData.selfRegulation },
        { label: "Managing Self", value: currentStudentData.managingSelf },
        { label: "Building Relationships", value: currentStudentData.buildingRelationships },
      ],
      nextSteps: reportContent.personalSocialEmotionalDevelopmentNextSteps
    },
    {
      title: "Literacy",
      skills: [
        { label: "Comprehension", value: currentStudentData.comprehension },
        { label: "Word Reading", value: currentStudentData.wordReading },
        { label: "Writing", value: currentStudentData.writing },
      ],
      nextSteps: reportContent.literacyNextSteps
    },
    {
      title: "Mathematics",
      skills: [
        { label: "Number", value: currentStudentData.number },
        { label: "Numerical Patterns", value: currentStudentData.numericalPatterns },
      ],
      nextSteps: reportContent.mathmaticsNextSteps
    },
    {
      title: "Understanding the World",
      skills: [
        { label: "Past and Present", value: currentStudentData.pastAndPresent },
        { label: "People, Culture and Communities", value: currentStudentData.peopleCultureCommunities },
        { label: "The Natural World", value: currentStudentData.theNaturalWorld },
      ],
      nextSteps: reportContent.understandingTheWorldNextSteps
    },
    {
      title: "Expressive Arts and Design",
      skills: [
        { label: "Creating with Materials", value: currentStudentData.creatingWithMaterials },
        { label: "Being Imaginative and Expressive", value: currentStudentData.beingImaginativeExpressive },
      ],
      nextSteps: reportContent.expressiveArtsAndDesignNextSteps
    }
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: earlyLearningSkillGroups.flatMap(group => skillsSection(group))
  })
}

function skillsSection(section: SectionConfig): TableRow[] {
  return [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          shading: { fill: 'ADD8E6' },
          children: [
            new Paragraph(section.title)
          ]
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'ADD8E6' },
          children: [
            new Paragraph('Emerging')
          ]
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'ADD8E6' },
          children: [
            new Paragraph('Expected')
          ]
        }),
      ]
    }),
    ...section.skills.map(s =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: s.label, bold: true, font, size: 24 })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: s.value ? undefined : { fill: '#008000' },
            children: []
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: s.value ? { fill: '#008000' } : undefined,
            children: []
          })
        ]
      })
    ),
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 3,
          width: { size: 100, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Next Steps: ', bold: true, font, size: 24 }),
                new TextRun({ text: section.nextSteps, font, size: 24 })
              ]
            })
          ]
        })
      ]
    })
  ]
}