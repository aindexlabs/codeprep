"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Card className="flex items-center justify-center min-h-[60vh]">
                <CardContent className="text-center p-12">
                    <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-2xl font-headline font-bold mb-2">Settings</h2>
                    <p className="text-muted-foreground">
                        Coming soon - Customize your learning experience
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
