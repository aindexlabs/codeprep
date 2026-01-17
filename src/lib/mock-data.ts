export interface QuestionSet {
    id: string;
    title: string;
    description: string;
    category: 'JavaScript' | 'TypeScript' | 'React' | 'Infrastructure' | 'Algorithm';
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'BASIC';
    totalQuestions: number;
    completedQuestions: number;
    estimatedTime: string;
}

export interface UserProgress {
    problemsSolved: number;
    successRate: number;
    timeRemaining: string;
    weeklyProgress: {
        completed: number;
        total: number;
    };
    skillProgress: {
        [key: string]: {
            completed: number;
            total: number;
        };
    };
}

export interface SkillGrowthData {
    date: string;
    JavaScript: number;
    TypeScript: number;
    React: number;
}

export interface StrengthWeaknessData {
    skill: string;
    value: number;
    fullMark: number;
}

export interface FocusArea {
    id: string;
    title: string;
    description: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'BASIC';
    priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
}

// Mock user data
export const mockUser = {
    name: 'Alex',
    avatar: '/avatars/alex.jpg',
};

// Mock daily challenge
export const dailyChallenge = {
    title: 'Implement Array.prototype.flat()',
    description: 'Write a function that flattens an array of any depth with no nesting.',
    difficulty: 'INTERMEDIATE' as const,
    timeLeft: '12 Days',
    points: 150,
};

// Mock weekly progress
export const weeklyProgress = {
    completed: 14,
    total: 28,
    skills: [
        { name: 'JavaScript', completed: 9, total: 10 },
        { name: 'React', completed: 4, total: 6 },
        { name: 'TypeScript', completed: 2, total: 6 },
    ],
};

// Mock question sets
export const questionSets: QuestionSet[] = [
    {
        id: 'react-reconciliation',
        title: 'React Reconciliation',
        description: 'Deep dive into React\'s diffing algorithm and rendering optimization patterns.',
        category: 'React',
        difficulty: 'INTERMEDIATE',
        totalQuestions: 12,
        completedQuestions: 0,
        estimatedTime: '2h 30m',
    },
    {
        id: 'async-js-promises',
        title: 'Async JS & Promises',
        description: 'Mastering the event loop, microtasks, async/await, and error handling strategies.',
        category: 'JavaScript',
        difficulty: 'INTERMEDIATE',
        totalQuestions: 8,
        completedQuestions: 5,
        estimatedTime: '1h 45m',
    },
    {
        id: 'web-vitals-performance',
        title: 'Web Vitals & Performance',
        description: 'LCP, FID, CLS explainers and practical optimization techniques for modern web.',
        category: 'Infrastructure',
        difficulty: 'BASIC',
        totalQuestions: 6,
        completedQuestions: 0,
        estimatedTime: '1h 15m',
    },
    {
        id: 'react-hooks-patterns',
        title: 'React Hooks Patterns',
        description: 'Custom hooks, useReducer patterns, and avoiding common dependency array pitfalls.',
        category: 'React',
        difficulty: 'INTERMEDIATE',
        totalQuestions: 10,
        completedQuestions: 3,
        estimatedTime: '2h',
    },
    {
        id: 'closures-scope',
        title: 'Closures & Scope',
        description: 'Lexical scoping, closure traps, and practical use cases in functional programming.',
        category: 'JavaScript',
        difficulty: 'BASIC',
        totalQuestions: 7,
        completedQuestions: 7,
        estimatedTime: '1h 30m',
    },
    {
        id: 'generics-mastery',
        title: 'Generics Mastery',
        description: 'Understanding constraints, infer, conditional types, and building type-safe components.',
        category: 'TypeScript',
        difficulty: 'ADVANCED',
        totalQuestions: 15,
        completedQuestions: 0,
        estimatedTime: '3h',
    },
];

// Mock user progress
export const userProgress: UserProgress = {
    problemsSolved: 142,
    successRate: 78.5,
    timeRemaining: '42h 15m',
    weeklyProgress: {
        completed: 14,
        total: 28,
    },
    skillProgress: {
        JavaScript: { completed: 9, total: 10 },
        React: { completed: 4, total: 6 },
        TypeScript: { completed: 2, total: 6 },
    },
};

// Mock skill growth data (for line chart)
export const skillGrowthData: SkillGrowthData[] = [
    { date: 'Week 1', JavaScript: 20, TypeScript: 15, React: 10 },
    { date: 'Week 2', JavaScript: 35, TypeScript: 25, React: 20 },
    { date: 'Week 3', JavaScript: 50, TypeScript: 40, React: 35 },
    { date: 'Week 4', JavaScript: 65, TypeScript: 55, React: 50 },
    { date: 'Week 5', JavaScript: 75, TypeScript: 65, React: 60 },
    { date: 'Week 6', JavaScript: 85, TypeScript: 75, React: 70 },
];

// Mock strengths vs weakness data (for radar chart)
export const strengthWeaknessData: StrengthWeaknessData[] = [
    { skill: 'Hooks', value: 85, fullMark: 100 },
    { skill: 'Testing', value: 45, fullMark: 100 },
    { skill: 'Perf', value: 60, fullMark: 100 },
    { skill: 'CSS', value: 50, fullMark: 100 },
    { skill: 'Infra/CI', value: 40, fullMark: 100 },
];

// Mock focus areas
export const focusAreas: FocusArea[] = [
    {
        id: 'react-memo-usememo',
        title: 'React.memo & useMemo',
        description: 'Align JS + High Priority',
        difficulty: 'INTERMEDIATE',
        priority: 'High Priority',
    },
    {
        id: 'event-loop-microtasks',
        title: 'Event Loop & Microtasks',
        description: 'Align JS + Medium Priority',
        difficulty: 'INTERMEDIATE',
        priority: 'Medium Priority',
    },
];
