
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

const skillLabels: Record<string, string> = {
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
};

const GenerateReportContentInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  className: z.string().describe('The class name or identifier.'),
  grades: z.string().describe('The grades of the student in various subjects.'),
  attendance: z.string().describe('The attendance record of the student.'),
  notes: z.string().describe('Any additional notes or observations about the student. Can be empty.'),
  earlyLearningGoals: z.string().describe('The early learning goals for the student (free text input). Can be empty.'),
  
  // Early Learning Skills - Booleans
  listeningAttentionUnderstanding: z.boolean().optional().describe('Skill: Listening, Attention and Understanding observed.'),
  speaking: z.boolean().optional().describe('Skill: Speaking observed.'),
  comprehension: z.boolean().optional().describe('Skill: Comprehension observed.'),
  wordReading: z.boolean().optional().describe('Skill: Word Reading observed.'),
  writing: z.boolean().optional().describe('Skill: Writing observed.'),
  grossMotorSkills: z.boolean().optional().describe('Skill: Gross Motor Skills observed.'),
  fineMotorSkills: z.boolean().optional().describe('Skill: Fine Motor Skills observed.'),
  selfRegulation: z.boolean().optional().describe('Skill: Self-regulation observed.'),
  managingSelf: z.boolean().optional().describe('Skill: Managing Self observed.'),
  buildingRelationships: z.boolean().optional().describe('Skill: Building Relationships observed.'),
  pastAndPresent: z.boolean().optional().describe('Skill: Understanding Past and Present observed.'),
  peopleCultureCommunities: z.boolean().optional().describe('Skill: Understanding People, Culture and Communities observed.'),
  theNaturalWorld: z.boolean().optional().describe('Skill: Understanding The Natural World observed.'),
  creatingWithMaterials: z.boolean().optional().describe('Skill: Creating with Materials observed.'),
  beingImaginativeExpressive: z.boolean().optional().describe('Skill: Being Imaginative and Expressive observed.'),
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
  input: { schema: GenerateReportContentInputSchema.extend({ observedSkillsString: z.string() }) }, // Add observedSkillsString for the template
  output: { schema: GenerateReportContentOutputSchema },
  prompt: `You are an expert teacher composing a student report.

  Based on the following student data, generate a summary of the student's performance, observations about the student's behavior and learning, and suggestions for the student's improvement.
  Incorporate information from early learning goals (text input) and observed skills (toggled list) into the relevant sections if provided.

  Student Name: {{{studentName}}}
  Class: {{{className}}}
  Grades: {{{grades}}}
  Attendance: {{{attendance}}}
  Notes: {{{notes}}}
  Early Learning Goals (text input): {{{earlyLearningGoals}}}
  Observed Early Learning Skills (from toggles): {{{observedSkillsString}}}

  Consider the observed skills when discussing strengths or areas for development.

  Generate the report with the following sections:
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
    const activeSkills: string[] = [];
    for (const key in skillLabels) {
      if (input[key as keyof GenerateReportContentInput]) {
        activeSkills.push(skillLabels[key]);
      }
    }
    const observedSkillsString = activeSkills.length > 0 ? activeSkills.join(', ') : 'No specific skills highlighted by toggles.';
    
    const promptInput = { ...input, observedSkillsString };
    const {output} = await prompt(promptInput);
    return output!;
  }
);
