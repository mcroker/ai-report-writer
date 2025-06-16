
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

const outputFieldKeys = [
  "playingAndExploring",
  "activeLearning",
  "creatingAndThinkingCritically",
  "communcationAndLanguageNextSteps",
  "physicalDevelopmentNextSteps",
  "personalSocialEmotionalDevelopmentNextSteps",
  "literacyNextSteps",
  "mathematicsNextSteps",
  "understandingTheWorldNextSteps",
  "expressiveArtsAndDesignNextSteps",
  "religousEductionComments",
  "generalComments",
] as const;


const GenerateReportContentInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  attendance: z.string().describe('The attendance record of the student.'),
  notes: z.string().describe('Any additional notes or observations about the student. Can be empty.'),
  religiousEducationProgress: z.enum(["Some", "Good", "Very Good"]).describe("The student's progress in Religious Education."),
  
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

  // Fields for regeneration
  currentReportOutput: z.object({
    playingAndExploring: z.string(),
    activeLearning: z.string(),
    creatingAndThinkingCritically: z.string(),
    communcationAndLanguageNextSteps: z.string(),
    physicalDevelopmentNextSteps: z.string(),
    personalSocialEmotionalDevelopmentNextSteps: z.string(),
    literacyNextSteps: z.string(),
    mathematicsNextSteps: z.string(),
    understandingTheWorldNextSteps: z.string(),
    expressiveArtsAndDesignNextSteps: z.string(),
    religousEductionComments: z.string(),
    generalComments: z.string(),
  }).optional().describe("The existing generated report content, if regenerating a specific field."),
  fieldToRegenerate: z.enum(outputFieldKeys).optional().describe("The specific field to regenerate, if applicable."),
});

export type GenerateReportContentInput = z.infer<typeof GenerateReportContentInputSchema>;

const GenerateReportContentOutputSchema = z.object({
  playingAndExploring: z.string().describe('Finding out and exploring, Using what you know in your play, Being willing to have a go'),
  activeLearning: z.string().describe('Being involved and concentrating, Keeping on trying, Enjoying achieving what you set out to do.'),
  creatingAndThinkingCritically: z.string().describe('Having your own ideas, Using what you already know to learn new things, Choosing ways to do things and finding new ways.'),
  communcationAndLanguageNextSteps: z.string().describe('Next steps:  Communication and Language.'),
  physicalDevelopmentNextSteps: z.string().describe('Next steps: Physical Development.'),
  personalSocialEmotionalDevelopmentNextSteps: z.string().describe('Next steps: Personal Social and Emotional Development.'),
  literacyNextSteps: z.string().describe('Next steps: Literacy.'),
  mathematicsNextSteps: z.string().describe('Next steps: Mathematics.'),
  understandingTheWorldNextSteps: z.string().describe('Next steps: Understanding the World.'),
  expressiveArtsAndDesignNextSteps: z.string().describe('Next steps: Expressive Arts and Design.'),
  religousEductionComments: z.string().describe('Comments: Religious Education. Take into account the student\'s progress level.'),
  generalComments: z.string().describe('General Comments.'), 
});
export type GenerateReportContentOutput = z.infer<typeof GenerateReportContentOutputSchema>;


export async function generateReportContent(input: GenerateReportContentInput): Promise<GenerateReportContentOutput> {
  return generateReportContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportContentPrompt',
  input: { schema: GenerateReportContentInputSchema.extend({ observedSkillsString: z.string() }) },
  output: { schema: GenerateReportContentOutputSchema },
  prompt: `You are an expert teacher composing a student report.

Student Name: {{{studentName}}}
Attendance: {{{attendance}}}
Notes: {{{notes}}}
Observed Early Learning Skills (from toggles): {{{observedSkillsString}}}
Religious Education Progress: {{{religiousEducationProgress}}}

{{#if fieldToRegenerate}}
You are focusing on regenerating ONLY the content for the "{{fieldToRegenerate}}" section of a student report.
Use all the student data provided above to craft a new, high-quality response for just the "{{fieldToRegenerate}}" section.
- If "{{fieldToRegenerate}}" is "Playing and Exploring", "Active Learning", or "Creating and Thinking Critically", write a descriptive paragraph (around 50-70 words).
- If "{{fieldToRegenerate}}" is a "Next Steps" section (e.g., "Communication and Language Next Steps"), provide a single, concise sentence outlining what the student needs to do to progress.
- If "{{fieldToRegenerate}}" is "Religious Education Comments", provide a suitable paragraph (1-2 sentences), considering the student's stated progress level ({{{religiousEducationProgress}}}).
- If "{{fieldToRegenerate}}" is "General Comments", provide a suitable paragraph (1-2 sentences).

Your output MUST conform to the full report structure (i.e., include all fields like playingAndExploring, activeLearning, etc.).
However, for any field *other than* "{{fieldToRegenerate}}", you should output the exact placeholder text "CONTENT_UNCHANGED". The system will handle merging your regenerated content for "{{fieldToRegenerate}}" with the existing report. The content for "{{fieldToRegenerate}}" must be newly generated and directly address that specific report section based on the student's data.
{{else}}
Based on the student data, generate a comprehensive student report. Incorporate information from early learning goals input, observed skills, and religious education progress into the relevant sections.

Write in a professional style, but use simple language and words.
Avoid duplication of themes or examples between sections.

Include the following sections in the report. Write no more than 250 words in total for these three:
Playing and Exploring - Finding out and exploring, Using what you know in your play, Being willing to have a go
Active Learning - Being involved and concentrating, Keeping on trying, Enjoying achieving what you set out to do
Creating and Thinking Critically - Having your own ideas, Using what you already know to learn new things, Choosing ways to do things and finding new ways; congnitive thinging (e.g. mathematics)

Include the following sections in the report, for each explain what the student needs to do to progress. Write a single sentence for each:
Communication and Language Next Steps
Physical Development Next Steps
Personal, Social and Emotional Development Next Steps
Literacy Next Steps
Mathematics Next Steps
Understanding the World Next Steps
Expressive Arts and Design Next Steps

Include the following sections in the report:
Religious Education Comments (1-2 sentences, informed by their progress: {{{religiousEducationProgress}}})
General Comments (2-5 sentences related to the student's overall progress and year)
{{/if}}
`
});

const generateReportContentFlow = ai.defineFlow(
  {
    name: 'generateReportContentFlow',
    inputSchema: GenerateReportContentInputSchema,
    outputSchema: GenerateReportContentOutputSchema,
  },
  async (input: GenerateReportContentInput) => {
    const activeSkills: string[] = [];
    for (const key in skillLabels) {
      if (input[key as keyof GenerateReportContentInput]) {
        activeSkills.push(skillLabels[key]);
      }
    }
    const observedSkillsString = activeSkills.length > 0 ? activeSkills.join(', ') : 'No specific skills highlighted by toggles.';
    
    const promptInput = { ...input, observedSkillsString };
    const llmResponse = await prompt(promptInput);
    const generatedOutput = llmResponse.output;

    if (!generatedOutput) {
      throw new Error("AI failed to generate report content.");
    }

    if (input.fieldToRegenerate && input.currentReportOutput) {
      const fieldKey = input.fieldToRegenerate as keyof GenerateReportContentOutput;
      const regeneratedValue = generatedOutput[fieldKey];
      
      const updatedReport = { ...input.currentReportOutput };
      if (regeneratedValue && regeneratedValue !== "CONTENT_UNCHANGED") {
        (updatedReport[fieldKey] as any) = regeneratedValue;
      }
      const finalReport = { ...input.currentReportOutput };
      if (generatedOutput[fieldKey] !== "CONTENT_UNCHANGED") {
        finalReport[fieldKey] = generatedOutput[fieldKey];
      }
      return finalReport;

    } else {
      return generatedOutput;
    }
  }
);
