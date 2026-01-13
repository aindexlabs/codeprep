"use client";

import type { Question } from "@/lib/questions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QuestionViewProps {
  question: Question;
}

export function QuestionView({ question }: QuestionViewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{question.category}</Badge>
              <Badge variant="secondary">{question.level}</Badge>
            </div>
            <CardTitle className="font-headline text-2xl md:text-3xl">{question.title}</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={question.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2" />
              Learn More
            </a>
          </Button>
        </div>
        <CardDescription className="pt-2">{question.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center"><BookOpen className="mr-2 text-primary"/>Example</h3>
          <CodeBlock code={question.example} />
        </div>
        
        <Separator />

        <div>
           <h3 className="font-semibold text-lg mb-2">Practice Environment</h3>
          <Textarea
            placeholder="Write your code and notes here..."
            className="font-code h-64 bg-background"
          />
        </div>
      </CardContent>
      <CardFooter>
         <Button>Check Answer (Not Implemented)</Button>
      </CardFooter>
    </Card>
  );
}
