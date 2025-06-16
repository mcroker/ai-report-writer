
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { font } from './common';

export function reTable(currentStudentData: ReportFormValuesPreview, reportContent: GenerateReportContentOutput): Table {

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
              new Paragraph('Religious Education')
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
            children: [
              new Paragraph('Some')
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph('Good')
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
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
              new Paragraph('General Comments')
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
