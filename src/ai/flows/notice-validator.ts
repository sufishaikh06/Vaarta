
'use server';

/**
 * @fileOverview A flow for validating faculty notices using AI to ensure clarity and appropriateness.
 *
 * - validateNotice - A function that validates the faculty notice.
 * - ValidateNoticeInput - The input type for the validateNotice function.
 * - ValidateNoticeOutput - The return type for the validateNotice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateNoticeInputSchema = z.object({
  noticeText: z
    .string()
    .describe('The text content of the faculty notice to be validated.'),
});

export type ValidateNoticeInput = z.infer<
  typeof ValidateNoticeInputSchema
>;

const ValidateNoticeOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'A boolean indicating whether the notice is valid (clear, appropriate, and professional).'
    ),
  reason: z
    .string()
    .optional()
    .describe(
      'If the notice is not valid, explain why. Provide constructive feedback for improvement.'
    ),
   suggestedRevision: z
    .string()
    .optional()
    .describe(
      'If the notice has minor issues, provide a suggested revision.'
    ),
});

export type ValidateNoticeOutput = z.infer<
  typeof ValidateNoticeOutputSchema
>;

export async function validateNotice(
  input: ValidateNoticeInput
): Promise<ValidateNoticeOutput> {
  return validateNoticeFlow(input);
}

const validateNoticePrompt = ai.definePrompt({
  name: 'validateNoticePrompt',
  input: {schema: ValidateNoticeInputSchema},
  output: {schema: ValidateNoticeOutputSchema},
  prompt: `You are an AI assistant for a college ERP, tasked with validating faculty notices.
  Your goal is to ensure notices are professional, clear, and appropriate for students.

  Evaluate the following notice text:
  "{{noticeText}}"

  Criteria:
  - Clarity: Is the message easy to understand?
  - Professionalism: Is the tone appropriate? Free of slang or overly casual language?
  - Completeness: Does it contain all necessary information (e.g., dates, times, locations)?

  If the notice is perfect, set isValid to true.
  If it's mostly good but could be improved, set isValid to true and provide a 'suggestedRevision'.
  If the notice is unclear, unprofessional, or inappropriate, set isValid to false and provide a 'reason'.
  `,
});

const validateNoticeFlow = ai.defineFlow(
  {
    name: 'validateNoticeFlow',
    inputSchema: ValidateNoticeInputSchema,
    outputSchema: ValidateNoticeOutputSchema,
  },
  async input => {
    const {output} = await validateNoticePrompt(input);
    return output!;
  }
);
