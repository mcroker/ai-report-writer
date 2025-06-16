
'use server';
import { generateReportContent, type GenerateReportContentInput, type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

export async function handleGenerateReportServerAction(
  data: GenerateReportContentInput 
): Promise<{ success: boolean; data?: GenerateReportContentOutput; error?: string }> {
  try {
    // Input data is already typed via GenerateReportContentInput.
    // The AI flow `generateReportContent` will handle its own Zod schema validation.
    // The schema in the AI flow expects all fields, so ensure they are present, even if empty or false.
    const completeData: GenerateReportContentInput = {
      studentName: data.studentName,
      attendance: data.attendance,
      notes: data.notes || '',
      listeningAttentionUnderstanding: data.listeningAttentionUnderstanding || false,
      speaking: data.speaking || false,
      comprehension: data.comprehension || false,
      wordReading: data.wordReading || false,
      writing: data.writing || false,
      grossMotorSkills: data.grossMotorSkills || false,
      fineMotorSkills: data.fineMotorSkills || false,
      selfRegulation: data.selfRegulation || false,
      managingSelf: data.managingSelf || false,
      buildingRelationships: data.buildingRelationships || false,
      pastAndPresent: data.pastAndPresent || false,
      peopleCultureCommunities: data.peopleCultureCommunities || false,
      theNaturalWorld: data.theNaturalWorld || false,
      creatingWithMaterials: data.creatingWithMaterials || false,
      beingImaginativeExpressive: data.beingImaginativeExpressive || false,
    };
    const result = await generateReportContent(completeData);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating report content:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred while generating the report." };
  }
}
