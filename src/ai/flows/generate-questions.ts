// src/ai/flows/generate-questions.ts
'use server';
/**
 * @fileOverview Generates detailed coding interview questions based on user's experience level and tech stack.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuestionsInputSchema = z.object({
    experienceLevel: z
        .enum(['junior', 'mid-level', 'senior'])
        .describe('The experience level of the user.'),
    techStack: z
        .array(z.string())
        .describe('The selected technology stack (e.g., React, TypeScript, etc.).'),
    numberOfQuestions: z
        .number()
        .optional()
        .default(5)
        .describe('Number of questions to generate.'),
});

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

const QuestionSchema = z.object({
    title: z.string().describe('The question title'),
    description: z.string().describe('Detailed description of the challenge'),
    category: z.string().describe('Technology category (e.g., React, TypeScript)'),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).describe('Difficulty level'),
    requirements: z.array(z.string()).describe('List of requirements to fulfill'),
    hints: z.array(z.string()).describe('Helpful hints for solving the problem'),
    estimatedTime: z.string().describe('Estimated time to complete (e.g., "15m", "30m")'),
});

const GenerateQuestionsOutputSchema = z.object({
    questions: z.array(QuestionSchema).describe('Array of generated questions'),
});

export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

export async function generateQuestions(
    input: GenerateQuestionsInput
): Promise<GenerateQuestionsOutput> {
    return generateQuestionsFlow(input);
}

const generateQuestionsFlow = ai.defineFlow(
    {
        name: 'generateQuestionsFlow',
        inputSchema: GenerateQuestionsInputSchema,
        outputSchema: GenerateQuestionsOutputSchema,
    },
    async (input) => {
        const { experienceLevel, techStack, numberOfQuestions } = input;

        const prompt = `You are an expert technical interviewer creating coding interview questions.

Generate ${numberOfQuestions} high-quality coding interview questions for a ${experienceLevel} developer with the following tech stack: ${techStack.join(', ')}.

Requirements:
1. Questions should be practical and relevant to real-world development
2. Difficulty should match the experience level (${experienceLevel})
3. Focus on the selected technologies: ${techStack.join(', ')}
4. Include clear requirements and helpful hints
5. Provide realistic time estimates

For each question, provide:
- A clear, concise title
- Detailed description explaining what needs to be built
- The technology category it belongs to
- Appropriate difficulty level
- 3-5 specific requirements
- 2-3 helpful hints
- Estimated completion time

Return the questions in JSON format matching this structure:
{
  "questions": [
    {
      "title": "string",
      "description": "string",
      "category": "string",
      "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      "requirements": ["string"],
      "hints": ["string"],
      "estimatedTime": "string"
    }
  ]
}`;

        const { output } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            prompt,
            output: {
                schema: GenerateQuestionsOutputSchema,
            },
        });

        return output ?? { questions: [] };
    }
);
