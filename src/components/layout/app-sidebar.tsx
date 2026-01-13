"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { CodePrepLogo } from "@/components/icons";
import type { Question } from "@/lib/questions";
import { Code, Bot, Brain, Database } from "lucide-react";

interface AppSidebarProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
}

const categoryIcons = {
  JavaScript: <Code />,
  TypeScript: <Bot />,
  React: <Brain />,
  'React Native': <Brain />,
  Infrastructure: <Database />,
};

export function AppSidebar({ questions, onSelectQuestion }: AppSidebarProps) {
  const groupedQuestions = questions.reduce((acc, question) => {
    const { category } = question;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <CodePrepLogo className="w-8 h-8 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-xl font-headline font-semibold text-sidebar-foreground">
              CodePrep
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {Object.entries(groupedQuestions).map(([category, qs]) => (
              <SidebarMenuItem key={category} className="mb-4">
                 <SidebarGroupLabel className="mb-1">
                  <div className="flex items-center gap-2">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    {category}
                  </div>
                </SidebarGroupLabel>
                <SidebarMenu>
                  {qs.map((q) => (
                    <SidebarMenuItem key={q.id}>
                      <SidebarMenuButton
                        onClick={() => onSelectQuestion(q)}
                        variant="ghost"
                        className="font-normal"
                        tooltip={q.title}
                      >
                        <span className="truncate">{q.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
