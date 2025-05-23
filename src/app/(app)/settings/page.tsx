
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useGuardianStore } from '@/hooks/use-guardian-store';
import { useAppSettingsStore } from '@/hooks/use-app-settings-store';
import { Mail, Bell, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export default function SettingsPage() {
  const { guardianEmail, isGuardianSet: isGuardianStoreInitialized } = useGuardianStore();
  const { localNotificationsEnabled, toggleLocalNotifications, isInitialized: isAppSettingsInitialized } = useAppSettingsStore();

  if (!isGuardianStoreInitialized || !isAppSettingsInitialized) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-12" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>
      
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Guardian Information
            </CardTitle>
            <CardDescription>
              This email is used for notifications and cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="guardianEmail" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Guardian's Email Address
              </Label>
              <Input 
                id="guardianEmail" 
                type="email" 
                value={guardianEmail || "Loading..."} 
                readOnly 
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-6 w-6 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Manage how you receive alerts from the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="localNotifications" className="text-base">Enable Local Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts directly within the app interface. (Simulated)
                </p>
              </div>
              <Switch
                id="localNotifications"
                checked={localNotificationsEnabled}
                onCheckedChange={toggleLocalNotifications}
                aria-label="Toggle local notifications"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

