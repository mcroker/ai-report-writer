
// use server'
'use server';
/**
 * @fileOverview AI agent that generates personalized report content based on student data.
 *
 * - generateReportContent - A function that handles the report content generation process.
 * - GenerateReportContentInput - The input type for the generateReportContent function.
 * - GenerateReportContentOutput - The return type for the generateReportContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportContentInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  className: z.string().describe('The class name or identifier.'),
  grades: z.string().describe('The grades of the student in various subjects.'),
  attendance: z.string().describe('The attendance record of the student.'),
  notes: z.string().describe('Any additional notes or observations about the student. Can be empty.'),
  earlyLearningGoals: z.string().describe('The early learning goals for the student. Can be empty.'),
});
export type GenerateReportContentInput = z.infer<typeof GenerateReportContentInputSchema>;

const GenerateReportContentOutputSchema = z.object({
  summary: z.string().describe('A summary of the student performance.'),
  observations: z.string().describe('Observations about the student behavior and learning.'),
  suggestions: z.string().describe('Suggestions for the student improvement.'),
});
export type GenerateReportContentOutput = z.infer<typeof GenerateReportContentOutputSchema>;

export async function generateReportContent(input: GenerateReportContentInput): Promise<GenerateReportContentOutput> {
  return generateReportContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportContentPrompt',
  input: {schema: GenerateReportContentInputSchema},
  output: {schema: GenerateReportContentOutputSchema},
  prompt: `You are an expert teacher composing a student report.

  Based on the following student data, generate a summary of the student's performance, observations about the student's behavior and learning, and suggestions for the student's improvement.
  Incorporate information from early learning goals into the relevant sections if provided.

  Student Name: {{{studentName}}}
  Class: {{{className}}}
  Grades: {{{grades}}}
  Attendance: {{{attendance}}}
  Notes: {{{notes}}}
  Early Learning Goals: {{{earlyLearningGoals}}}

  Summary:
  Observations:
  Suggestions:`,
});

const generateReportContentFlow = ai.defineFlow(
  {
    name: 'generateReportContentFlow',
    inputSchema: GenerateReportContentInputSchema,
    outputSchema: GenerateReportContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
