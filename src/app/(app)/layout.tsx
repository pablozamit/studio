
"use client";

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGuardianStore } from '@/hooks/use-guardian-store';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // AvatarImage removed as not used directly here with src
import { Shield } from "lucide-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { guardianEmail, isGuardianSet, isInitialized: storeIsInitialized } = useGuardianStore();

  useEffect(() => {
    // Only attempt redirect after the store is initialized
    if (storeIsInitialized && !isGuardianSet) {
      router.replace('/');
    }
  }, [storeIsInitialized, isGuardianSet, router]);

  if (!storeIsInitialized) {
    // Store not yet initialized, show a global loader.
    // This ensures server and client initial renders match.
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-foreground">Initializing Guardian Angel...</p>
       </div>
    );
  }

  if (!isGuardianSet) {
    // Store is initialized, but guardian is not set (e.g., localStorage was empty, or user logged out).
    // The useEffect above should be handling the redirect to '/'.
    // Show a loader for this transient state.
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-foreground">Verifying Guardian Profile...</p>
       </div>
    );
  }

  // Store is initialized and guardian is set, render the main app layout
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center">
            <Avatar className="h-10 w-10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                <Shield size={24}/>
              </div>
              <AvatarFallback>GA</AvatarFallback>
            </Avatar>
           <div className="group-data-[collapsible=icon]:hidden ml-2">
             <p className="font-semibold text-sm">Guardian Angel</p>
             <p className="text-xs text-sidebar-foreground/80">Protecting Your Space</p>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4">
           <div className="group-data-[collapsible=icon]:hidden text-xs text-sidebar-foreground/70">
            © {new Date().getFullYear()} Guardian Angel
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
