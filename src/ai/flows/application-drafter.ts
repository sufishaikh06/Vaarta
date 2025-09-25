
'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting a formal application from a student's informal request.
 *
 * - draftApplication - A function that takes a user's raw input and returns a structured application.
 * - DraftApplicationInput - The input type for the draftApplication function.
 * - DraftApplicationOutput - The return type for the draftApplication function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DraftApplicationInputSchema = z.object({
  reason: z.string().describe("The student's reason for the leave application."),
  facultyName: z.string().describe("The name of the faculty member to address the application to."),
  studentName: z.string().describe("The name of the student submitting the application."),
});
export type DraftApplicationInput = z.infer<typeof DraftApplicationInputSchema>;

const DraftApplicationOutputSchema = z.object({
  body: z.string().describe('The formatted body of the application, addressing the appropriate faculty member.'),
});
export type DraftApplicationOutput = z.infer<typeof DraftApplicationOutputSchema>;

export async function draftApplication(input: DraftApplicationInput): Promise<DraftApplicationOutput> {
  return draftApplicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftApplicationPrompt',
  input: { schema: DraftApplicationInputSchema },
  output: { schema: DraftApplicationOutputSchema },
  prompt: `You are an expert assistant for a college ERP system named Vaarta.
A student wants to send a leave application. Your task is to convert their informal request into a formal email body.

The student's name is {{{studentName}}}.
The faculty member's name is {{{facultyName}}}.

Analyze the student's reason for leave and generate a polite, well-formatted email body. The body should be professional and concise.

Student's Reason for Leave: {{{reason}}}
`,
});

const draftApplicationFlow = ai.defineFlow(
  {
    name: 'draftApplicationFlow',
    inputSchema: DraftApplicationInputSchema,
    outputSchema: DraftApplicationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
