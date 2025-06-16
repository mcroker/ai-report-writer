
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType, HeightRule, VerticalAlign } from 'docx';

export function signatureTable(classTeachers: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        height: { value: '1cm', rule: HeightRule.ATLEAST },
        children: [
          new TableCell({
            rowSpan: 2,
            width: { size: 20, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Signed',
                style: 'VerticalAlignedTable'
              })
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: classTeachers,
                style: 'VerticalAlignedTable'
              })
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Class Teachers',
                style: 'VerticalAlignedTable'
              })
            ]
          }),
        ]
      }),
      new TableRow({
        height: { value: '1cm', rule: HeightRule.ATLEAST },
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph('Academy Principal')
            ]
          }),
        ]
      }),
    ]
  })
}