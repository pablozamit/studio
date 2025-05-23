
"use client";

import { useState } from 'react';
import { ShieldAlert, AlertTriangle, BarChart3, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuardianStore } from '@/hooks/use-guardian-store';
import { useToast } from "@/hooks/use-toast";
import { BlockingOverlay } from '@/components/core/blocking-overlay';

export default function DashboardPage() {
  const { blockedAttempts, incrementBlockedAttempts, guardianEmail } = useGuardianStore();
  const { toast } = useToast();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleSimulateDetection = () => {
    incrementBlockedAttempts();
    setIsOverlayOpen(true);
    toast({
      title: "Content Alert Sent",
      description: `Guardian ${guardianEmail || ''} notified of inappropriate content detection.`,
      variant: "default",
      action: <Button variant="ghost" size="sm" onClick={() => {}}><Mail className="mr-2 h-4 w-4" />Details</Button>,
    });
  };

  const handleSimulateTamper = () => {
    toast({
      title: "Tamper Alert Sent",
      description: `Guardian ${guardianEmail || ''} notified of a potential tamper attempt.`,
      variant: "destructive",
      action: <Button variant="ghost" size="sm" onClick={() => {}}><AlertTriangle className="mr-2 h-4 w-4" />Review</Button>,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{blockedAttempts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total inappropriate content access attempts blocked.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guardian Email</CardTitle>
            <Mail className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-accent">{guardianEmail || "Not set"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Notifications will be sent to this address.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Simulate Content Detection
            </CardTitle>
            <CardDescription>
              Test the content blocking and guardian notification flow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSimulateDetection} className="w-full bg-destructive hover:bg-destructive/90">
              Trigger Detection
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
             Simulate Tamper Attempt
            </CardTitle>
            <CardDescription>
              Test the tamper detection and guardian notification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSimulateTamper} variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10">
              Trigger Tamper Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      <BlockingOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </div>
  );
}
