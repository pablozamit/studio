'use server';
/**
 * @fileOverview Detecta si la descripción de una imagen sugiere contenido erótico o inapropiado.
 *
 * - detectContent - Función que maneja el análisis de la descripción de la imagen.
 * - DetectContentInput - El tipo de entrada para la función detectContent.
 * - DetectContentOutput - El tipo de retorno para la función detectContent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectContentInputSchema = z.object({
  imageDescription: z.string().describe('La descripción de la imagen a analizar.'),
});
export type DetectContentInput = z.infer<typeof DetectContentInputSchema>;

const DetectContentOutputSchema = z.object({
  isInappropriate: z.boolean().describe('True si la imagen contiene contenido erótico o inapropiado, false en caso contrario.'),
  confidence: z.number().min(0).max(1).describe('Un número entre 0 y 1 que indica el nivel de confianza.'),
  reason: z.string().describe('Una breve explicación de la decisión.'),
});
export type DetectContentOutput = z.infer<typeof DetectContentOutputSchema>;

export async function detectContent(input: DetectContentInput): Promise<DetectContentOutput> {
  return detectContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectContentPrompt',
  input: {schema: DetectContentInputSchema},
  output: {schema: DetectContentOutputSchema},
  prompt: `Analiza la siguiente descripción de una imagen y determina si contiene contenido erótico o inapropiado.
      
Descripción: {{{imageDescription}}}

Responde con un objeto JSON con las siguientes propiedades:
- isInappropriate: true si la imagen contiene contenido erótico o inapropiado, false en caso contrario
- confidence: un número entre 0 y 1 que indica tu nivel de confianza
- reason: una breve explicación de tu decisión

Solo responde con el objeto JSON, sin texto adicional.
`,
  config: { // Ajustar la configuración de seguridad si es necesario para permitir el análisis de este tipo de contenido.
    safetySettings: [
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const detectContentFlow = ai.defineFlow(
  {
    name: 'detectContentFlow',
    inputSchema: DetectContentInputSchema,
    outputSchema: DetectContentOutputSchema,
  },
  async (input: DetectContentInput) => {
    const {output} = await prompt(input);
    
    if (!output) {
      // Fallback en caso de que la respuesta no sea un JSON válido o sea bloqueada por otros filtros
      return {
        isInappropriate: false, // Default to not inappropriate if analysis fails
        confidence: 0.5,
        reason: "No se pudo analizar la descripción o la respuesta no fue válida.",
      };
    }
    // El prompt ya está configurado para devolver el schema correcto,
    // así que no es necesario parsear JSON manualmente si el output schema está bien definido.
    return output;
  }
);
