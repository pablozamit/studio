
"use client";

import React, { useState } from "react";
import { detectContent } from "@/ai/flows/detect-content-flow"; // Updated import
import type { DetectContentOutput } from "@/ai/flows/detect-content-flow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGuardianStore } from "@/hooks/use-guardian-store";
import { AlertTriangle, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

type TestDetectionProps = {
  setIsOverlayOpen: (isOpen: boolean) => void;
};

export function TestDetection({ setIsOverlayOpen }: TestDetectionProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectContentOutput | { error?: string } | null>(null);
  const { toast } = useToast();
  const { incrementBlockedAttempts, guardianEmail } = useGuardianStore();

  const handleAnalyze = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "URL Requerida",
        description: "Por favor, ingresa una URL de imagen.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null); // Clear previous results
    try {
      // Simulamos la descripción de la imagen.
      // En un caso real, esto podría venir de un modelo de análisis de imágenes (ej. Gemini con imagen y texto).
      // Por ahora, el flujo `detectContent` se basa en una descripción textual.
      const imageDescription = `La imagen en la URL ${imageUrl} parece mostrar... (descripción simulada para prueba). Completa esta descripción con detalles visuales relevantes para la detección de contenido.`;
      
      const detectionResult = await detectContent({ imageDescription });
      
      setResult(detectionResult);
      
      if (detectionResult.isInappropriate) {
        incrementBlockedAttempts();
        setIsOverlayOpen(true);
        toast({
          title: "Contenido Potencialmente Inapropiado Detectado",
          description: `Guardián ${guardianEmail || ''} notificado (simulado). Razón: ${detectionResult.reason}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Análisis Completado",
          description: `El contenido parece apropiado. Razón: ${detectionResult.reason}`,
          variant: "default", 
        });
      }
    } catch (error) {
      console.error("Error al analizar:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      setResult({ error: `Error al analizar la imagen: ${errorMessage}` });
      toast({
        title: "Error de Análisis",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          Prueba de Detección de Contenido (Simulada)
        </CardTitle>
        <CardDescription>
          Ingresa la URL de una imagen. La IA analizará una descripción simulada de esta imagen para detectar contenido potencialmente inapropiado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="URL de imagen para analizar (ej: https://placehold.co/600x400.png)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isAnalyzing}
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !imageUrl.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              "Analizar Descripción de Imagen"
            )}
          </Button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 border rounded-md bg-muted/50">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Resultado del Análisis:</h3>
            {'error' in result && result.error ? (
              <p className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> {result.error}
              </p>
            ) : 'isInappropriate' in result && (
              <div className="space-y-1 text-sm">
                <p className={`flex items-center gap-2 ${result.isInappropriate ? 'text-destructive' : 'text-green-600'}`}>
                  {result.isInappropriate ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  <span className="font-semibold">Es inapropiado:</span> 
                  {result.isInappropriate ? "Sí" : "No"}
                </p>
                {typeof result.confidence === 'number' && (
                  <p>
                    <span className="font-semibold">Confianza:</span>{" "}
                    {Math.round(result.confidence * 100)}%
                  </p>
                )}
                {result.reason && (
                  <p>
                    <span className="font-semibold">Razón:</span> {result.reason}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
