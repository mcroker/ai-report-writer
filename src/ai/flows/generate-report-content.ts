
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
  grossMotorSkills: "Gross Motor Skills",
  fineMotorSkills: "Fine Motor Skills",
  selfRegulation: "Self-regulation",
  managingSelf: "Managing Self",
  buildingRelationships: "Building Relationships",
  comprehension: "Comprehension",
  wordReading: "Word Reading",
  writing: "Writing",
  number: "Number",
  numericalPatterns: "Numerical Patterns",
  pastAndPresent: "Past and Present",
  peopleCultureCommunities: "People, Culture and Communities",
  theNaturalWorld: "The Natural World",
  creatingWithMaterials: "Creating with Materials",
  beingImaginativeExpressive: "Being Imaginative and Expressive",
};

const GenerateReportContentInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  attendance: z.string().describe('The attendance record of the student.'),
  notes: z.string().describe('Any additional notes or observations about the student. Can be empty.'),
   
  // Early Learning Skills - Booleans
  listeningAttentionUnderstanding: z.boolean().optional().describe('Skill: Listening, Attention and Understanding observed.'),
  speaking: z.boolean().optional().describe('Skill: Speaking observed.'),
  grossMotorSkills: z.boolean().optional().describe('Skill: Gross Motor Skills observed.'),
  fineMotorSkills: z.boolean().optional().describe('Skill: Fine Motor Skills observed.'),
  selfRegulation: z.boolean().optional().describe('Skill: Self-regulation observed.'),
  managingSelf: z.boolean().optional().describe('Skill: Managing Self observed.'),
  buildingRelationships: z.boolean().optional().describe('Skill: Building Relationships observed.'),
  comprehension: z.boolean().optional().describe('Skill: Comprehension observed.'),
  wordReading: z.boolean().optional().describe('Skill: Word Reading observed.'),
  writing: z.boolean().optional().describe('Skill: Writing observed.'),
  number: z.boolean().optional().describe('Skill: Number.'),
  numericalPatterns: z.boolean().optional().describe('Skill: Numerical Patterns.'),
  pastAndPresent: z.boolean().optional().describe('Skill: Understanding Past and Present observed.'),
  peopleCultureCommunities: z.boolean().optional().describe('Skill: Understanding People, Culture and Communities observed.'),
  theNaturalWorld: z.boolean().optional().describe('Skill: Understanding The Natural World observed.'),
  creatingWithMaterials: z.boolean().optional().describe('Skill: Creating with Materials observed.'),
  beingImaginativeExpressive: z.boolean().optional().describe('Skill: Being Imaginative and Expressive observed.'),
});

export type GenerateReportContentInput = z.infer<typeof GenerateReportContentInputSchema>;

const GenerateReportContentOutputSchema = z.object({
  playingAndExploring: z.string().describe('Finding out and exploring, Using what you know in your play, Being willing to have a go'),
  activeLearning: z.string().describe('Being involved and concentrating, Keeping on trying, Enjoying achieving what you set out to do.'),
  creatingAndThinkingCritically: z.string().describe('Having your own ideas, Using what you already know to learn new things, Choosing ways to do things and finding new ways.'),
  communcationAndLanguageNextSteps: z.string(),
  physicalDevelopmentNextSteps: z.string(),
  personalSocialEmotionalDevelopmentNextSteps: z.string(),
  literacyNextSteps: z.string(),
  mathmaticsNextSteps: z.string(),
  understandingTheWorldNextSteps: z.string(),
  expressiveArtsAndDesignNextSteps: z.string(),
  religousEductionComments: z.string(),
  generalComments: z.string(), 
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
  Attendance: {{{attendance}}}
  Notes: {{{notes}}}
  Observed Early Learning Skills (from toggles): {{{observedSkillsString}}}

  Consider the observed skills when discussing strengths or areas for development.

  Include the following sections in the report. Write no more than 200 words in total:
  Playing and Exploring - Finding out and exploring, Using what you know in your play, Being willing to have a go
  Active Learning - Being involved and concentrating, Keeping on trying, Enjoying achieving what you set out to do
  Creating and Thinking Critially - Having your own ideas, Using what you already know to learn new things, Choosing ways to do things and finding new ways
  
  Include the following sections in the report, for each explain what the student needs to do to progress. Write a single sentence for each:
  Communication and Language Next Steps
  Physical Development Next Steps
  Personal, Social and Emotional Development Next Steps
  Literacy Next Steps
  Mathematics Next Steps
  Understanding the World Next Steps
  Expressive Arts and Design Next Steps

  Include the following sections in the report:
  Religious Education Comments
  General Comments
  `
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

    /* 
    const output = {
      playingAndExploring: 'Finding out and exploring, Using what you know in your play, Being willing to have a go',
      activeLearning: 'Being involved and concentrating, Keeping on trying, Enjoying achieving what you set out to do.',
      creatingAndThinkingCritically: 'Having your own ideas, Using what you already know to learn new things, Choosing ways to do things and finding new ways.'
    }
    */

    return output!;
  }
);