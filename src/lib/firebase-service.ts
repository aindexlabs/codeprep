import { database } from './firebase';
import { ref, set, get, push, remove, update } from 'firebase/database';

export interface GeneratedQuestion {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    requirements: string[];
    hints: string[];
    solution?: string;
    testCases?: string[];
    createdAt: number;
    // Progress tracking
    status?: 'completed' | 'in-progress' | 'not-started';
    completedAt?: number;
    timeSpent?: number; // in seconds
}

export interface LearningPath {
    id: string;
    userId: string;
    experienceLevel: string;
    techStack: string[];
    questions: GeneratedQuestion[];
    createdAt: number;
    updatedAt: number;
}

/**
 * Save a learning path with generated questions to Firebase
 */
export async function saveLearningPath(
    userId: string,
    experienceLevel: string,
    techStack: string[],
    questions: GeneratedQuestion[]
): Promise<string> {
    try {
        const learningPathsRef = ref(database, `learningPaths/${userId}`);
        const newPathRef = push(learningPathsRef);

        const learningPath: LearningPath = {
            id: newPathRef.key!,
            userId,
            experienceLevel,
            techStack,
            questions,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        await set(newPathRef, learningPath);
        return newPathRef.key!;
    } catch (error) {
        console.error('Error saving learning path:', error);
        throw new Error('Failed to save learning path');
    }
}

/**
 * Get all learning paths for a user
 */
export async function getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    try {
        const learningPathsRef = ref(database, `learningPaths/${userId}`);
        const snapshot = await get(learningPathsRef);

        if (!snapshot.exists()) {
            return [];
        }

        const paths: LearningPath[] = [];
        snapshot.forEach((childSnapshot) => {
            paths.push(childSnapshot.val());
        });

        return paths.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        console.error('Error getting learning paths:', error);
        throw new Error('Failed to get learning paths');
    }
}

/**
 * Get a specific learning path
 */
export async function getLearningPath(userId: string, pathId: string): Promise<LearningPath | null> {
    try {
        const pathRef = ref(database, `learningPaths/${userId}/${pathId}`);
        const snapshot = await get(pathRef);

        if (!snapshot.exists()) {
            return null;
        }

        return snapshot.val();
    } catch (error) {
        console.error('Error getting learning path:', error);
        throw new Error('Failed to get learning path');
    }
}

/**
 * Update a learning path
 */
export async function updateLearningPath(
    userId: string,
    pathId: string,
    updates: Partial<LearningPath>
): Promise<void> {
    try {
        const pathRef = ref(database, `learningPaths/${userId}/${pathId}`);
        await update(pathRef, {
            ...updates,
            updatedAt: Date.now(),
        });
    } catch (error) {
        console.error('Error updating learning path:', error);
        throw new Error('Failed to update learning path');
    }
}

/**
 * Delete a learning path
 */
export async function deleteLearningPath(userId: string, pathId: string): Promise<void> {
    try {
        const pathRef = ref(database, `learningPaths/${userId}/${pathId}`);
        await remove(pathRef);
    } catch (error) {
        console.error('Error deleting learning path:', error);
        throw new Error('Failed to delete learning path');
    }
}

/**
 * Save a single question
 */
export async function saveQuestion(userId: string, question: GeneratedQuestion): Promise<string> {
    try {
        const questionsRef = ref(database, `questions/${userId}`);
        const newQuestionRef = push(questionsRef);

        await set(newQuestionRef, {
            ...question,
            id: newQuestionRef.key!,
            createdAt: Date.now(),
        });

        return newQuestionRef.key!;
    } catch (error) {
        console.error('Error saving question:', error);
        throw new Error('Failed to save question');
    }
}

/**
 * Get all questions for a user
 */
export async function getUserQuestions(userId: string): Promise<GeneratedQuestion[]> {
    try {
        const questionsRef = ref(database, `questions/${userId}`);
        const snapshot = await get(questionsRef);

        if (!snapshot.exists()) {
            return [];
        }

        const questions: GeneratedQuestion[] = [];
        snapshot.forEach((childSnapshot) => {
            questions.push(childSnapshot.val());
        });

        return questions.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        console.error('Error getting questions:', error);
        throw new Error('Failed to get questions');
    }
}

/**
 * Mark a question as complete within a learning path
 */
export async function markQuestionAsComplete(userId: string, pathId: string, questionId: string): Promise<void> {
    try {
        // First get the path to find the question index
        // This is necessary because Firebase Realtime Database arrays are indexed
        const path = await getLearningPath(userId, pathId);

        if (!path || !path.questions) {
            throw new Error('Path or questions not found');
        }

        const questionIndex = path.questions.findIndex(q => q.id === questionId);

        if (questionIndex === -1) {
            throw new Error('Question not found in path');
        }

        // Update just the specific question status
        const questionStatusRef = ref(database, `learningPaths/${userId}/${pathId}/questions/${questionIndex}`);

        // We update the specific fields to avoid overwriting the whole question
        await update(questionStatusRef, {
            status: 'completed',
            completedAt: Date.now()
        });

    } catch (error) {
        console.error('Error marking question as complete:', error);
        throw error;
    }
}
