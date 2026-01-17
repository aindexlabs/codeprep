"use client";

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import type { GeneratedQuestion, LearningPath } from '@/lib/firebase-service';

export interface UserProgress {
    totalQuestions: number;
    completedQuestions: number;
    successRate: number;
    timeRemaining: string;
    skillBreakdown: {
        skill: string;
        completed: number;
        total: number;
    }[];
}

export interface DailyChallenge extends GeneratedQuestion {
    points: number;
    timeRemaining: string;
}

export interface SkillGrowthData {
    week: string;
    JavaScript: number;
    TypeScript: number;
    React: number;
}

export interface StrengthWeaknessData {
    skill: string;
    value: number;
}

export interface FocusArea {
    id: string;
    title: string;
    description: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'BASIC';
    estimatedTime: string;
}

/**
 * Hook to fetch user's learning paths from Firebase
 */
export function useLearningPaths(userId: string | null) {
    const [paths, setPaths] = useState<LearningPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const pathsRef = ref(database, `learningPaths/${userId}`);

        const unsubscribe = onValue(
            pathsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const pathsArray = Object.values(data) as LearningPath[];
                    setPaths(pathsArray.sort((a, b) => b.createdAt - a.createdAt));
                } else {
                    setPaths([]);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(pathsRef, 'value', unsubscribe);
    }, [userId]);

    return { paths, loading, error };
}

/**
 * Hook to fetch user's questions from Firebase
 */
export function useUserQuestions(userId: string | null) {
    const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const questionsRef = ref(database, `questions/${userId}`);

        const unsubscribe = onValue(
            questionsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const questionsArray = Object.values(data) as GeneratedQuestion[];
                    setQuestions(questionsArray.sort((a, b) => b.createdAt - a.createdAt));
                } else {
                    setQuestions([]);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(questionsRef, 'value', unsubscribe);
    }, [userId]);

    return { questions, loading, error };
}

/**
 * Hook to fetch user progress data
 */
export function useUserProgress(userId: string | null) {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const progressRef = ref(database, `userProgress/${userId}`);

        const unsubscribe = onValue(
            progressRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setProgress(snapshot.val());
                } else {
                    // Set default progress if none exists
                    setProgress({
                        totalQuestions: 0,
                        completedQuestions: 0,
                        successRate: 0,
                        timeRemaining: '0h 0m',
                        skillBreakdown: [],
                    });
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(progressRef, 'value', unsubscribe);
    }, [userId]);

    return { progress, loading, error };
}

/**
 * Hook to fetch daily challenge
 */
/**
 * Hook to fetch daily challenge (derived from learning paths)
 */
export function useDailyChallenge(userId: string | null) {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [loading, setLoading] = useState(true);
    const { paths, loading: pathsLoading } = useLearningPaths(userId);

    useEffect(() => {
        if (pathsLoading) return;

        if (!paths || paths.length === 0) {
            setChallenge(null);
            setLoading(false);
            return;
        }

        // Get all uncompleted questions
        const allQuestions = paths.flatMap(p => p.questions || [])
            .filter(q => q.status !== 'completed');

        if (allQuestions.length === 0) {
            setChallenge(null);
            setLoading(false);
            return;
        }

        // Deterministic selection based on date string
        // This ensures the same user gets the same question for the whole day
        const today = new Date().toDateString(); // e.g., "Fri Jan 17 2026"

        // Simple hash of the date string
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash) + today.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        // Use absolute value of hash to pick index
        const index = Math.abs(hash) % allQuestions.length;
        const selectedQuestion = allQuestions[index];

        // Calculate time remaining until end of day
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diffMs = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        setChallenge({
            ...selectedQuestion,
            points: 100, // Fixed points for daily challenge
            timeRemaining: `${hours}h ${minutes}m`
        });
        setLoading(false);

    }, [paths, pathsLoading]);

    return { challenge, loading: loading || pathsLoading, error: null };
}

/**
 * Hook to fetch a specific challenge by ID (or daily)
 */
export function useChallenge(id: string | null, userId: string | null, experienceLevel?: string | null) {
    const [challenge, setChallenge] = useState<GeneratedQuestion | DailyChallenge | null>(null);
    const [pathId, setPathId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);

        if (userId) {
            // Fetch from learning paths
            const learningPathsRef = ref(database, `learningPaths/${userId}`);

            const unsubscribe = onValue(
                learningPathsRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const paths = Object.values(data) as LearningPath[];

                        // Filter by experience level if provided
                        const filteredPaths = experienceLevel
                            ? paths.filter(p => p.experienceLevel === experienceLevel)
                            : paths;

                        // Flatten all questions from the relevant paths
                        const allQuestions = filteredPaths.flatMap(p => p.questions || []);

                        // Find the path that contains this question
                        let foundPathId = null;
                        let foundQuestion = null;

                        for (const path of filteredPaths) {
                            const q = path.questions?.find(q => q.id === id);
                            if (q) {
                                foundQuestion = q;
                                foundPathId = path.id;
                                break;
                            }
                        }

                        setChallenge(foundQuestion || null);
                        setPathId(foundPathId);
                    } else {
                        setChallenge(null);
                    }
                    setLoading(false);
                },
                (err) => {
                    setError(err as Error);
                    setLoading(false);
                }
            );
            return () => off(learningPathsRef, 'value', unsubscribe);
        } else {
            setLoading(false);
        }
    }, [id, userId, experienceLevel]);

    return { challenge, pathId, loading, error };
}

/**
 * Hook to fetch skill growth data
 */
export function useSkillGrowth(userId: string | null) {
    const [skillGrowth, setSkillGrowth] = useState<SkillGrowthData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const skillGrowthRef = ref(database, `skillGrowth/${userId}`);

        const unsubscribe = onValue(
            skillGrowthRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setSkillGrowth(Array.isArray(data) ? data : Object.values(data));
                } else {
                    setSkillGrowth([]);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(skillGrowthRef, 'value', unsubscribe);
    }, [userId]);

    return { skillGrowth, loading, error };
}

/**
 * Hook to fetch strengths and weaknesses data
 */
export function useStrengthsWeaknesses(userId: string | null) {
    const [data, setData] = useState<StrengthWeaknessData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const dataRef = ref(database, `strengthsWeaknesses/${userId}`);

        const unsubscribe = onValue(
            dataRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const rawData = snapshot.val();
                    setData(Array.isArray(rawData) ? rawData : Object.values(rawData));
                } else {
                    setData([]);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(dataRef, 'value', unsubscribe);
    }, [userId]);

    return { data, loading, error };
}

/**
 * Hook to fetch focus areas
 */
export function useFocusAreas(userId: string | null) {
    const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const focusAreasRef = ref(database, `focusAreas/${userId}`);

        const unsubscribe = onValue(
            focusAreasRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setFocusAreas(Array.isArray(data) ? data : Object.values(data));
                } else {
                    setFocusAreas([]);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(focusAreasRef, 'value', unsubscribe);
    }, [userId]);

    return { focusAreas, loading, error };
}

/**
 * Hook to derive performance data from learning paths
 */
export function usePerformanceData(userId: string | null) {
    const [stats, setStats] = useState<{
        problemsSolved: number;
        successRate: number;
        timeRemaining: string;
        skillGrowth: SkillGrowthData[];
        strengthWeakness: StrengthWeaknessData[];
        focusAreas: FocusArea[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    const { paths, loading: pathsLoading } = useLearningPaths(userId);

    useEffect(() => {
        if (!userId || pathsLoading) {
            if (!userId) setLoading(false);
            return;
        }

        // Aggregate all questions
        const allQuestions = paths.flatMap(p => p.questions || []);
        const completedQuestions = allQuestions.filter(q => q.status === 'completed');

        // 1. Basic Stats
        const problemsSolved = completedQuestions.length;
        const successRate = allQuestions.length > 0
            ? Math.round((problemsSolved / allQuestions.length) * 100)
            : 0;

        // Mock time remaining based on uncompleted questions (avg 30 mins per question)
        const uncompletedCount = allQuestions.length - problemsSolved;
        const totalMinutesRemaining = uncompletedCount * 30;
        const hours = Math.floor(totalMinutesRemaining / 60);
        const minutes = totalMinutesRemaining % 60;
        const timeRemaining = `${hours}h ${minutes}m`;

        // 2. Skill Growth (Distribution of Available vs Completed)
        // For now, we'll show distribution of ALL questions as "Available" skills
        const skillCounts: Record<string, number> = {};
        allQuestions.forEach(q => {
            const cat = q.category || 'General';
            skillCounts[cat] = (skillCounts[cat] || 0) + 1;
        });

        const skillGrowth: SkillGrowthData[] = [
            {
                week: 'Current',
                ...Object.keys(skillCounts).reduce((acc, key) => ({
                    ...acc,
                    [key]: skillCounts[key]
                }), { JavaScript: 0, TypeScript: 0, React: 0 } as any)
            }
        ];

        // 3. Strengths vs Weaknesses (Based on difficulty of completed)
        // If no completed, show distribution by difficulty of available questions
        const difficultyCounts: Record<string, number> = {};
        allQuestions.forEach(q => {
            const diff = q.difficulty || 'BEGINNER';
            difficultyCounts[diff] = (difficultyCounts[diff] || 0) + 1;
        });

        const strengthWeakness: StrengthWeaknessData[] = [
            { skill: 'Beginner', value: difficultyCounts['BEGINNER'] || 0 },
            { skill: 'Intermediate', value: difficultyCounts['INTERMEDIATE'] || 0 },
            { skill: 'Advanced', value: difficultyCounts['ADVANCED'] || 0 },
        ];

        // 4. Focus Areas (Categories with most uncompleted questions)
        const focusAreaCounts: Record<string, number> = {};
        allQuestions.filter(q => q.status !== 'completed').forEach(q => {
            const cat = q.category || 'General';
            focusAreaCounts[cat] = (focusAreaCounts[cat] || 0) + 1;
        });

        const focusAreas: FocusArea[] = Object.entries(focusAreaCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([cat, count], index) => ({
                id: `focus-${index}`,
                title: `${cat} Mastery`,
                description: `${count} uncompleted challenges`,
                difficulty: 'INTERMEDIATE',
                estimatedTime: `${count * 0.5}h`
            }));

        setStats({
            problemsSolved,
            successRate,
            timeRemaining,
            skillGrowth,
            strengthWeakness,
            focusAreas
        });
        setLoading(false);

    }, [userId, paths, pathsLoading]);

    return { stats, loading };
}
