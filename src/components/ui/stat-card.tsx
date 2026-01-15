import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
    return (
        <Card className={cn("", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{label}</p>
                        <p className="text-3xl font-bold font-headline">{value}</p>
                    </div>
                    {trend && (
                        <div className={cn(
                            "text-sm font-medium flex items-center gap-1",
                            trend.isPositive ? "text-emerald-500" : "text-rose-500"
                        )}>
                            <span>{trend.isPositive ? "↑" : "↓"}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
