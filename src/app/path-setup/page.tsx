"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { generateLearningPathQuestions, type GenerateLearningPathInput } from "@/app/actions";
import { saveLearningPath, type GeneratedQuestion } from "@/lib/firebase-service";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";

const experienceLevels = [
    {
        id: "junior",
        title: "Junior",
        subtitle: "0-2 years",
        description: "Focus on syntax, core concepts, and DOM manipulation",
    },
    {
        id: "mid-level",
        title: "Mid-Level",
        subtitle: "2-5 years",
        description: "Deep dive into state management, data structures, and performance",
        recommended: true,
    },
    {
        id: "senior",
        title: "Senior",
        subtitle: "5+ years",
        description: "System design, scalability, team leadership, and architecture patterns",
    },
];

const techStack = [
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
    { id: "react", label: "React.js" },
    { id: "react-native", label: "React Native" },
    { id: "nextjs", label: "Next.js" },
    { id: "algorithm", label: "Algorithm" },
    { id: "system-design", label: "System Design" },
];

const MAX_QUESTIONS = 30;
const DEFAULT_QUESTIONS = 5;

export default function PathSetupPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const router = useRouter();
    const [selectedLevel, setSelectedLevel] = React.useState("mid-level");
    const [selectedTech, setSelectedTech] = React.useState<string[]>(["javascript", "typescript"]);
    const [numberOfQuestions, setNumberOfQuestions] = React.useState(DEFAULT_QUESTIONS);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generatedQuestions, setGeneratedQuestions] = React.useState<GeneratedQuestion[]>([]);
    const [pathId, setPathId] = React.useState<string | null>(null);

    const toggleTech = (techId: string) => {
        setSelectedTech(prev =>
            prev.includes(techId)
                ? prev.filter(id => id !== techId)
                : [...prev, techId]
        );
    };

    const handleNumberOfQuestionsChange = (value: string) => {
        const num = parseInt(value);
        if (isNaN(num)) {
            setNumberOfQuestions(DEFAULT_QUESTIONS);
        } else if (num < 1) {
            setNumberOfQuestions(1);
        } else if (num > MAX_QUESTIONS) {
            setNumberOfQuestions(MAX_QUESTIONS);
            toast({
                title: "Maximum reached",
                description: `Maximum ${MAX_QUESTIONS} questions allowed`,
                variant: "destructive",
            });
        } else {
            setNumberOfQuestions(num);
        }
    };

    const handleGeneratePath = async () => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please sign in to generate a learning path",
                variant: "destructive",
            });
            router.push('/login');
            return;
        }

        if (selectedTech.length === 0) {
            toast({
                title: "No tech stack selected",
                description: "Please select at least one technology",
                variant: "destructive",
            });
            return;
        }

        setIsGenerating(true);
        setGeneratedQuestions([]);
        setPathId(null);

        try {
            const input: GenerateLearningPathInput = {
                userId: user.id,
                experienceLevel: selectedLevel as 'junior' | 'mid-level' | 'senior',
                techStack: selectedTech,
                numberOfQuestions: numberOfQuestions,
            };

            // 1. Generate questions using AI (Server Action)
            const result = await generateLearningPathQuestions(input);

            if (result.success && result.questions) {
                // 2. Save to Firebase (Client-side)
                const newPathId = await saveLearningPath(
                    user.id,
                    selectedLevel,
                    selectedTech,
                    result.questions
                );

                setGeneratedQuestions(result.questions);
                setPathId(newPathId);

                toast({
                    title: "Learning path generated!",
                    description: `Successfully created ${result.questions.length} questions and saved to database.`,
                });
            } else {
                throw new Error(result.error || 'Failed to generate learning path');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Generation failed",
                description: error instanceof Error ? error.message : "Failed to generate learning path",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
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
                <h1 className="text-3xl font-headline font-bold">
                    Configure Your Roadmap
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Configuration */}
                <div className="space-y-6">
                    {/* Experience Level */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Experience Level</CardTitle>
                            <p className="text-sm text-muted-foreground">SELECT ONE</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {experienceLevels.map((level) => (
                                <div
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedLevel === level.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }
                  `}
                                >
                                    {level.recommended && (
                                        <Badge className="absolute -top-2 -right-2 bg-primary">
                                            Recommended
                                        </Badge>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className={`
                      mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedLevel === level.id
                                                ? 'border-primary bg-primary'
                                                : 'border-muted-foreground'
                                            }
                    `}>
                                            {selectedLevel === level.id && (
                                                <Check className="w-3 h-3 text-primary-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">{level.title}</h3>
                                                <span className="text-sm text-muted-foreground">{level.subtitle}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{level.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Target Tech Stack */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Target Tech Stack</CardTitle>
                            <p className="text-sm text-muted-foreground">MULTI-SELECT</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {techStack.map((tech) => (
                                    <div
                                        key={tech.id}
                                        onClick={() => toggleTech(tech.id)}
                                        className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all text-center
                      ${selectedTech.includes(tech.id)
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                            }
                    `}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Checkbox checked={selectedTech.includes(tech.id)} />
                                            <span className="font-medium text-sm">{tech.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Generated Questions or Preview */}
                <div className="space-y-6">
                    {/* AI Recommendation */}
                    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-1">AI-Powered Generation</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Click "Initialize Learning Path" to generate personalized questions using AI based on your selections.
                                    </p>
                                </div>
                            </div>

                            {/* Number of Questions Input */}
                            <div className="space-y-2">
                                <Label htmlFor="num-questions" className="text-sm font-medium">
                                    Number of Questions
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="num-questions"
                                        type="number"
                                        min={1}
                                        max={MAX_QUESTIONS}
                                        value={numberOfQuestions}
                                        onChange={(e) => handleNumberOfQuestionsChange(e.target.value)}
                                        className="w-24"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        (max {MAX_QUESTIONS})
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="sticky top-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    {generatedQuestions.length > 0 ? 'Generated Questions' : 'Live Roadmap'}
                                </CardTitle>
                                {pathId && (
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                        Saved to Database
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {generatedQuestions.length === 0 ? (
                                <>
                                    {/* Preview Stats */}
                                    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold font-headline text-primary">{numberOfQuestions}</div>
                                            <div className="text-xs text-muted-foreground">Questions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold font-headline text-primary">{selectedTech.length}</div>
                                            <div className="text-xs text-muted-foreground">Technologies</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold font-headline text-primary">~2h</div>
                                            <div className="text-xs text-muted-foreground">Est. Time</div>
                                        </div>
                                    </div>

                                    <div className="text-center py-8">
                                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Ready to generate your personalized learning path with AI
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Generated Questions List */}
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {generatedQuestions.map((question, index) => (
                                            <div
                                                key={question.id}
                                                className="p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="font-semibold text-sm flex-1">{question.title}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {question.difficulty}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                    {question.description}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {question.category}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {question.requirements.length} requirements
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={generatedQuestions.length > 0 ? () => router.push('/dashboard') : handleGeneratePath}
                                disabled={isGenerating || selectedTech.length === 0}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating with AI...
                                    </>
                                ) : generatedQuestions.length > 0 ? (
                                    <>
                                        Checkout Questions →
                                    </>
                                ) : (
                                    <>
                                        Initialize Learning Path →
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
