"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
interface SkillChartProps {
    data: any[];
}

export function SkillChart({ data }: SkillChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                    dataKey="week"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                />
                <Line
                    type="monotone"
                    dataKey="JavaScript"
                    stroke="#F7DF1E"
                    strokeWidth={2}
                    dot={{ fill: '#F7DF1E', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="TypeScript"
                    stroke="#3178C6"
                    strokeWidth={2}
                    dot={{ fill: '#3178C6', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="React"
                    stroke="#61DAFB"
                    strokeWidth={2}
                    dot={{ fill: '#61DAFB', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
