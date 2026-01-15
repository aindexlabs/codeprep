"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillChart } from "@/components/charts/skill-chart";
import { StrengthRadarChart } from "@/components/charts/radar-chart";
import {
    userProgress,
    skillGrowthData,
    strengthWeaknessData,
    focusAreas
} from "@/lib/mock-data";
import { CheckCircle2, Target, Clock } from "lucide-react";

export default function PerformancePage() {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-headline font-bold mb-2">
                    Performance Analytics
                </h1>
                <p className="text-muted-foreground">
                    Tracking your journey to frontend mastery
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={CheckCircle2}
                    label="Problems Solved"
                    value={userProgress.problemsSolved}
                    trend={{ value: 15, isPositive: true }}
                />
                <StatCard
                    icon={Target}
                    label="Success Rate"
                    value={`${userProgress.successRate}%`}
                    trend={{ value: 4.2, isPositive: true }}
                />
                <StatCard
                    icon={Clock}
                    label="Time Remaining"
                    value={userProgress.timeRemaining}
                    trend={{ value: 0, isPositive: true }}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skill Growth Over Time */}
                <Card>
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-1">Skill Growth Over Time</h3>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#F7DF1E]" />
                                    <span className="text-muted-foreground">JavaScript</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#3178C6]" />
                                    <span className="text-muted-foreground">TypeScript</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#61DAFB]" />
                                    <span className="text-muted-foreground">React</span>
                                </div>
                            </div>
                        </div>
                        <SkillChart data={skillGrowthData} />
                    </CardContent>
                </Card>

                {/* Strengths vs. Weakness */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Strengths vs. Weakness</h3>
                        <StrengthRadarChart data={strengthWeaknessData} />
                    </CardContent>
                </Card>
            </div>

            {/* Recommended Focus Areas */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Recommended Focus Areas</h3>
                        <Button variant="link" className="text-primary">
                            View All Recommendations →
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {focusAreas.map((area) => (
                            <div
                                key={area.id}
                                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 rounded-lg bg-destructive/10">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                                <path
                                                    d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-destructive"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold mb-1">{area.title}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-muted-foreground">{area.description}</span>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    area.priority === 'High Priority'
                                                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }
                                            >
                                                {area.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="bg-muted">
                                        {area.difficulty === 'INTERMEDIATE' ? 'Mastery' : area.difficulty}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {area.priority === 'High Priority' ? '48%' : '60%'}
                                    </span>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                        Practice Now
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
