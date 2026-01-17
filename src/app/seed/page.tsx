"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { database, auth } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useUser } from "@/contexts/user-context";

// Sample Daily Challenge


// Sample Generated Questions (matching the structure likely used in Learning Paths)
const sampleQuestions = [
    {
        id: "q1",
        title: "Array.prototype.map Implementation",
        description: "Implement your own version of Array.prototype.map.",
        category: "JavaScript",
        difficulty: "BEGINNER",
        codeTemplate: "Array.prototype.myMap = function(callback) {\n  // Implementation\n}",
        createdAt: Date.now()
    },
    {
        id: "q2",
        title: "Promise.all Polyfill",
        description: "Write a polyfill for Promise.all.",
        category: "JavaScript",
        difficulty: "ADVANCED",
        codeTemplate: "function promiseAll(promises) {\n  // Implementation\n}",
        createdAt: Date.now() - 10000
    }
];

export default function SeedPage() {
    const { user } = useUser();
    const [status, setStatus] = useState("Idle");

    const seedData = async () => {
        if (!user) {
            setStatus("Error: Must be logged in");
            return;
        }

        setStatus("Seeding...");

        try {
            // Seed Daily Challenge
            // Pick a random question from sampleQuestions
            const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
            const dailyChallenge = {
                ...randomQuestion,
                id: "daily-1", // Keep fixed ID for simplicity in demo
                points: 100,
                timeRemaining: "12h 30m"
            };

            await set(ref(database, "dailyChallenge"), dailyChallenge);

            // Seed User Questions (linking to user ID)
            const questionsRef = ref(database, `questions/${user.id}`);
            // Transform array to object with IDs as keys
            const questionsObj = sampleQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});
            await set(questionsRef, questionsObj);

            // Seed Learning Path (to ensure Dashboard links work for these questions)
            const pathId = "path-1";
            await set(ref(database, `learningPaths/${user.id}/${pathId}`), {
                id: pathId,
                title: "Frontend Mastery",
                description: "Essential frontend skills",
                createdAt: Date.now(),
                questions: sampleQuestions
            });

            setStatus("Success! Database seeded.");
        } catch (error) {
            console.error(error);
            setStatus(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Database Seeder</h1>
            <p>Current User: {user ? user.email : "Not logged in"}</p>
            <Button onClick={seedData}>Seed Data</Button>
            <p className="font-mono">{status}</p>
        </div>
    );
}
