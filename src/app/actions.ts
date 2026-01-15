'use server';

import { generatePersonalizedQuestionSets, type GeneratePersonalizedQuestionSetsInput } from '@/ai/flows/generate-personalized-question-sets';
import { generateQuestions, type GenerateQuestionsInput } from '@/ai/flows/generate-questions';
import { type GeneratedQuestion } from '@/lib/firebase-service';
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

export interface GenerateLearningPathInput {
  userId: string;
  experienceLevel: 'junior' | 'mid-level' | 'senior';
  techStack: string[];
  numberOfQuestions?: number;
}

export interface GenerateLearningPathResult {
  success: boolean;
  questions?: GeneratedQuestion[];
  error?: string;
}

/**
 * Server action to generate learning path questions with AI
 */
export async function generateLearningPathQuestions(
  input: GenerateLearningPathInput
): Promise<GenerateLearningPathResult> {
  try {
    // Generate questions using AI
    const aiInput: GenerateQuestionsInput = {
      experienceLevel: input.experienceLevel,
      techStack: input.techStack,
      numberOfQuestions: input.numberOfQuestions || 5,
    };

    const { questions: aiQuestions } = await generateQuestions(aiInput);

    // Transform AI questions to our database format
    const questions: GeneratedQuestion[] = aiQuestions.map((q, index) => ({
      id: `${Date.now()}-${index}`,
      title: q.title,
      description: q.description,
      category: q.category,
      difficulty: q.difficulty,
      requirements: q.requirements,
      hints: q.hints,
      createdAt: Date.now(),
    }));

    return {
      success: true,
      questions,
    };
  } catch (error) {
    console.error('Error generating learning path questions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate questions',
    };
  }
}
