'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant FAQs based on the user's current conversation.
 *
 * - `suggestFAQs` - A function that takes the user's message as input and returns a list of suggested FAQs.
 * - `SuggestFAQsInput` - The input type for the `suggestFAQs` function.
 * - `SuggestFAQsOutput` - The return type for the `suggestFAQs` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFAQsInputSchema = z.object({
  userMessage: z.string().describe('The user message to analyze for FAQ suggestions.'),
});
export type SuggestFAQsInput = z.infer<typeof SuggestFAQsInputSchema>;

const SuggestFAQsOutputSchema = z.object({
  suggestedFAQs: z.array(
    z.string().describe('A list of suggested FAQs relevant to the user message.')
  ).describe('Suggested FAQs based on the user message.'),
});
export type SuggestFAQsOutput = z.infer<typeof SuggestFAQsOutputSchema>;

export async function suggestFAQs(input: SuggestFAQsInput): Promise<SuggestFAQsOutput> {
  return suggestFAQsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFAQsPrompt',
  input: {schema: SuggestFAQsInputSchema},
  output: {schema: SuggestFAQsOutputSchema},
  prompt: `You are a chatbot assistant helping students find answers to their questions.
  Based on the student's current message, suggest a list of relevant FAQs that might help them.
  Return the FAQs as a JSON array of strings.

  User Message: {{{userMessage}}}
  Suggested FAQs:`,
});

const suggestFAQsFlow = ai.defineFlow(
  {
    name: 'suggestFAQsFlow',
    inputSchema: SuggestFAQsInputSchema,
    outputSchema: SuggestFAQsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
