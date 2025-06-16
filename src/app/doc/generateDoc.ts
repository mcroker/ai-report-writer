
"use client";

import { Document, Packer, Paragraph, Footer, ColumnBreak, PageOrientation, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip, PageBreak, convertMillimetersToTwip } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

import { attendanceTable } from './attendanceTable';
import { effectiveLearningTable } from './effectiveLearningTable';
import { schoolLogo } from './schoolLogo';
import { signatureTable } from './signatureTable';
import { skillsTable } from './skillsTable';
import { reTable } from './reTable';
import { font, classTeachers, className } from './common';

export async function generateDoc(reportContent: GenerateReportContentOutput, currentStudentData: ReportFormValuesPreview): Promise<Blob> {

  const children = [

    effectiveLearningTable(reportContent),

    new Paragraph({
      spacing: { after: 400 },
    }),

    signatureTable(classTeachers),

    new Paragraph({
      children: [new ColumnBreak()]
    }),

    schoolLogo(),

    new Paragraph({
      children: [new TextRun({ text: `ANNUAL REPORT 2024-2025`, bold: true, size: 36, font })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 1600, after: 400 },
    }),

    new Paragraph({
      children: [new TextRun({ text: currentStudentData.studentName, bold: true, size: 36, font })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    new Paragraph({
      children: [new TextRun({ text: className, size: 24, font })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 1600 },
    }),

    attendanceTable(currentStudentData.attendance),

    new Paragraph({
      children: [new PageBreak()]
    }),

    skillsTable(currentStudentData, reportContent),

    new Paragraph({}),

    reTable(currentStudentData, reportContent),

  ];

  const doc = new Document({
    creator: "ReportMaster",
    title: `${currentStudentData.studentName}'s Report Card`,
    description: `Report card for ${currentStudentData.studentName}`,
    sections: [{
      properties: {
        column: {
          space: 708,
          count: 2,
        },
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
          },
          margin: {
            top: convertMillimetersToTwip(6).valueOf(),
            right: convertMillimetersToTwip(6).valueOf(),
            bottom: convertMillimetersToTwip(6).valueOf(),
            left: convertMillimetersToTwip(6).valueOf(),
          }
        }
      },
      children: children,
    }],
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24,
            font,
          },
          paragraph: {
            spacing: { after: 120 },
          },
        },
        {
          id: "Label",
          name: "Label",
          next: "Normal",
          basedOn: "Normal",
          quickFormat: true,
          run: {
            bold: true,
          }
        }
      ],
    },
  });
  return Packer.toBlob(doc);
};
