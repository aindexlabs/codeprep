"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    Lightbulb,
    Loader2,
    ArrowLeft,
    Maximize2,
    Minimize2,
    Terminal,
    Files,
    BookOpen,
    Settings,
    Code,
    ChevronRight,
    Search,
    GripVertical,
    GripHorizontal,
    CheckCircle2
} from "lucide-react";
import { markQuestionAsComplete } from "@/lib/firebase-service";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
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
    const [activeSidebarTab, setActiveSidebarTab] = React.useState<"files" | "instructions">("files");
    const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
    const [isCompleting, setIsCompleting] = React.useState(false);

    // Get challenge ID from URL or default to 'daily'
    const challengeId = searchParams.get("id") || "daily";
    const experienceLevel = searchParams.get("experienceLevel") || searchParams.get("level");

    const { challenge, pathId, loading, error } = useChallenge(challengeId, user?.id || null, experienceLevel);

    // Initial state depends on template, but we can't know template until challenge loads.
    // So we default to true (safe) and update it via effect once challenge is loaded.
    const [isConsoleVisible, setIsConsoleVisible] = React.useState(true);

    React.useEffect(() => {
        if (challenge?.category) {
            const isReact = challenge.category.toLowerCase().includes("react");
            // React: hidden (false), Vanilla: visible (true)
            setIsConsoleVisible(!isReact);
        }
    }, [challenge]);

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
        <div className={`flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50 overflow-hidden h-screen w-screen' : 'h-[calc(100vh-64px)]'}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .sp-console pre {
                    white-space: pre-wrap !important;
                    word-break: break-all !important;
                    overflow-x: hidden !important;
                }
                .sp-console {
                    overflow-x: hidden !important;
                }
            `}} />
            {/* Top Navigation Bar - Similar to IDE header */}
            <div className="flex items-center justify-between px-4 h-12 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => router.push('/dashboard')}
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-md">
                            {challenge.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4 font-mono px-1">
                            {template}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 hidden sm:flex">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Hint
                    </Button>
                    <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
                    {pathId && user && (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 text-xs gap-1.5 bg-green-600 hover:bg-green-700 text-white border-none"
                            disabled={isCompleting || challenge.status === 'completed'}
                            onClick={async () => {
                                setIsCompleting(true);
                                try {
                                    await markQuestionAsComplete(user.id, pathId, challenge.id);
                                    router.push('/dashboard');
                                } catch (error) {
                                    console.error("Failed to mark complete:", error);
                                } finally {
                                    setIsCompleting(false);
                                }
                            }}
                        >
                            {isCompleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            {challenge.status === 'completed' ? 'Completed' : 'Mark Complete'}
                        </Button>
                    )}
                    <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative h-full w-full">
                {/* Activity Bar - Far Left */}
                <div className="w-12 bg-muted/30 border-r border-border flex flex-col items-center py-4 gap-4 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 relative ${activeSidebarTab === "instructions" && isSidebarVisible ? "text-primary bg-card" : "text-muted-foreground"}`}
                        onClick={() => {
                            if (activeSidebarTab === "instructions") setIsSidebarVisible(!isSidebarVisible);
                            else { setActiveSidebarTab("instructions"); setIsSidebarVisible(true); }
                        }}
                        title="Instructions"
                    >
                        <BookOpen className="w-5 h-5" />
                        {activeSidebarTab === "instructions" && isSidebarVisible && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 relative ${activeSidebarTab === "files" && isSidebarVisible ? "text-primary bg-card" : "text-muted-foreground"}`}
                        onClick={() => {
                            if (activeSidebarTab === "files") setIsSidebarVisible(!isSidebarVisible);
                            else { setActiveSidebarTab("files"); setIsSidebarVisible(true); }
                        }}
                        title="File Explorer"
                    >
                        <Files className="w-5 h-5" />
                        {activeSidebarTab === "files" && isSidebarVisible && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary" />
                        )}
                    </Button>
                    <div className="mt-auto">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <SandpackProvider
                    template={template}
                    theme="dark"
                    files={files as any}
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                    }}
                    className="flex-1 flex overflow-hidden h-full !w-full"
                >
                    <SandpackLayout className="flex-1 border-none bg-transparent rounded-none h-full !w-full">
                        <PanelGroup direction="horizontal" className="flex-1 overflow-hidden w-full">
                            {/* Sidebar Content (Explorer or Instructions) */}
                            {isSidebarVisible && (
                                <>
                                    <Panel
                                        defaultSize={20}
                                        minSize={15}
                                        maxSize={40}
                                        className="border-r border-border bg-muted/10 flex flex-col"
                                    >
                                        <div className="px-4 h-9 flex items-center justify-between shrink-0">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                {activeSidebarTab === "files" ? "Explorer" : "Instructions"}
                                            </span>
                                        </div>
                                        <div className="flex-1 overflow-auto w-full">
                                            {activeSidebarTab === "files" ? (
                                                <SandpackFileExplorer className="h-full w-full !bg-transparent" />
                                            ) : (
                                                <div className="p-4 space-y-4 max-w-full">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xs font-semibold uppercase text-muted-foreground/70">Problem</h3>
                                                        <h2 className="text-sm font-semibold">{challenge.title}</h2>
                                                        <div className="flex gap-2 pt-1">
                                                            <Badge className="text-[9px] py-0 h-4 px-1.5 uppercase font-bold tracking-tighter" variant="secondary">{challenge.difficulty}</Badge>
                                                            <Badge variant="outline" className="text-[9px] py-0 h-4 px-1.5 uppercase font-bold tracking-tighter">{challenge.category}</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-border pt-4">
                                                        <div className="prose prose-invert max-w-none">
                                                            <p className="text-[13px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
                                                                {challenge.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Panel>
                                    <PanelResizeHandle className="w-1.5 hover:bg-primary/30 transition-colors flex items-center justify-center group">
                                        <div className="w-[1px] h-4 bg-border group-hover:bg-primary/50 transition-colors" />
                                    </PanelResizeHandle>
                                </>
                            )}

                            {/* Right Pane: Editor + Preview + Console */}
                            <Panel className="flex flex-col flex-1 overflow-hidden min-w-0 !w-full">
                                <PanelGroup direction="vertical" className="flex-1 !w-full">
                                    <Panel defaultSize={70} minSize={20} className="flex flex-col overflow-hidden">
                                        <PanelGroup direction="horizontal" className="flex-1">
                                            {/* Editor Area */}
                                            <Panel defaultSize={isReact ? 50 : 100} minSize={20} className="flex flex-col min-w-0 min-h-0 bg-[#0d0d0d]">
                                                <SandpackCodeEditor
                                                    showTabs
                                                    showLineNumbers
                                                    showInlineErrors
                                                    wrapContent
                                                    closableTabs
                                                    className="flex-1 !h-full"
                                                />
                                            </Panel>

                                            {/* Always mount Preview for execution, but hide for non-React */}
                                            <PanelResizeHandle className={`w-1.5 hover:bg-primary/30 transition-colors flex items-center justify-center group bg-border/20 ${!isReact ? "hidden" : ""}`} />
                                            <Panel
                                                defaultSize={isReact ? 50 : 0}
                                                minSize={isReact ? 20 : 0}
                                                className={`bg-white border-l border-border h-full flex flex-col overflow-hidden ${!isReact ? "hidden" : ""}`}
                                            >
                                                <SandpackPreview
                                                    className="flex-1 h-full"
                                                    showOpenInCodeSandbox={false}
                                                    showRefreshButton={true}
                                                />
                                            </Panel>
                                        </PanelGroup>
                                    </Panel>

                                    {/* Console Panel */}
                                    {isConsoleVisible ? (
                                        <>
                                            <PanelResizeHandle className="h-1.5 hover:bg-primary/30 transition-colors flex items-center justify-center group bg-border/20">
                                                <div className="h-[1px] w-6 bg-border group-hover:bg-primary/50 transition-colors" />
                                            </PanelResizeHandle>
                                            <Panel defaultSize={30} minSize={10} className="flex flex-col bg-card overflow-hidden">
                                                <div className="flex items-center justify-between px-3 h-9 border-b border-border bg-muted/20 shrink-0">
                                                    <div className="flex items-center gap-4 h-full">
                                                        <div className="flex items-center gap-1.5 text-primary border-b border-primary h-full px-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Output</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => setIsConsoleVisible(false)}
                                                        >
                                                            <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <SandpackConsole
                                                        className="!h-full"
                                                        showRestartButton={true}
                                                        showSyntaxError
                                                    />
                                                </div>
                                            </Panel>
                                        </>
                                    ) : null}
                                </PanelGroup>

                                {!isConsoleVisible && (
                                    <div className="h-7 border-t border-border bg-muted/5 shrink-0 flex items-center px-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 text-[10px] gap-1 px-1 hover:bg-muted text-muted-foreground hover:text-foreground font-bold tracking-wider"
                                            onClick={() => setIsConsoleVisible(true)}
                                        >
                                            <Terminal className="w-3 h-3" />
                                            OUTPUT
                                        </Button>
                                    </div>
                                )}
                            </Panel>
                        </PanelGroup>
                    </SandpackLayout>
                </SandpackProvider>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-primary text-primary-foreground px-3 flex items-center justify-between text-[10px] font-medium shrink-0">
                <div className="flex items-center gap-4 h-full">
                    <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 cursor-pointer h-full border-r border-white/10">
                        <Code className="w-3 h-3" />
                        <span>Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 cursor-pointer h-full hidden sm:flex">
                        <span>main</span>
                    </div>
                </div>
                <div className="flex items-center h-full">
                    <div className="hover:bg-white/10 h-full px-3 flex items-center cursor-pointer border-l border-white/10">Ln 1, Col 1</div>
                    <div className="hover:bg-white/10 h-full px-3 flex items-center cursor-pointer border-l border-white/10">Spaces: 2</div>
                    <div className="hover:bg-white/10 h-full px-3 flex items-center cursor-pointer border-l border-white/10 uppercase tracking-tighter">UTF-8</div>
                    <div className="flex items-center gap-1.5 px-3 h-full border-l border-white/10 bg-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="uppercase tracking-tighter">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
