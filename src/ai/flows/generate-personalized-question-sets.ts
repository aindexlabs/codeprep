// src/ai/flows/generate-personalized-question-sets.ts
'use server';
/**
 * @fileOverview Generates a personalized set of practice questions based on user skill level and preferred technology stack.
 *
 * - generatePersonalizedQuestionSets - A function that generates a personalized set of practice questions.
 * - GeneratePersonalizedQuestionSetsInput - The input type for the generatePersonalizedQuestionSets function.
 * - GeneratePersonalizedQuestionSetsOutput - The return type for the generatePersonalizedQuestionSets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedQuestionSetsInputSchema = z.object({
  skillLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The skill level of the user.'),
  preferredTechStack: z
    .array(z.string())
    .describe('The preferred technology stack of the user.'),
  pastPerformance: z
    .record(z.number())
    .optional()
    .describe('A map of question ids to performance scores (0-1).'),
});
export type GeneratePersonalizedQuestionSetsInput = z.infer<typeof GeneratePersonalizedQuestionSetsInputSchema>;

const GeneratePersonalizedQuestionSetsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('A list of personalized practice questions.'),
});
export type GeneratePersonalizedQuestionSetsOutput = z.infer<typeof GeneratePersonalizedQuestionSetsOutputSchema>;

export async function generatePersonalizedQuestionSets(
  input: GeneratePersonalizedQuestionSetsInput
): Promise<GeneratePersonalizedQuestionSetsOutput> {
  return generatePersonalizedQuestionSetsFlow(input);
}

const questionSuggestionTool = ai.defineTool(
  {
    name: 'suggestPracticeQuestions',
    description: 'Intelligently suggests relevant practice questions based on performance.',
    inputSchema: z.object({
      skillLevel: z
        .enum(['beginner', 'intermediate', 'advanced'])
        .describe('The skill level of the user.'),
      preferredTechStack: z
        .array(z.string())
        .describe('The preferred technology stack of the user.'),
      pastPerformance: z
        .record(z.number())
        .optional()
        .describe('A map of question ids to performance scores (0-1).'),
    }),
    outputSchema: z.array(z.string()).describe('A list of question ids'),
  },
  async (input) => {
    // In a real application, this would call a service to fetch questions
    // based on the input.
    console.log('Suggesting questions based on:', input);
    // For now, return a hardcoded list of questions.
    return [
      'question1',
      'question2',
      'question3',
    ];
  }
);

const prompt = ai.definePrompt({
  name: 'generatePersonalizedQuestionSetsPrompt',
  tools: [questionSuggestionTool],
  input: {schema: GeneratePersonalizedQuestionSetsInputSchema},
  output: {schema: GeneratePersonalizedQuestionSetsOutputSchema},
  prompt: `You are an expert AI interviewer.

  Based on the user's skill level ({{
    skillLevel
  }}) and preferred technology stack ({{
    preferredTechStack
  }}), suggest a set of practice interview questions using the suggestPracticeQuestions tool.

  Here's the user's past performance on questions, if available: {{
    pastPerformance
  }}

  Return only the questions from the suggestPracticeQuestions tool.
  `,
});

const generatePersonalizedQuestionSetsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedQuestionSetsFlow',
    inputSchema: GeneratePersonalizedQuestionSetsInputSchema,
    outputSchema: GeneratePersonalizedQuestionSetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      questions: output?.questions ?? [],
    };
  }
);
