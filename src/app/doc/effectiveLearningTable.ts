
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

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
          ...(() => [
            { label: "Playing and exploring", comment: reportContent.playingAndExploring },
            { label: "Active learning", comment: reportContent.activeLearning },
            { label: "Creating and thinking critically", comment: reportContent.creatingAndThinkingCritically } 
          ].map(r => 
            new TableRow({
              children: [
                new TableCell({ width: { size: 33, type: WidthType.PERCENTAGE }, children: [new Paragraph(r.label)] }),
                new TableCell({ width: { size: 66, type: WidthType.PERCENTAGE }, children: [new Paragraph(r.comment)] })
              ]
            })
          ))()
        ]
        })
  }