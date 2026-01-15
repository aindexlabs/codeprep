import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge, type DifficultyLevel } from "@/components/ui/difficulty-badge";
import type { QuestionSet } from "@/lib/mock-data";

interface QuestionSetCardProps {
    questionSet: QuestionSet;
    onStart?: () => void;
}

export function QuestionSetCard({ questionSet, onStart }: QuestionSetCardProps) {
    const progress = (questionSet.completedQuestions / questionSet.totalQuestions) * 100;
    const isStarted = questionSet.completedQuestions > 0;
    const isCompleted = questionSet.completedQuestions === questionSet.totalQuestions;

    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{questionSet.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {questionSet.description}
                        </p>
                    </div>
                    <DifficultyBadge level={questionSet.difficulty as DifficultyLevel} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {questionSet.completedQuestions}/{questionSet.totalQuestions} Questions
                        </span>
                        <span className="text-muted-foreground">{questionSet.estimatedTime}</span>
                    </div>

                    <Progress value={progress} className="h-2" />

                    <Button
                        onClick={onStart}
                        variant={isCompleted ? "outline" : "default"}
                        className="w-full"
                    >
                        {isCompleted ? "Review" : isStarted ? "Resume" : "Start Challenge"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
