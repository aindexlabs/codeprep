'use server';

import { generatePersonalizedQuestionSets, type GeneratePersonalizedQuestionSetsInput } from '@/ai/flows/generate-personalized-question-sets';
import { sleep } from '@/lib/utils';

export async function getPersonalizedQuestions(input: GeneratePersonalizedQuestionSetsInput) {
  try {
    // Simulate a network delay for a better UX
    await sleep(1000); 

    const result = await generatePersonalizedQuestionSets(input);
    
    if (!result || !result.questions) {
      throw new Error("Invalid response from AI service.");
    }
    
    return { success: true, questions: result.questions };
  } catch (error) {
    console.error("Error generating personalized questions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to generate questions: ${errorMessage}` };
  }
}
