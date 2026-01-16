"use client";

import * as React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
interface StrengthRadarChartProps {
    data: any[];
}

export function StrengthRadarChart({ data }: StrengthRadarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={data}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                    dataKey="skill"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '10px' }}
                />
                <Radar
                    name="Skill Level"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
