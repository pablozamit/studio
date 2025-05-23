
"use client";

import { useState } from 'react';
import { ShieldAlert, AlertTriangle, BarChart3, Mail, SearchCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGuardianStore } from '@/hooks/use-guardian-store';
import { useToast } from "@/hooks/use-toast";
import { BlockingOverlay } from '@/components/core/blocking-overlay';
import { analyzeTextContent, type AnalyzeTextContentOutput } from '@/ai/flows/analyze-text-content-flow';


export default function DashboardPage() {
  const { blockedAttempts, incrementBlockedAttempts, guardianEmail } = useGuardianStore();
  const { toast } = useToast();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [textContentToAnalyze, setTextContentToAnalyze] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzeTextContentOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  const handleAnalyzeText = async () => {
    if (textContentToAnalyze.trim().length < 10) {
      setAnalysisError("Por favor, ingresa al menos 10 caracteres para analizar.");
      setAnalysisResult(null);
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const result = await analyzeTextContent({ textContent: textContentToAnalyze });
      setAnalysisResult(result);
      if (result.isPotentiallyErotic) {
        handleSimulateDetection(); // Reutilizamos la lógica de simulación de bloqueo
        toast({
          title: "Contenido Potencialmente Erótico Detectado por IA",
          description: result.analysis,
          variant: "destructive",
        });
      } else {
         toast({
          title: "Análisis de IA Completado",
          description: result.analysis,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error al analizar el texto:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido durante el análisis.";
      setAnalysisError(`Error al analizar: ${errorMessage}`);
      toast({
        title: "Error en el Análisis de IA",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Panel de Control</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos Bloqueados</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{blockedAttempts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de detecciones de contenido inapropiado (simuladas y por IA).
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

      <Card className="mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchCheck className="h-6 w-6 text-primary" />
            Análisis de Contenido con IA (Simulado)
          </CardTitle>
          <CardDescription>
            Pega un texto a continuación para que la IA intente detectar si es de naturaleza erótica. 
            Si se detecta, se simulará un bloqueo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Pega aquí el texto que deseas analizar..."
            value={textContentToAnalyze}
            onChange={(e) => setTextContentToAnalyze(e.target.value)}
            rows={5}
            className="shadow-sm"
          />
          <Button onClick={handleAnalyzeText} className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              "Analizar Texto con IA"
            )}
          </Button>
          {analysisError && (
            <Alert variant="destructive" className="shadow-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error de Análisis</AlertTitle>
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}
          {analysisResult && !analysisError && (
            <Alert variant={analysisResult.isPotentiallyErotic ? "destructive" : "default"} className="shadow-sm">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Resultado del Análisis de IA</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">
                  ¿Potencialmente Erótico?: {analysisResult.isPotentiallyErotic ? "Sí" : "No"}
                </p>
                <p>{analysisResult.analysis}</p>
                {analysisResult.confidenceScore && (
                   <p className="text-xs mt-1">Confianza: {(analysisResult.confidenceScore * 100).toFixed(0)}%</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>


      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Simular Detección Manual
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

