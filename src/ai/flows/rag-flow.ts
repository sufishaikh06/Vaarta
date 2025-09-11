
'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering user questions based on a provided knowledge base (RAG).
 *
 * - answerQuestion - A function that takes a user's question and returns an answer based on site content.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import { ai } from '@/ai/genkit';
import { getAttendanceForStudent, getFacultyInfoForUser } from '@/lib/firebase-services';
import { z } from 'genkit';

// Define the knowledge base from website content
const knowledgeBase = `
## About Sanjivani College of Engineering

- **History**: Founded in 1983 by the Sanjivani Rural Education Society with the mission to provide top-tier technical education to rural students. It has grown into a nationally recognized institution.
- **Vision**: To empower students with the knowledge, skills, and values to become leaders and innovators. To be a premier technical institute, recognized globally for excellence in education, research, and innovation.
- **Mission**: To deliver quality technical education, foster research and development, and build strong character and ethical values.
- **Values**: Integrity, Excellence, Innovation, Social Responsibility, and Lifelong Learning.
- **Contact Information**:
  - Address: Sanjivani College of Engineering, Kopargaon, Tal. Kopargaon, Dist. Ahmednagar, Maharashtra, India. Pincode-423603
  - Phone: +91-2423-222862
  - Email: principal@sanjivani.org.in

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

## Placements

- **Placement Cell**: Dedicated Training & Placements department with a consistent record of over 90% placement for eligible students.
- **Statistics**: Over 350 companies visit, with 1200+ offers made in the 2023-24 season. The highest package offered was 24 LPA.
- **Recruiters**: Top recruiters include TCS, Infosys, Wipro, Cognizant, Capgemini, Accenture, Tech Mahindra, and HCL.
- **Training**: The college provides dedicated pre-placement training covering aptitude, technical skills, and soft skills.
`;

const getAttendanceStatusTool = ai.defineTool(
  {
    name: 'getAttendanceStatus',
    description: "Get the current attendance status for the logged-in student. This tool returns a summary of the student's attendance records.",
    inputSchema: z.object({ studentId: z.string().describe("The ID of the student.") }),
    outputSchema: z.string().describe("A summary of the student's attendance, including subjects, status, and dates."),
  },
  async (input) => {
    const attendanceRecords = await getAttendanceForStudent(input.studentId);
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return "I couldn't find any attendance records for you. Please check if you have any classes logged.";
    }

    const summary = attendanceRecords
      .map(r => `- On ${new Date(r.date).toLocaleDateString()}, you were marked **${r.status}** for **${r.subject}**.`)
      .join('\n');

    return `Here is a summary of your recent attendance:\n${summary}`;
  }
);

const getFacultyInfoTool = ai.defineTool(
  {
    name: 'getFacultyInfo',
    description: "Get information for the logged-in faculty member, such as subjects they teach.",
    inputSchema: z.object({ facultyId: z.string().describe("The ID of the faculty member.") }),
    outputSchema: z.string().describe("A summary of the faculty member's information."),
  },
  async (input) => {
    return await getFacultyInfoForUser(input.facultyId);
  }
);


const AnswerQuestionInputSchema = z.object({
  question: z.string().describe("The user's question about the college."),
  userId: z.string().optional().describe("The ID of the logged-in user, if applicable."),
  userRole: z.string().optional().describe("The role of the logged-in user (student, faculty, parent).")
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('A concise and helpful answer to the user\'s question based on the provided knowledge base and tools.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: { schema: AnswerQuestionInputSchema },
  output: { schema: AnswerQuestionOutputSchema },
  tools: [getAttendanceStatusTool, getFacultyInfoTool],
  prompt: `You are Vaarta, the AI assistant for Sanjivani College of Engineering.
Your role is to answer user questions accurately and concisely.

**Instructions:**
1.  First, determine the user's intent. Are they asking a general question or asking for personal information?
2.  For general questions about the college (e.g., "what is the admission process?", "tell me about placements"), you MUST answer based *only* on the information provided in the **Knowledge Base** below.
3.  If the answer is not found in the Knowledge Base, you MUST state that you do not have that information. DO NOT invent answers or use external knowledge.
4.  For questions about personal data (e.g., "what is my attendance?", "what subjects do I teach?"), you MUST use the provided tools.
    - If the user role is 'student' and they ask about attendance, use the \`getAttendanceStatus\` tool with the provided \`userId\` as the 'studentId' parameter.
    - If the user role is 'faculty' and they ask about their info, use the \`getFacultyInfo\` tool with the provided \`userId\` as the 'facultyId' parameter.
5.  If the user asks for personal data but is not logged in (i.e., no \`userId\` is provided), you MUST tell them they need to log in to access that information.
6.  Be polite, professional, and helpful in all your responses.

**Knowledge Base:**
---
${knowledgeBase}
---

**User Context:**
- User ID: {{{userId}}}
- User Role: {{{userRole}}}

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
    // This mapping allows the prompt to use a generic 'userId' from the frontend,
    // and we can pass the correct parameter name to the tool.
    const toolInput = { ...input, studentId: input.userId, facultyId: input.userId };
    const { output } = await prompt(toolInput);
    return output!;
  }
);
