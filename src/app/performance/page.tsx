"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillChart } from "@/components/charts/skill-chart";
import { StrengthRadarChart } from "@/components/charts/radar-chart";
import { useUser } from "@/contexts/user-context";
import { usePerformanceData } from "@/hooks/use-firebase-data";
import { CheckCircle2, Target, Clock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PerformancePage() {
    const { user } = useUser();
    const { stats, loading } = usePerformanceData(user?.id || null);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">No Performance Data</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    We don't have enough data to generate analytics yet. Start a learning path to see your skills grow!
                </p>
                <Link href="/path-setup">
                    <Button>Generate Learning Path</Button>
                </Link>
            </div>
        );
    }

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
                    value={stats.problemsSolved}
                    trend={{ value: 0, isPositive: true }}
                />
                <StatCard
                    icon={Target}
                    label="Success Rate"
                    value={`${stats.successRate}%`}
                    trend={{ value: 0, isPositive: true }}
                />
                <StatCard
                    icon={Clock}
                    label="Est. Time Remaining"
                    value={stats.timeRemaining}
                    trend={{ value: 0, isPositive: true }}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skill Growth Over Time */}
                <Card>
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-1">Skill Distribution</h3>
                            <p className="text-sm text-muted-foreground">Based on available questions</p>
                        </div>
                        <SkillChart data={stats.skillGrowth} />
                    </CardContent>
                </Card>

                {/* Strengths vs. Weakness */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Difficulty Breakdown</h3>
                        <StrengthRadarChart data={stats.strengthWeakness} />
                    </CardContent>
                </Card>
            </div>

            {/* Recommended Focus Areas */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Recommended Focus Areas</h3>
                    </div>

                    <div className="space-y-4">
                        {stats.focusAreas.length > 0 ? (
                            stats.focusAreas.map((area) => (
                                <div
                                    key={area.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Target className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-1">{area.title}</h4>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-muted-foreground">{area.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="bg-muted">
                                            {area.estimatedTime}
                                        </Badge>
                                        <Link href="/practice?id=daily">
                                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                Practice Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                No specific focus areas identified yet. Keep practicing!
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
