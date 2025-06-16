
'use server';
import { generateReportContent, type GenerateReportContentInput, type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

// This function handles the initial full report generation
export async function handleGenerateReportServerAction(
  data: Omit<GenerateReportContentInput, 'currentReportOutput' | 'fieldToRegenerate'> // Original input fields from form
): Promise<{ success: boolean; data?: GenerateReportContentOutput; error?: string }> {
  try {
    // Construct the full input for the AI flow, ensuring all optional fields are present
    const completeData: GenerateReportContentInput = {
      studentName: data.studentName,
      attendance: data.attendance,
      notes: data.notes || '',
      earlyLearningGoals: data.earlyLearningGoals || '',
      listeningAttentionUnderstanding: data.listeningAttentionUnderstanding || false,
      speaking: data.speaking || false,
      grossMotorSkills: data.grossMotorSkills || false,
      fineMotorSkills: data.fineMotorSkills || false,
      selfRegulation: data.selfRegulation || false,
      managingSelf: data.managingSelf || false,
      buildingRelationships: data.buildingRelationships || false,
      comprehension: data.comprehension || false,
      wordReading: data.wordReading || false,
      writing: data.writing || false,
      number: data.number || false,
      numericalPatterns: data.numericalPatterns || false,
      pastAndPresent: data.pastAndPresent || false,
      peopleCultureCommunities: data.peopleCultureCommunities || false,
      theNaturalWorld: data.theNaturalWorld || false,
      creatingWithMaterials: data.creatingWithMaterials || false,
      beingImaginativeExpressive: data.beingImaginativeExpressive || false,
      // currentReportOutput and fieldToRegenerate will be undefined, signifying a full generation
    };
    const result = await generateReportContent(completeData);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating report content:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred while generating the report." };
  }
}


// New action for regenerating a single field
interface RegenerateFieldPayload {
  studentInput: Omit<GenerateReportContentInput, 'currentReportOutput' | 'fieldToRegenerate'>; // Original student form data
  currentReportOutput: GenerateReportContentOutput; // The current full report content
  fieldToRegenerate: keyof GenerateReportContentOutput;
}

export async function handleRegenerateFieldServerAction(
  payload: RegenerateFieldPayload
): Promise<{ success: boolean; data?: GenerateReportContentOutput; error?: string }> {
  try {
    const inputForAI: GenerateReportContentInput = {
      // Spread all student form fields from payload.studentInput
      studentName: payload.studentInput.studentName,
      attendance: payload.studentInput.attendance,
      notes: payload.studentInput.notes || '',
      earlyLearningGoals: payload.studentInput.earlyLearningGoals || '',
      listeningAttentionUnderstanding: payload.studentInput.listeningAttentionUnderstanding || false,
      speaking: payload.studentInput.speaking || false,
      grossMotorSkills: payload.studentInput.grossMotorSkills || false,
      fineMotorSkills: payload.studentInput.fineMotorSkills || false,
      selfRegulation: payload.studentInput.selfRegulation || false,
      managingSelf: payload.studentInput.managingSelf || false,
      buildingRelationships: payload.studentInput.buildingRelationships || false,
      comprehension: payload.studentInput.comprehension || false,
      wordReading: payload.studentInput.wordReading || false,
      writing: payload.studentInput.writing || false,
      number: payload.studentInput.number || false,
      numericalPatterns: payload.studentInput.numericalPatterns || false,
      pastAndPresent: payload.studentInput.pastAndPresent || false,
      peopleCultureCommunities: payload.studentInput.peopleCultureCommunities || false,
      theNaturalWorld: payload.studentInput.theNaturalWorld || false,
      creatingWithMaterials: payload.studentInput.creatingWithMaterials || false,
      beingImaginativeExpressive: payload.studentInput.beingImaginativeExpressive || false,
      // Add regeneration specific fields
      currentReportOutput: payload.currentReportOutput,
      fieldToRegenerate: payload.fieldToRegenerate,
    };
    const result = await generateReportContent(inputForAI);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error regenerating report field:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred while regenerating the field." };
  }
}

    