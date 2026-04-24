import { QuestionData } from '../types';

export const INTERVIEW_QUESTIONS: QuestionData[] = [
  {
    id: 1,
    question: "What is an IT Help Desk, and why is it important?",
    modelAnswer: "An IT Help Desk is the frontline support team that helps users resolve technology issues such as login problems, software errors, device issues, and basic network connectivity. The Help Desk is important because it restores productivity quickly, protects systems by following proper access procedures, and prevents small issues from becoming larger outages."
  },
  {
    id: 2,
    question: "A user says their computer will not turn on. What do you do first?",
    modelAnswer: "I start with basic troubleshooting: confirm the power source, check the power cable and outlet, verify the battery and charger, and look for indicator lights or error beeps. Then I ask what changed recently (drops, liquid, updates) and decide whether it’s a power issue, hardware issue, or display issue."
  },
  {
    id: 3,
    question: "What is the difference between hardware and software?",
    modelAnswer: "Hardware is the physical equipment (laptop, RAM, hard drive, monitor, printer). Software is the operating system and applications (Windows, browsers, Microsoft Office). Many issues can look similar, so identifying whether the root cause is hardware or software helps choose the correct fix."
  },
  {
    id: 4,
    question: "What operating systems have you worked with?",
    modelAnswer: "I am strongest in Windows, including basic settings, user profiles, updates, and common troubleshooting. I also have familiarity with macOS and Linux fundamentals, and I’m comfortable learning new environments quickly using documentation and company procedures."
  },
  {
    id: 5,
    question: "What does rebooting a computer do, and why does it help?",
    modelAnswer: "Rebooting restarts the operating system, clears temporary memory, reloads services, and ends stuck processes. It often helps because many issues are caused by temporary glitches, memory leaks, or updates that need a restart to complete."
  },
  {
    id: 6,
    question: "What is Active Directory, and how is it used in Help Desk work?",
    modelAnswer: "Active Directory (AD) is a Microsoft service used to manage user accounts, computers, groups, and permissions in an organization. In Help Desk work, AD is commonly used for password resets, account unlocks, group membership checks, and verifying access to resources."
  },
  {
    id: 7,
    question: "A user forgot their password. Walk me through what you do.",
    modelAnswer: "I follow company policy: verify the user’s identity, confirm the correct account, reset or assist with password recovery, require a secure temporary password if needed, and confirm the user can log in. I also document the ticket and remind the user of password guidelines and MFA steps if applicable."
  },
  {
    id: 8,
    question: "What is a ticketing system, and why do organizations use it?",
    modelAnswer: "What is a ticketing system, and why do organizations use it? Model Answer: A ticketing system records support requests, tracks priority and status, documents troubleshooting steps, and creates accountability. Organizations use it to manage workload, meet service-level expectations, and generate reports for recurring issues and improvement planning."
  },
  {
    id: 9,
    question: "What is the difference between LAN and WAN?",
    modelAnswer: "A LAN (Local Area Network) connects devices in a limited area, such as an office or building. A WAN (Wide Area Network) connects networks across longer distances, such as between office locations, data centers, or cloud environments."
  },
  {
    id: 10,
    question: "How do you troubleshoot a slow computer?",
    modelAnswer: "I confirm the symptoms (when it’s slow, which apps), then check CPU/memory usage, disk space, startup programs, malware alerts, and pending updates. I also verify if the issue is local or network-related and document findings before applying fixes."
  },
  {
    id: 11,
    question: "How do you handle a frustrated user?",
    modelAnswer: "I stay calm, listen without interrupting, acknowledge their frustration, and reassure them I will help. I clarify the issue with a few questions, explain the plan in plain language, and provide realistic time expectations and next steps."
  },
  {
    id: 12,
    question: "What does good customer service mean in IT support?",
    modelAnswer: "Good customer service in IT means solving the technical issue while treating the user with respect, communicating clearly, and ensuring they understand what to do next. It also means documenting properly and preventing repeat issues when possible."
  },
  {
    id: 13,
    question: "What do you do if you do not know the answer?",
    modelAnswer: "I’m honest, and I take ownership of finding the solution. I research using trusted resources, internal knowledge base articles, and team guidance. If escalation is required, I provide complete notes so Tier 2 can continue efficiently, and I keep the user updated."
  },
  {
    id: 14,
    question: "How do you prioritize multiple tickets?",
    modelAnswer: "I prioritize by business impact and urgency. Outages affecting many users come first, then issues blocking critical work, then routine requests. I also consider service-level agreements and communicate with users when timelines change."
  },
  {
    id: 15,
    question: "How do you explain technical issues to non-technical users?",
    modelAnswer: "I avoid jargon and use simple language, short steps, and confirmation questions. I explain what I’m doing and why, then confirm the user understands the next step. If needed, I use analogies to make the concept easier."
  },
  {
    id: 16,
    question: "Why do you want to work in IT?",
    modelAnswer: "I enjoy solving problems and helping people. I like that IT support combines technical skills with communication, and I’m motivated to build a long-term career by continuously learning and earning certifications."
  },
  {
    id: 17,
    question: "What does punctuality mean to you in a support role?",
    modelAnswer: "Punctuality means being on time, prepared, and ready to serve users. In IT support, delays can directly impact productivity and deadlines, so reliability is part of professional service."
  },
  {
    id: 18,
    question: "How do you handle feedback from a supervisor?",
    modelAnswer: "I listen carefully, ask clarifying questions, and apply the feedback immediately. I treat feedback as a tool to improve performance, communication, and technical skills, and I follow up to confirm I’m meeting expectations."
  },
  {
    id: 19,
    question: "Describe a time you helped someone solve a problem.",
    modelAnswer: "I helped someone by listening to the issue, asking a few questions, and working step-by-step toward a solution. I stayed patient, confirmed the fix worked, and explained how to prevent the problem in the future."
  },
  {
    id: 20,
    question: "How do you manage stress in a busy Help Desk environment?",
    modelAnswer: "I manage stress by prioritizing tasks, staying organized, and focusing on one ticket at a time. I communicate early if timelines change and ask for support when an issue needs escalation or teamwork."
  },
  {
    id: 21,
    question: "Why is cybersecurity important for Help Desk roles?",
    modelAnswer: "Help Desk staff handle credentials, access requests, and sensitive information. Security is important because a single mistake—like resetting a password without verification—can lead to unauthorized access or a data breach."
  },
  {
    id: 22,
    question: "What is phishing, and what would you do if a user reports it?",
    modelAnswer: "Phishing is a fraudulent message designed to trick users into clicking malicious links or sharing information. If a user reports phishing, I instruct them not to click anything, collect details (sender, subject, screenshot), and follow the organization’s security reporting process."
  },
  {
    id: 23,
    question: "Should passwords be shared? Why or why not?",
    modelAnswer: "No. Passwords should never be shared because it breaks accountability and increases security risk. Each user must authenticate with their own credentials so activity can be tracked and access can be controlled properly."
  },
  {
    id: 24,
    question: "What is Multi-Factor Authentication (MFA), and why is it useful?",
    modelAnswer: "MFA is a security method that requires two or more verification factors, such as a password plus a phone code or authenticator app. It’s useful because it reduces risk even if a password is stolen."
  },
  {
    id: 25,
    question: "Where do you see yourself in two years?",
    modelAnswer: "In two years, I want to be stronger technically, with hands-on experience and certifications, and ready for growth into Tier 2 support or a specialty path such as networking, cloud, or cybersecurity. My focus is to be dependable, learn quickly, and deliver strong results."
  },
  {
    id: 26,
    question: "What certifications are you interested in, and why?",
    modelAnswer: "I’m interested in CompTIA A+ for foundational support skills, Network+ to strengthen networking troubleshooting, and Security+ to build security awareness. These certifications show commitment and help me perform better on the job."
  },
  {
    id: 27,
    question: "How do you keep learning in IT?",
    modelAnswer: "I keep learning by practicing hands-on labs, reviewing documentation, asking questions, and using reliable resources to research issues. I also learn from tickets—what worked, what didn’t, and how to document solutions for the future."
  },
  {
    id: 28,
    question: "What does teamwork mean to you in an IT environment?",
    modelAnswer: "Teamwork means sharing information, communication clearly, and supporting each other to resolve issues faster. In IT, problems often cross boundaries, so collaboration ensures users get the best outcome."
  },
  {
    id: 29,
    question: "Why should we hire you?",
    modelAnswer: "You should hire me because I bring strong Tier 1 troubleshooting, professional communication, and a process-driven mindset. I focus on resolving common issues at first contact, which prevents unnecessary escalation to Tier 2 or Tier 3 support. By documenting clearly and using research skills, I help reduce downtime, improve user satisfaction, and save the organization money."
  },
  {
    id: 30,
    question: "Do you have any questions for us?",
    modelAnswer: "Yes. I’d like to understand your support environment and success expectations. For example: What ticketing system do you use? What does a successful first 90 days look like? What training or mentoring is available for new Help Desk staff?"
  }
];

export const SYSTEM_INSTRUCTION = `
You are an IT Help Desk Interview Coach for ASM Educational Center. 
Your goal is to run a voice-based mock interview for a Tier 1 IT Help Desk candidate.

### CORE OBJECTIVE:
- Run a structured, educational, and professional mock interview.
- Balance detailed feedback with the need for a fast-paced voice conversation.

INTERVIEW QUESTIONS & GOLD STANDARDS:
${INTERVIEW_QUESTIONS.map(q => `${q.id}. ${q.question}\n   Gold Standard: ${q.modelAnswer}`).join('\n')}

RULES & FLOW:
1. START: Greet the student and ask for their name.
2. FLOW: Ask exactly 30 interview questions, one at a time. Always wait for the student's spoken answer.
3. EVALUATION: After each answer, evaluate it as: Correct, Partially Correct, or Incorrect.
4. FEEDBACK (CORRECT): Briefly reinforce what they did well using employer language (business impact, customer service, process, security).
5. FEEDBACK (PARTIALLY CORRECT/INCORRECT): 
   - Say: “Good attempt—here is the best interview-ready answer,” then provide the Gold Standard Answer from the list above. 
   - Then, give 2–3 short coaching notes (what employers listen for) and one real-world practical example.
6. TRANSITION: After feedback, ALWAYS ask: “Do you want a quick clarification or example before we move on?”
7. CLARIFICATION:
   - If user says “Yes”: Provide a short clarification (15–30 seconds) and optionally ask one follow-up micro-question to confirm understanding.
   - If user says “No”: Move to the next question.

TONE & STYLE:
- Professional, clear, and Tier 1 appropriate (avoid over-technical detail).
- Be concise for voice; avoid long "thinking" pauses or unnecessary filler.
- Use these key phrases when relevant: frontline support, reduce downtime, restore productivity, first point of contact, document findings, follow policy, verify identity, least privilege, escalation notes, SLA, triage, plain language, ownership, communication.

END OF SESSION:
- After Question 30: Give a final score out of 30.
- Summarize top strengths.
- List top 3 improvement areas.
- Provide a 7-day practice plan.

### LATENCY NOTE:
- Keep your speech flowing naturally but avoid long preambles.
- Focus on the feedback and the next question immediately.
`.trim();
