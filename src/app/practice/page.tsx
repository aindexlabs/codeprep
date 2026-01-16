"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Lightbulb, Loader2, ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useChallenge } from "@/hooks/use-firebase-data";
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackConsole,
    SandpackTests,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";

export default function PracticePage() {
    return (
        <React.Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading practice environment...</p>
                </div>
            </div>
        }>
            <PracticeContent />
        </React.Suspense>
    );
}

function PracticeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Get challenge ID from URL or default to 'daily'
    const challengeId = searchParams.get("id") || "daily";
    const experienceLevel = searchParams.get("experienceLevel") || searchParams.get("level");

    const { challenge, loading, error } = useChallenge(challengeId, user?.id || null, experienceLevel);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading challenge...</p>
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Challenge Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        We couldn't load the requested challenge. It might have expired or you may need to generate a new learning path.
                    </p>
                    <Button onClick={() => router.push('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // Determine template based on category
    const isReact = challenge.category?.toLowerCase().includes("react");
    const template = isReact ? "react-ts" : "vanilla-ts";

    // Dynamic file generation
    const files = isReact ? {
        "/App.tsx": `import { useState, useEffect } from 'react';

// Problem: ${challenge.title}
${challenge.description.split('\n').map(line => `// ${line}`).join('\n')}

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      <h1>${challenge.title}</h1>
      <p>Start coding to solve the challenge!</p>
    </div>
  );
}`,
        "/App.test.tsx": `import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders title", () => {
    render(<App />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});`,
    } : {
        "/index.ts": `// Problem: ${challenge.title}
${challenge.description.split('\n').map(line => `// ${line}`).join('\n')}

export function solution() {
  console.log("Hello from Vanilla TS!");
  return true;
}

// Run solution
solution();
`,
        "/index.test.ts": `import { solution } from "./index";

describe("solution", () => {
  test("returns true", () => {
    expect(solution()).toBe(true);
  });
});`,
    };

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col">
            {/* Header - render only if not in fullscreen */}
            {!isFullscreen && (
                <div className="flex items-start justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => router.push('/dashboard')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-2xl font-headline font-bold mb-2">
                            {challenge.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                {challenge.category || "General"}
                            </Badge>
                            <Badge variant="outline">
                                {challenge.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="font-mono text-xs">
                                {template}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Get a Hint
                        </Button>
                    </div>
                </div>
            )}

            <div className={`flex flex-col gap-6 flex-1 min-h-0 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-0' : ''}`}>
                {/* Top Section - Challenge Details - hide in fullscreen */}
                {!isFullscreen && (
                    <div className="space-y-6">
                        {/* Description Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Challenge Description</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground space-y-4">
                                <p className="whitespace-pre-wrap">
                                    {challenge.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Pro Tip */}
                        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Lightbulb className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold mb-1">Pro Tip</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Focus on edge cases. What happens if the input is empty or null?
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className={`flex-1 flex flex-col relative transition-all duration-300 ${isFullscreen ? 'h-full' : 'min-h-[800px]'}`}>
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm border shadow-sm"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-4 w-4" />
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <SandpackProvider
                        template={template}
                        theme="dark"
                        files={files as any}
                        options={{
                            externalResources: ["https://cdn.tailwindcss.com"],
                        }}
                        className="flex-1 flex flex-col h-full rounded-xl overflow-hidden border border-border"
                    >
                        <SandpackLayout className="flex-1 h-full">
                            <SandpackFileExplorer
                                style={{
                                    height: isFullscreen ? "100vh" : "600px",
                                }}
                            />
                            <SandpackCodeEditor
                                showTabs
                                showLineNumbers
                                showInlineErrors
                                wrapContent
                                closableTabs
                                className="h-full"
                                style={{
                                    height: isFullscreen ? "100vh" : "600px",
                                }}
                            />
                            {template !== 'vanilla-ts' ? (
                                <SandpackPreview
                                    className="h-full"
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                    style={{
                                        height: isFullscreen ? "100vh" : "600px",
                                    }}
                                />
                            ) : (
                                <SandpackConsole
                                    showRestartButton
                                    className="h-full"
                                    style={{
                                        height: isFullscreen ? "100vh" : "600px",
                                    }}
                                />
                            )}
                        </SandpackLayout>
                    </SandpackProvider>
                </div>
            </div>
        </div>
    );
}
