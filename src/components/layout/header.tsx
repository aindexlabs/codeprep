"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex-1">
        <h1 className="text-2xl font-headline font-bold text-primary">CodePrep</h1>
      </div>
    </header>
  );
}
