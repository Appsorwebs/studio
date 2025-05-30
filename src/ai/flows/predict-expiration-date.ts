//PredictDrugExpirationDate story
'use server';

/**
 * @fileOverview AI-powered drug expiration date prediction flow.
 *
 * - predictExpirationDate - Predicts the expiration date of a drug based on provided factors.
 * - PredictExpirationDateInput - The input type for the predictExpirationDate function.
 * - PredictExpirationDateOutput - The return type for the predictExpirationDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictExpirationDateInputSchema = z.object({
  drugName: z.string().describe('The name of the drug.'),
  dosage: z.string().describe('The dosage of the drug (e.g., 500mg).'),
  manufacturer: z.string().describe('The manufacturer of the drug.'),
  storageConditions: z
    .string()
    .describe(
      'The storage conditions of the drug (e.g., temperature, humidity).'
    ),
  manufacturingDate: z.string().describe('The manufacturing date of the drug.'),
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional notes or observations about the drug.'),
});

export type PredictExpirationDateInput = z.infer<
  typeof PredictExpirationDateInputSchema
>;

const PredictExpirationDateOutputSchema = z.object({
  predictedExpirationDate: z
    .string()
    .describe('The predicted expiration date of the drug.'),
  confidenceLevel: z
    .string()
    .describe(
      'A general statement describing the confidence level of the prediction (e.g., High, Moderate, Low).' // Changed from number to string, as a direct numerical representation of confidence may be misleading without context
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the prediction, including factors considered.'
    ),
});

export type PredictExpirationDateOutput = z.infer<
  typeof PredictExpirationDateOutputSchema
>;

export async function predictExpirationDate(
  input: PredictExpirationDateInput
): Promise<PredictExpirationDateOutput> {
  return predictExpirationDateFlow(input);
}

const predictExpirationDatePrompt = ai.definePrompt({
  name: 'predictExpirationDatePrompt',
  input: {schema: PredictExpirationDateInputSchema},
  output: {schema: PredictExpirationDateOutputSchema},
  prompt: `You are an AI assistant specialized in predicting drug expiration dates.

  Given the following information about a drug, predict its expiration date and provide a confidence level for your prediction. Explain your reasoning based on the provided factors.

  Drug Name: {{{drugName}}}
  Dosage: {{{dosage}}}
  Manufacturer: {{{manufacturer}}}
  Storage Conditions: {{{storageConditions}}}
  Manufacturing Date: {{{manufacturingDate}}}
  Additional Notes: {{{additionalNotes}}}

  Respond with the predicted expiration date, confidence level, and reasoning.
  `,
});

const predictExpirationDateFlow = ai.defineFlow(
  {
    name: 'predictExpirationDateFlow',
    inputSchema: PredictExpirationDateInputSchema,
    outputSchema: PredictExpirationDateOutputSchema,
  },
  async input => {
    const {output} = await predictExpirationDatePrompt(input);
    return output!;
  }
);
