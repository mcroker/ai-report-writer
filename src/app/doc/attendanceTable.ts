
"use client";

import { Paragraph, Table, TableRow, TableCell, WidthType } from 'docx';

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
                      new Paragraph('Percentage Attendance')
                    ]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ 
                    width: { size: 100, type: WidthType.PERCENTAGE }, 
                    children: [
                      new Paragraph(`Attendance: ${attendance}`)
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