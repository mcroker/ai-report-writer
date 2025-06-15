'use server';
import { generateReportContent, type GenerateReportContentInput, type GenerateReportContentOutput } from '@/ai/flows/generate-report-content';

export async function handleGenerateReportServerAction(
  data: GenerateReportContentInput
): Promise<{ success: boolean; data?: GenerateReportContentOutput; error?: string }> {
  try {
    // Input data is already typed via GenerateReportContentInput.
    // The AI flow `generateReportContent` will handle its own Zod schema validation.
    const result = await generateReportContent(data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating report content:", error);
    // Provide a user-friendly error message.
    // Specific error messages from the AI or system might not be suitable for direct display.
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred while generating the report." };
  }
}
