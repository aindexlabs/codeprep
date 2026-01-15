"use client";

import * as React from "react";
import {
    SidebarProvider,
    Sidebar,
    SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/header";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AppTemplate({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <SidebarProvider defaultOpen>
                <Sidebar>
                    <AppSidebar />
                </Sidebar>
                <SidebarInset>
                    <AppHeader />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </ProtectedRoute>
    );
}
