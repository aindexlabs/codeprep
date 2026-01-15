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

export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    points: number;
    timeRemaining: string;
    category: string;
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
export function useDailyChallenge() {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const challengeRef = ref(database, 'dailyChallenge');

        const unsubscribe = onValue(
            challengeRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setChallenge(snapshot.val());
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => off(challengeRef, 'value', unsubscribe);
    }, []);

    return { challenge, loading, error };
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
