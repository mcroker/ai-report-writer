
"use client";

import { Document, Packer, Paragraph, Footer, Header, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';
import { type ReportFormValuesPreview } from '@/components/report-preview-display'; // Using the extended interface
import { type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

const skillLabelsMapForDocx: Record<keyof ReportFormValuesPreview, string> = {
  listeningAttentionUnderstanding: "Listening, Attention and Understanding",
  speaking: "Speaking",
  comprehension: "Comprehension",
  wordReading: "Word Reading",
  writing: "Writing",
  grossMotorSkills: "Gross Motor Skills",
  fineMotorSkills: "Fine Motor Skills",
  selfRegulation: "Self-regulation",
  managingSelf: "Managing Self",
  buildingRelationships: "Building Relationships",
  pastAndPresent: "Past and Present",
  peopleCultureCommunities: "People, Culture and Communities",
  theNaturalWorld: "The Natural World",
  creatingWithMaterials: "Creating with Materials",
  beingImaginativeExpressive: "Being Imaginative and Expressive",
  // Add other non-skill keys to satisfy TypeScript if needed, though they won't be used in skill iteration
  studentName: "", className: "", grades: "", attendance: "", notes: "", earlyLearningGoals: ""
};

export async function generateDoc(reportContent: GenerateReportContentOutput, currentStudentData: ReportFormValuesPreview):Promise<Blob> {
      
      const getActiveSkillsForDocx = () => {
        const skills: string[] = [];
        (Object.keys(skillLabelsMapForDocx) as Array<keyof ReportFormValuesPreview>).forEach(key => {
          if (currentStudentData[key] === true && skillLabelsMapForDocx[key] !== "") {
            skills.push(skillLabelsMapForDocx[key]);
          }
        });
        return skills;
      };
      const activeSkills = getActiveSkillsForDocx();

      const children = [
        new Paragraph({
          children: [new TextRun({ text: `${currentStudentData.studentName}'s Report Card`, bold: true, size: 36, font: "Times New Roman" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        new Paragraph({
          text: "Student Information",
          heading: HeadingLevel.HEADING_1,
          style: "Heading1",
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Name: ", bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: currentStudentData.studentName || "", font: "Times New Roman", size: 24 }),
          ],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Class: ", bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: currentStudentData.className || "", font: "Times New Roman", size: 24 }),
          ],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Attendance: ", bold: true, font: "Times New Roman", size: 24 }),
            new TextRun({ text: currentStudentData.attendance || "", font: "Times New Roman", size: 24 }),
          ],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new TextRun({ text: "Grades:", bold: true, font: "Times New Roman", size: 24 })],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 100 },
        }),
        ...(currentStudentData.grades || "").split('\n').map(line => new Paragraph({
          children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })],
          indent: { left: convertInchesToTwip(0.75).valueOf() }, 
          spacing: { after: 50 },
        })),
        
        ...(currentStudentData.notes && currentStudentData.notes.trim() !== '' ? [
          new Paragraph({
            children: [new TextRun({ text: "Teacher Notes:", bold: true, font: "Times New Roman", size: 24 })],
            indent: { left: convertInchesToTwip(0.5).valueOf() },
            spacing: { after: 100, before: 150 },
          }),
          ...(currentStudentData.notes || "").split('\n').map(line => new Paragraph({
            children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })],
            indent: { left: convertInchesToTwip(0.75).valueOf() },
            spacing: { after: 50 },
          }))
        ] : []),

        ...(currentStudentData.earlyLearningGoals && currentStudentData.earlyLearningGoals.trim() !== '' ? [
          new Paragraph({
            text: "Early Learning Goals (Text Input)",
            heading: HeadingLevel.HEADING_1,
            style: "Heading1",
            spacing: { after: 200, before: 300 },
          }),
          ...(currentStudentData.earlyLearningGoals || "").split('\n').map(line => new Paragraph({
            children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })],
            indent: { left: convertInchesToTwip(0.5).valueOf() },
            spacing: { after: 100 },
          }))
        ] : []),

        ...(activeSkills.length > 0 ? [
          new Paragraph({
            text: "Observed Early Learning Skills",
            heading: HeadingLevel.HEADING_1,
            style: "Heading1",
            spacing: { after: 200, before: 300 },
          }),
          ...activeSkills.map(skill => new Paragraph({
            children: [new TextRun({ text: `• ${skill}`, font: "Times New Roman", size: 24 })],
            indent: { left: convertInchesToTwip(0.5).valueOf() },
            spacing: { after: 100 },
          }))
        ] : []),
        
        new Paragraph({
          text: "Summary of Performance",
          heading: HeadingLevel.HEADING_1,
          style: "Heading1",
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [new TextRun({ text: reportContent.summary || "", font: "Times New Roman", size: 24 })],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Observations",
          heading: HeadingLevel.HEADING_1,
          style: "Heading1",
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [new TextRun({ text: reportContent.observations || "", font: "Times New Roman", size: 24 })],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Suggestions for Improvement",
          heading: HeadingLevel.HEADING_1,
          style: "Heading1",
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [new TextRun({ text: reportContent.suggestions || "", font: "Times New Roman", size: 24 })],
          indent: { left: convertInchesToTwip(0.5).valueOf() },
          spacing: { after: 200 },
        }),
      ];

      const doc = new Document({
        creator: "ReportMaster",
        title: `${currentStudentData.studentName}'s Report Card`,
        description: `Report card for ${currentStudentData.studentName}`,
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1).valueOf(),
                right: convertInchesToTwip(1).valueOf(),
                bottom: convertInchesToTwip(1).valueOf(),
                left: convertInchesToTwip(1).valueOf(),
              },
            },
          },
          children: children,
          footers: {
            default: new Footer({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Generated by ReportMaster", size: 18, font: "Times New Roman" })],
                alignment: AlignmentType.CENTER,
              })
            ]
          })
        }
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
                font: "Times New Roman",
              },
              paragraph: {
                spacing: { after: 120 }, 
              },
            },
            {
              id: "Heading1",
              name: "Heading 1",
              basedOn: "Normal",
              next: "Normal",
              quickFormat: true,
              run: {
                size: 28, 
                bold: true,
                font: "Times New Roman",
              },
              paragraph: {
                spacing: { after: 240, before: 240 }, 
              },
            }
          ],
        },
      });
      return Packer.toBlob(doc);
  };
