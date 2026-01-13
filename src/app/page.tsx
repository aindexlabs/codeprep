"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Question } from "@/lib/questions";
import { questions as allQuestions } from "@/lib/questions";
import { QuestionView } from "@/components/question-view";
import { PersonalizationForm } from "@/components/personalization-form";
import { BrainCircuit, BookCopy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question | null>(null);
  const [personalizedQuestions, setPersonalizedQuestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const findQuestionByTitle = (title: string) => {
    // This is a simplified search. In a real app, you'd likely use IDs.
    const found = allQuestions.find(q => q.title.toLowerCase().includes(title.toLowerCase().substring(0, 20)));
    if (found) {
      setSelectedQuestion(found);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar
          questions={allQuestions}
          onSelectQuestion={setSelectedQuestion}
        />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <Tabs defaultValue="explore">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="explore">
                <BookCopy className="mr-2" />
                Explore Questions
              </TabsTrigger>
              <TabsTrigger value="personalize">
                <BrainCircuit className="mr-2" />
                Personalized Path
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explore" className="mt-6">
              {selectedQuestion ? (
                <QuestionView question={selectedQuestion} />
              ) : (
                <Card className="flex items-center justify-center h-96">
                  <CardContent className="text-center p-6">
                    <p className="text-lg text-muted-foreground">
                      Select a question from the sidebar to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="personalize" className="mt-6">
              <PersonalizationForm
                setQuestions={setPersonalizedQuestions}
                setIsLoading={setIsLoading}
                setError={setError}
              />
              <div className="mt-6">
                {isLoading && <p>Generating your personalized path...</p>}
                {error && <p className="text-destructive">{error}</p>}
                {personalizedQuestions.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-headline mb-4">Your Suggested Questions</h3>
                      <ul className="space-y-2">
                        {personalizedQuestions.map((q, i) => (
                           <li key={i} className="p-2 rounded-md hover:bg-accent/50 cursor-pointer" onClick={() => findQuestionByTitle(q)}>
                             {q}
                           </li>
                        ))}
                      </ul>
                       <p className="text-sm text-muted-foreground mt-4">Click a question to view it. (Note: AI suggestions are matched to existing questions)</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
