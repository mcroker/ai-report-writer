
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType } from 'docx';

export function signatureTable(classTeachers: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            rowSpan: 2,
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph('Signed')
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph(classTeachers)
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph('Class Teachers')
            ]
          }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph('Academy Principal')
            ]
          }),
        ]
      }),
    ]
  })
}