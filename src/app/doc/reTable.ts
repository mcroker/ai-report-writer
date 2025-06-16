
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; 
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { font, GREEN } from './common';

export function reTable(currentStudentData: ReportFormValuesPreview, reportContent: GenerateReportContentOutput): Table {
  const progressValue = currentStudentData.religiousEducationProgress;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 4,
            shading: { fill: 'ADD8E6' },
            children: [
              new Paragraph({
                text: `Religious Education`,
                style :'TableGroupHeader'
              })
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph('Progress')
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: progressValue === 'Some' ? { fill: GREEN } : undefined,
            children: [
              new Paragraph('Some')
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: progressValue === 'Good' ? { fill: GREEN } : undefined,
            children: [
              new Paragraph('Good')
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: progressValue === 'Very Good' ? { fill: GREEN } : undefined,
            children: [
              new Paragraph('Very Good')
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 4,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Comments: ', bold: true, font, size: 24 }),
                  new TextRun({ text: reportContent.religousEductionComments, font, size: 24 })
                ]
              })
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 4,
            shading: { fill: 'ADD8E6' },
            children: [
              new Paragraph({
                text: `General Comments`,
                style :'TableGroupHeader'
              })
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 4,
            children: [
              new Paragraph(reportContent.generalComments)
            ]
          })
        ]
      })
    ]
  })
}
