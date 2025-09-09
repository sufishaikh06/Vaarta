'use server';

/**
 * @fileOverview A flow for validating faculty notices using AI to ensure clarity and appropriateness.
 *
 * - validateFacultyNotice - A function that validates the faculty notice.
 * - ValidateFacultyNoticeInput - The input type for the validateFacultyNotice function.
 * - ValidateFacultyNoticeOutput - The return type for the validateFacultyNotice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateFacultyNoticeInputSchema = z.object({
  noticeText: z
    .string()
    .describe('The text content of the faculty notice to be validated.'),
});

export type ValidateFacultyNoticeInput = z.infer<
  typeof ValidateFacultyNoticeInputSchema
>;

const ValidateFacultyNoticeOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'A boolean indicating whether the notice is valid (clear and appropriate).' + 
      'If the notice is not valid, then explain why in the reason field.'
    ),
  reason: z
    .string()
    .optional()
    .describe(
      'The reason why the notice is not valid.  This field is only populated if isValid is false.'
    ),
});

export type ValidateFacultyNoticeOutput = z.infer<
  typeof ValidateFacultyNoticeOutputSchema
>;

export async function validateFacultyNotice(
  input: ValidateFacultyNoticeInput
): Promise<ValidateFacultyNoticeOutput> {
  return validateFacultyNoticeFlow(input);
}

const validateFacultyNoticePrompt = ai.definePrompt({
  name: 'validateFacultyNoticePrompt',
  input: {schema: ValidateFacultyNoticeInputSchema},
  output: {schema: ValidateFacultyNoticeOutputSchema},
  prompt: `You are an AI assistant tasked with validating faculty notices before they are broadcast to students.

  Your goal is to ensure that the notices are clear, appropriate, and free of any potentially misleading or offensive content.

  Evaluate the following notice text:
  {{noticeText}}

  Determine if the notice is valid based on the following criteria:
  - Is the notice clear and easy to understand?
  - Is the notice free of any offensive language or inappropriate content?
  - Is the notice factually accurate and not misleading?

  If the notice is valid, set isValid to true.
  If the notice is not valid, set isValid to false and provide a reason in the reason field.
  `,
});

const validateFacultyNoticeFlow = ai.defineFlow(
  {
    name: 'validateFacultyNoticeFlow',
    inputSchema: ValidateFacultyNoticeInputSchema,
    outputSchema: ValidateFacultyNoticeOutputSchema,
  },
  async input => {
    const {output} = await validateFacultyNoticePrompt(input);
    return output!;
  }
);
