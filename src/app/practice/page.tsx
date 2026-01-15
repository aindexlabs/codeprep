"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, AlertCircle, Lightbulb } from "lucide-react";

const requirements = [
    { id: 1, text: "Return the initial value immediately on mount.", completed: true },
    { id: 2, text: "Update the returned value only after the delay has passed without value changes.", completed: true },
    { id: 3, text: "Ensure you clear the timeout on component unmount or value change.", completed: false },
];

const testResults = [
    { id: 1, name: "should return initial value immediately", status: "passed", time: "1 passed" },
    { id: 2, name: "should debounce value update", status: "passed", time: "1 total" },
    { id: 3, name: "should cancel timeout if value changes (also on delay change)", status: "failed", time: "Tests: 2 of 3" },
];

export default function PracticePage() {
    const [activeTab, setActiveTab] = React.useState("problem");

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="text-primary">REACT HOOKS</span>
                        <span>/</span>
                        <span>Estimated 16m</span>
                    </div>
                    <h1 className="text-3xl font-headline font-bold mb-2">
                        Challenge: useDebounce
                    </h1>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                            ⚛ React
                        </Badge>
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                            🔥 Hooks
                        </Badge>
                        <Badge variant="outline">INTERMEDIATE</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Report Issue
                    </Button>
                    <Button variant="outline" size="sm">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Get a Hint
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Challenge Details */}
                <div className="space-y-6">
                    {/* Description Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Challenge Description</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Implement a custom hook called <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-code">useDebounce</code> that delays updating a value until a specified time has passed.
                            </p>
                            <p className="text-muted-foreground">
                                The hook should accept a value and a delay in milliseconds. This is commonly used for search inputs to avoid API calls on every keystroke.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {requirements.map((req) => (
                                    <div key={req.id} className="flex items-start gap-3">
                                        <div className={`
                      mt-0.5 w-5 h-5 rounded-full flex items-center justify-center
                      ${req.completed
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-muted text-muted-foreground'
                                            }
                    `}>
                                            {req.completed ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-current" />
                                            )}
                                        </div>
                                        <p className={`text-sm ${req.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {req.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
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
                                    <h4 className="font-semibold mb-1">Pro Tip: Cleanup Function</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Always return a cleanup function from useEffect to prevent memory leaks and unexpected behavior when the component unmounts or dependencies change.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Code Editor & Tests */}
                <div className="space-y-6">
                    {/* Code Editor */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Code Editor</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline">Reset</Button>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                        Run Tests
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="bg-muted/30 p-4 font-code text-sm rounded-b-lg">
                                <pre className="text-muted-foreground">
                                    {`import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  // Your code here...
  // TODO: Implement the useDebounce hook
  
  // Update debounce value after delay
  const [debouncedValue, setDebouncedValue] = 
    useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cancel timeout if value changes (also on
    // delay change or component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value
                       // or delay changes
  
  return debouncedValue;
}`}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Results */}
                    <Card>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <CardHeader className="pb-3">
                                <TabsList className="w-full">
                                    <TabsTrigger value="terminal" className="flex-1">TERMINAL</TabsTrigger>
                                    <TabsTrigger value="problem" className="flex-1">PROBLEM</TabsTrigger>
                                    <TabsTrigger value="output" className="flex-1">OUTPUT</TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent>
                                <TabsContent value="terminal" className="mt-0">
                                    <div className="bg-muted/30 p-4 rounded-lg font-code text-sm">
                                        <p className="text-emerald-500">✓ node test.js</p>
                                        <p className="text-muted-foreground">Running tests...</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="problem" className="mt-0">
                                    <div className="space-y-3">
                                        {testResults.map((test) => (
                                            <div
                                                key={test.id}
                                                className={`
                          p-3 rounded-lg border
                          ${test.status === 'passed'
                                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                                        : 'bg-destructive/5 border-destructive/20'
                                                    }
                        `}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`
                            mt-0.5 w-5 h-5 rounded-full flex items-center justify-center
                            ${test.status === 'passed'
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-destructive text-white'
                                                        }
                          `}>
                                                        {test.status === 'passed' ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <X className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium mb-1">{test.name}</p>
                                                        <p className="text-xs text-muted-foreground">{test.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="output" className="mt-0">
                                    <div className="bg-muted/30 p-4 rounded-lg font-code text-sm">
                                        <p className="text-emerald-500">✓ PASS should return initial value immediately</p>
                                        <p className="text-emerald-500">✓ PASS should debounce value update</p>
                                        <p className="text-destructive">✗ FAILED should cancel timeout on value change</p>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
}
