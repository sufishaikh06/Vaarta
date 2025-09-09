# **App Name**: VaartaBot

## Core Features:

- Multilingual Chat Interface: Provides a chat interface supporting English, Hindi and 3 regional languages via simulated translation. It has automatic language detection and language switch options. Offers voice input/output support.
- FAQ Access: Accesses frequently asked questions related to fees, admissions, scholarships and provides appropriate answers to user questions. Accesses Firebase to lookup documents.
- Timetable and Notices: Displays timetable updates for regular classes and exams, and showcases event and notice board postings made by faculty.
- Student Application Submission: Allows students to submit applications and leave requests via the chatbot, stores the information, and sends formatted emails to faculty using Gmail API and Firebase Cloud Functions.
- Faculty Notice Posting: Enables faculty to post official notices which, after validation by an LLM tool, are stored in Firebase and broadcasted in the chatbot feed.
- Parent Read-Only Mode: Gives parents read-only access to timetable, events, and notices.
- Contextual FAQ Suggester: AI Tool suggest FAQs based on chat input.

## Style Guidelines:

- Primary color: Light Blue (#ADD8E6) to represent calmness and clarity, which is often associated with institutional communications.
- Background color: Very light blue (#F0F8FF), providing a clean and unobtrusive backdrop that highlights the chatbot's content.
- Accent color: Soft Lavender (#E6E6FA), positioned on the color wheel approximately 30 degrees from the light blue, used for interactive elements to catch the user's eye.
- Body and headline font: 'PT Sans', a humanist sans-serif providing a balance of modern look and warmth.
- Use clean, simple icons from a set like Feather or Material Icons to maintain a minimalist aesthetic and ensure clarity.  Consider the multiple languages in your icon choices.
- Implement a card-based layout for chatbot messages and a floating action button (FAB) for language switching, aligning with the 'clean and modern design' specified.
- Use subtle fade, slide-in, and expand transitions via Framer Motion to create a smooth and engaging user experience without overwhelming the user.