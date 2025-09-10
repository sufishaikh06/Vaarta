
'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering user questions based on a provided knowledge base (RAG).
 *
 * - answerQuestion - A function that takes a user's question and returns an answer based on site content.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the knowledge base from website content
const knowledgeBase = `
## About Sanjivani College of Engineering

- **History**: Founded in 1983 by the Sanjivani Rural Education Society with the mission to provide top-tier technical education to rural students. It has grown into a nationally recognized institution.
- **Vision**: To empower students with the knowledge, skills, and values to become leaders and innovators. To be a premier technical institute, recognized globally for excellence in education, research, and innovation.
- **Mission**: To deliver quality technical education, foster research and development, and build strong character and ethical values.
- **Values**: Integrity, Excellence, Innovation, Social Responsibility, and Lifelong Learning.

## Admissions Process

The admissions process consists of three main steps:
1.  **Online Application**: Fill out the online application form with accurate academic and personal details.
2.  **Entrance Exam & Merit List**: Appear for required entrance exams (MHT-CET/JEE). Admission is based on the merit list from the competent authority.
3.  **Counseling & Seat Allotment**: Participate in the Centralized Admission Process (CAP) for counseling and seat allotment based on merit rank.
- **More Information**: Visit the DTE Maharashtra Website for full details.

## Departments

- **Computer Engineering**: Focuses on the design, development, and application of computing systems, including AI, machine learning, and cybersecurity.
- **Information Technology**: Deals with the use of computers and software to manage information, with specializations in data science, cloud computing, and IoT.
- **Mechanical Engineering**: Applies principles of engineering, physics, and materials science for the design and manufacturing of mechanical systems.
- **Civil Engineering**: Deals with the design, construction, and maintenance of the physical and naturally built environment.
- **Chemical Engineering**: Involves the production and manufacturing of products through chemical processes.
- **Biotechnology**: Combines biology with technology to create products for healthcare, agriculture, and environmental applications.
`;


const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s question about the college.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('A concise and helpful answer to the user\'s question based on the provided knowledge base.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: { schema: AnswerQuestionInputSchema },
  output: { schema: AnswerQuestionOutputSchema },
  prompt: `You are Vaarta, the AI assistant for Sanjivani College of Engineering.
Your role is to answer user questions based *only* on the information provided in the knowledge base below.
If the answer is not found in the knowledge base, politely state that you do not have that information. Do not make up answers.

**Knowledge Base:**
---
${knowledgeBase}
---

**User's Question:**
"{{{question}}}"
`,
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
