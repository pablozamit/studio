
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
      <h1 className="text-3xl font-bold mb-8 text-foreground">Configuración</h1>
      
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Información del Guardián
            </CardTitle>
            <CardDescription>
              Este correo se usa para notificaciones y no se puede cambiar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="guardianEmail" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Correo Electrónico del Guardián
              </Label>
              <Input 
                id="guardianEmail" 
                type="email" 
                value={guardianEmail || "Cargando..."} 
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
              Preferencias de Notificación
            </CardTitle>
            <CardDescription>
              Gestiona cómo recibes alertas de la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="localNotifications" className="text-base">Habilitar Notificaciones Locales</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas directamente en la interfaz de la app. (Simulado)
                </p>
              </div>
              <Switch
                id="localNotifications"
                checked={localNotificationsEnabled}
                onCheckedChange={toggleLocalNotifications}
                aria-label="Alternar notificaciones locales"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
