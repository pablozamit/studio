
"use client";

import { useState } from 'react';
import { ShieldAlert, AlertTriangle, BarChart3, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuardianStore } from '@/hooks/use-guardian-store';
import { useToast } from "@/hooks/use-toast";
import { BlockingOverlay } from '@/components/core/blocking-overlay';
import { TestDetection } from '@/components/core/test-detection'; // Nueva importación


export default function DashboardPage() {
  const { blockedAttempts, incrementBlockedAttempts, guardianEmail } = useGuardianStore();
  const { toast } = useToast();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleSimulateDetection = () => {
    incrementBlockedAttempts();
    setIsOverlayOpen(true);
    toast({
      title: "Alerta de Contenido Enviada",
      description: `Guardián ${guardianEmail || ''} notificado de detección de contenido inapropiado.`,
      variant: "default",
      action: <Button variant="ghost" size="sm"><Mail className="mr-2 h-4 w-4" />Detalles</Button>,
    });
  };

  const handleSimulateTamper = () => {
    toast({
      title: "Alerta de Manipulación Enviada",
      description: `Guardián ${guardianEmail || ''} notificado de un posible intento de manipulación.`,
      variant: "destructive",
      action: <Button variant="ghost" size="sm"><AlertTriangle className="mr-2 h-4 w-4" />Revisar</Button>,
    });
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8"> {/* Added space-y-8 for spacing */}
      <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos Bloqueados</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{blockedAttempts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de detecciones de contenido inapropiado.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correo del Guardián</CardTitle>
            <Mail className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-accent">{guardianEmail || "No establecido"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Las notificaciones simuladas se envían conceptualmente a esta dirección.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Nueva sección para TestDetection */}
      <div>
        <TestDetection setIsOverlayOpen={setIsOverlayOpen} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Simular Detección de Contenido (Manual)
            </CardTitle>
            <CardDescription>
              Activa manualmente el bloqueo de contenido y la notificación simulada al guardián.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSimulateDetection} className="w-full bg-destructive hover:bg-destructive/90">
              Activar Detección Manual
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
             Simular Intento de Manipulación
            </CardTitle>
            <CardDescription>
              Prueba la detección de manipulación y la notificación simulada al guardián.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSimulateTamper} variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10">
              Activar Alerta de Manipulación
            </Button>
          </CardContent>
        </Card>
      </div>

      <BlockingOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </div>
  );
}
