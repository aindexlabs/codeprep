"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { CodePrepLogo } from "@/components/icons";
import {
  LayoutDashboard,
  Map, // Changed from MapPin
  Code2,
  BarChart3, // Changed from TrendingUp
  Users,
  Trophy,
  Settings,
  User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/path-setup", label: "Path Setup", icon: Map }, // Changed from MapPin
  { href: "/practice", label: "Practice Arena", icon: Code2 },
  { href: "/performance", label: "Performance", icon: BarChart3 }, // Changed from TrendingUp
  { href: "/mock-interview", label: "Mock Interview", icon: Users },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <CodePrepLogo className="w-8 h-8 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-xl font-headline font-semibold text-sidebar-foreground">
              DevPrep
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-4 border-t">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Developer'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role || 'Student'}</p>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
