import * as React from "react";
import { cn } from "@/lib/utils";

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'BASIC';

interface DifficultyBadgeProps {
    level: DifficultyLevel;
    className?: string;
}

const difficultyConfig = {
    BEGINNER: {
        label: 'Beginner',
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    BASIC: {
        label: 'Basic',
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    INTERMEDIATE: {
        label: 'Intermediate',
        className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    ADVANCED: {
        label: 'Advanced',
        className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    },
};

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
    const config = difficultyConfig[level];

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border uppercase tracking-wide",
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}
