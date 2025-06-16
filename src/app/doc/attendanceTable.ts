
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from 'docx';

export function attendanceTable(attendance: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'ADD8E6' },
            children: [
              new Paragraph({
                text: 'Percentage Attendance',
                style: 'TableGroupHeader'
              })
            ]
          }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Attendance: ',
                    style: 'Label'
                  }),
                  new TextRun({
                    text: attendance
                  })
                ]
              })
            ]
          }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph('At this school 96% or above is considered acceptable attendance.')
            ]
          }),
        ]
      }),
    ]
  })
}