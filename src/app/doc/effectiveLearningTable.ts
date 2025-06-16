
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType } from 'docx';
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';
import { getEffectiveLearningValues } from '../effectiveLearning';

export function effectiveLearningTable(reportContent: GenerateReportContentOutput): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'ADD8E6' },
            columnSpan: 2,
            children: [
              new Paragraph('Characteristics of Effective Learning')
            ]
          }),
        ]
      }),
      ...getEffectiveLearningValues(reportContent).map(r =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 33, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  text: r.label,
                  style: 'Label'
                }),
                ...r.bullets.map(b => new Paragraph({
                  text: b,
                  bullet: {
                    level: 0
                  }
                }))
              ]
            }),
            new TableCell({
              width: { size: 66, type: WidthType.PERCENTAGE },
              children: [new Paragraph(r.comment || '')]
            })
          ]
        })
      )
    ]
  })
}