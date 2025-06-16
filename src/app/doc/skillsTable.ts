
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { SkillsGroupResults, getSkillValues } from '../earlyLearningSkillGroups';
import { GREEN } from './common'

export function skillsTable(currentStudentData: ReportFormValuesPreview, reportContent: GenerateReportContentOutput): Table {

  const skillsGroups: SkillsGroupResults[] = getSkillValues(currentStudentData, reportContent);

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: skillsGroups.flatMap(group => skillsSection(group))
  })
}

function skillsSection(section: SkillsGroupResults): TableRow[] {
  return [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          shading: { fill: 'ADD8E6' },
          children: [
            new Paragraph({
              text: section.title,
              style: 'TableGroupHeader'
            })
          ]
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'ADD8E6' },
          children: [
            new Paragraph({
              text: 'Emerging',
              style: 'TableGroupHeader'
            })
          ]
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: 'ADD8E6' },
          children: [
            new Paragraph({
              text: 'Expected',
              style: 'TableGroupHeader'
            })
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
                text: s.label,
                style: 'TableSkillsLabel',
              })
            ]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: s.value ? undefined : { fill: GREEN },
            children: []
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: s.value ? { fill: GREEN } : undefined,
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
                new TextRun({ text: 'Next Steps: ', style: 'Label' }),
                new TextRun({ text: section.nextSteps })
              ]
            })
          ]
        })
      ]
    })
  ]
}