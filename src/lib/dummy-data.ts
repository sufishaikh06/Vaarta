
export const dummyStudentData = {
  "STU12345": {
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    department: "Computer Science",
    attendance: [
      { subject: "Data Structures", total: 40, attended: 35 },
      { subject: "Algorithms", total: 40, attended: 38 },
      { subject: "Database Systems", total: 45, attended: 40 },
      { subject: "Operating Systems", total: 38, attended: 32 },
    ],
    marks: [
      { exam: "Mid-Term", subject: "Data Structures", score: 85 },
      { exam: "Mid-Term", subject: "Algorithms", score: 91 },
      { exam: "Final-Term", subject: "Data Structures", score: 88 },
      { exam: "Final-Term", subject: "Algorithms", score: 94 },
    ],
  },
};

export const dummyTimetable = [
    { day: "Monday", time: "10:00 - 11:00", subject: "Data Structures", teacher: "Dr. Priya Mehta", room: "A-101" },
    { day: "Tuesday", time: "11:00 - 12:00", subject: "Algorithms", teacher: "Dr. Anil Kumar", room: "A-102" },
    { day: "Wednesday", time: "09:00 - 10:00", subject: "Database Systems", teacher: "Prof. Sunita Rao", room: "B-201" },
    { day: "Thursday", time: "02:00 - 03:00", subject: "Operating Systems", teacher: "Dr. Rajesh Singh", room: "A-101" },
    { day: "Friday", time: "10:00 - 11:00", subject: "Data Structures Lab", teacher: "Dr. Priya Mehta", room: "Lab-3" },
];

export const dummyNotes = [
    { id: 1, subject: "Data Structures", title: "Lecture 1: Intro to Stacks", url: "#" },
    { id: 2, subject: "Data Structures", title: "Lecture 2: Queues and Linked Lists", url: "#" },
    { id: 3, subject: "Algorithms", title: "Asymptotic Notation", url: "#" },
    { id: 4, subject: "Database Systems", title: "SQL Basics", url: "#" },
];
