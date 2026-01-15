"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuestionSetCard } from "@/components/ui/question-set-card";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { Clock, TrendingUp, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useDailyChallenge, useUserProgress, useLearningPaths } from "@/hooks/use-firebase-data";

export default function DashboardPage() {
    const { user } = useUser();
    const { challenge, loading: challengeLoading } = useDailyChallenge();
    const { progress, loading: progressLoading } = useUserProgress(user?.id || null);
    const { paths, loading: pathsLoading } = useLearningPaths(user?.id || null);
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

    // Convert learning paths to question sets format
    const questionSets = React.useMemo(() => {
        return paths.flatMap(path =>
            path.questions.map(q => ({
                id: q.id,
                title: q.title,
                description: q.description,
                category: q.category as 'JavaScript' | 'TypeScript' | 'React' | 'Infrastructure',
                difficulty: q.difficulty,
                totalQuestions: path.questions.length,
                completedQuestions: 0, // TODO: Track completion
                estimatedTime: '30m', // TODO: Calculate from requirements
            }))
        );
    }, [paths]);

    const filteredSets = selectedCategory === "all"
        ? questionSets
        : questionSets.filter(set => set.category.toLowerCase() === selectedCategory);

    const weeklyProgressPercent = progress
        ? (progress.completedQuestions / progress.totalQuestions) * 100
        : 0;

    const isLoading = challengeLoading || progressLoading || pathsLoading;

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-headline font-bold mb-2">
                    Welcome back, {user?.name || 'Developer'}.
                </h1>
                <p className="text-muted-foreground">
                    Continue your journey to frontend mastery
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Challenge Card */}
                {challenge ? (
                    <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                                        Daily Challenge
                                    </p>
                                    <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">+{challenge.points}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                {challenge.description}
                            </p>
                            <div className="flex items-center gap-4">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    Start Challenge
                                </Button>
                                <DifficultyBadge level={challenge.difficulty} />
                                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                                    <Clock className="w-4 h-4" />
                                    <span>{challenge.timeRemaining}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="lg:col-span-2">
                        <CardContent className="flex items-center justify-center p-12">
                            <p className="text-muted-foreground">No daily challenge available</p>
                        </CardContent>
                    </Card>
                )}

                {/* Weekly Progress Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Weekly Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {progress && progress.totalQuestions > 0 ? (
                            <>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-bold font-headline">
                                            {progress.completedQuestions}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            / {progress.totalQuestions} Questions
                                        </span>
                                    </div>
                                    <Progress value={weeklyProgressPercent} className="h-2" />
                                </div>

                                <div className="space-y-3 pt-2">
                                    {progress.skillBreakdown.map((skill) => {
                                        const skillPercent = (skill.completed / skill.total) * 100;
                                        return (
                                            <div key={skill.skill}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-medium">{skill.skill}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {skill.completed}/{skill.total}
                                                    </span>
                                                </div>
                                                <Progress value={skillPercent} className="h-1.5" />
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button variant="outline" className="w-full mt-4">
                                    View Full Stats
                                </Button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground text-sm">
                                    Start practicing to track your progress
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Question Sets Section */}
            <div>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-headline font-bold">All Sets</h2>
                        <TabsList>
                            <TabsTrigger value="all">All Sets</TabsTrigger>
                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                            <TabsTrigger value="react">React</TabsTrigger>
                            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value={selectedCategory} className="mt-0">
                        {filteredSets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSets.map((set) => (
                                    <QuestionSetCard
                                        key={set.id}
                                        questionSet={set}
                                        onStart={() => console.log('Start:', set.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-12">
                                    <p className="text-muted-foreground mb-4">
                                        {selectedCategory === "all"
                                            ? "No question sets available yet"
                                            : `No ${selectedCategory} questions available`
                                        }
                                    </p>
                                    <Button onClick={() => window.location.href = '/path-setup'}>
                                        Generate Learning Path
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
