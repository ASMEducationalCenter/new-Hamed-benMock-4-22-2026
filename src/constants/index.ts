import { QuestionData } from '../types';

export const INTERVIEW_QUESTIONS: QuestionData[] = [
  {
    id: 1,
    question: "What is cybersecurity and why is it important?",
    modelAnswer:
      `Cybersecurity is the practice of protecting computers, networks, applications, and data from unauthorized access, cyberattacks, damage, or theft. It includes technologies, processes, and policies designed to safeguard digital systems. Cybersecurity is important because organizations rely heavily on technology to store sensitive information, conduct business operations, and communicate. Without strong security measures, attackers could steal data, disrupt services, or damage infrastructure. Strong cybersecurity protects confidential information, maintains system reliability, and helps organizations comply with laws and regulations.`,
    realWorldExamples: [
      "A hospital uses cybersecurity tools to protect patient medical records from unauthorized access.",
      "A financial institution secures its online banking system to prevent hackers from stealing customer funds.",
      "An e-commerce company protects customer payment information using security monitoring tools and encrypted databases to prevent data breaches."
    ]
  },
  {
    id: 2,
    question: "What are the three principles of the CIA Triad?",
    modelAnswer:
      `The CIA Triad represents three core principles of information security: Confidentiality, Integrity, and Availability. Confidentiality ensures that sensitive data is only accessible to authorized users. This is achieved through encryption, authentication, and access controls. Integrity ensures that data remains accurate and unaltered. Security tools such as hashing and digital signatures help verify that information has not been tampered with. Availability ensures that systems and data are accessible when needed. Organizations maintain backups, redundant systems, and protection against outages or attacks.`,
    realWorldExamples: [
      "An online banking system uses encryption and authentication to protect customer account information.",
      "A company uses backup servers so employees can continue working even if one system fails.",
      "A cloud storage provider ensures files remain accessible (availability), unaltered (integrity), and only visible to the owner (confidentiality)."
    ]
  },
  {
    id: 3,
    question: "What is the difference between authentication and authorization?",
    modelAnswer:
      `Authentication verifies a user’s identity. It confirms that someone is who they claim to be. Common authentication methods include passwords, smart cards, biometric scans, and multi-factor authentication. Authorization determines what an authenticated user is allowed to do. It controls which resources the user can access and what actions they can perform. Authentication happens first, followed by authorization.`,
    realWorldExamples: [
      "An employee logs into a company system using a password. This verifies their identity.",
      "Once logged in, the system allows the employee to view certain files but not modify administrative settings.",
      "A student logs into a university portal (authentication), but only professors can edit grades (authorization)."
    ]
  },
  {
    id: 4,
    question: "What is a firewall and what does it do?",
    modelAnswer:
      `A firewall is a security system that monitors and controls network traffic based on predefined security rules. It acts as a barrier between trusted internal networks and untrusted external networks like the internet. Firewalls inspect packets of data and decide whether to allow or block traffic. They help prevent unauthorized access, malware infections, and certain types of attacks. Modern firewalls may also inspect applications and detect suspicious behavior.`,
    realWorldExamples: [
      "A company firewall blocks traffic from suspicious IP addresses attempting to access internal servers.",
      "A school firewall restricts access to harmful websites to protect students and maintain network security.",
      "A corporate firewall blocks incoming traffic from countries known for high cyberattack activity."
    ]
  },
  {
    id: 5,
    question: "What is phishing?",
    modelAnswer:
      `Phishing is a cyberattack in which attackers send fraudulent messages designed to trick users into revealing sensitive information or clicking malicious links. These messages often appear to come from legitimate organizations such as banks or IT departments. They may create urgency or fear to pressure users into responding quickly. Phishing attacks are one of the most common cybersecurity threats and rely heavily on human manipulation.`,
    realWorldExamples: [
      "An employee receives an email pretending to be from IT asking them to reset their password through a fake link.",
      "A user receives a message claiming their bank account is locked and must click a link to verify their information.",
      "A fake email claims to be from a delivery service asking the user to click a link to track a package, but the link leads to a malicious website."
    ]
  },
  {
    id: 6,
    question: "What is malware?",
    modelAnswer:
      `Malware is malicious software designed to harm, disrupt, or gain unauthorized access to systems. Malware can infect computers, steal data, monitor activity, or damage files. Common types include viruses, worms, ransomware, spyware, and trojans. Malware often spreads through malicious downloads, email attachments, or compromised websites.`,
    realWorldExamples: [
      "A user downloads a free program that secretly installs spyware on their computer.",
      "An infected USB drive spreads malware across a company network.",
      "A malicious browser extension secretly records keystrokes and sends login credentials to attackers."
    ]
  },
  {
    id: 7,
    question: "What is ransomware?",
    modelAnswer:
      `Ransomware is a type of malware that encrypts a victim’s files or locks their system and demands payment to restore access. Attackers typically demand payment in cryptocurrency to make transactions harder to trace. Organizations defend against ransomware with backups, endpoint protection, and security training.`,
    realWorldExamples: [
      "A hospital’s computers are locked by ransomware, preventing doctors from accessing patient records.",
      "A company receives a ransom message demanding payment to decrypt its critical business files.",
      "A city government network is infected with ransomware, forcing officials to shut down services until systems are restored from backups."
    ]
  },
  {
    id: 8,
    question: "What is Multi-Factor Authentication (MFA)?",
    modelAnswer:
      `Multi-Factor Authentication requires users to provide two or more verification factors before gaining access to a system. These factors typically include: Something you know (password), Something you have (phone or token), and Something you are (biometric data). MFA significantly improves security because even if one factor is compromised, attackers still cannot access the system.`,
    realWorldExamples: [
      "A user logs into their email account using a password and then enters a verification code sent to their phone.",
      "An employee accesses a secure building using a keycard and fingerprint scanner.",
      "A banking app requires a password and facial recognition before allowing a user to transfer money."
    ]
  },
  {
    id: 9,
    question: "What is the principle of least privilege?",
    modelAnswer:
      `The principle of least privilege means users are given only the minimum level of access required to perform their job tasks. Limiting permissions reduces the risk of accidental mistakes and prevents attackers from gaining excessive access if an account is compromised. Organizations implement least privilege using role-based access controls and permission management systems.`,
    realWorldExamples: [
      "A marketing employee can access marketing files but cannot change financial records.",
      "A temporary contractor receives limited system access that expires after their project ends.",
      "An intern is given read-only access to a project database but cannot edit or delete records."
    ]
  },
  {
    id: 10,
    question: "What is a VPN?",
    modelAnswer:
      `A Virtual Private Network creates an encrypted tunnel between a user’s device and a remote network. This protects data from interception and allows secure access to internal systems over the internet. VPNs are commonly used by remote employees to connect to company networks.`,
    realWorldExamples: [
      "An employee working from home connects to their company network through a VPN.",
      "A traveler uses a VPN to secure their internet connection while using public Wi-Fi at an airport.",
      "A consultant traveling abroad uses a VPN to securely access their company’s internal documents."
    ]
  },
  {
    id: 11,
    question: "What is encryption?",
    modelAnswer:
      `Encryption converts readable data into an unreadable format called ciphertext using algorithms and encryption keys. Only someone with the correct key can decrypt and read the information. Encryption protects data both in storage and during transmission.`,
    realWorldExamples: [
      "Online banking websites encrypt data to protect financial transactions.",
      "Companies encrypt employee laptops so data cannot be accessed if the device is stolen.",
      "Messaging apps encrypt conversations so only the sender and recipient can read the messages."
    ]
  },
  {
    id: 12,
    question: "What is hashing?",
    modelAnswer:
      `Hashing converts data into a fixed-length value using a mathematical algorithm. Unlike encryption, hashing cannot easily be reversed. It is commonly used to store passwords securely. If someone enters a password, the system hashes it and compares it with the stored hash.`,
    realWorldExamples: [
      "Websites store hashed passwords so attackers cannot easily recover the original passwords if the database is breached.",
      "File integrity monitoring systems use hashes to detect if a file has been modified.",
      "A company verifies downloaded software using a file hash to ensure it has not been tampered with."
    ]
  },
  {
    id: 13,
    question: "What is the difference between symmetric and asymmetric encryption?",
    modelAnswer:
      `Symmetric encryption uses a single shared key for both encryption and decryption. Asymmetric encryption uses two keys: a public key and a private key. Symmetric encryption is faster, while asymmetric encryption is more secure for key exchange.`,
    realWorldExamples: [
      "Secure websites use asymmetric encryption to establish secure connections between browsers and servers.",
      "File encryption software may use symmetric encryption to efficiently protect stored data.",
      "Email encryption systems use asymmetric keys to securely send messages between users."
    ]
  },
  {
    id: 14,
    question: "What is a security vulnerability?",
    modelAnswer:
      `A vulnerability is a weakness in software, hardware, or processes that attackers can exploit to gain unauthorized access. Vulnerabilities can occur due to coding errors, misconfigurations, or outdated software. Security teams regularly scan systems to identify and fix vulnerabilities.`,
    realWorldExamples: [
      "An outdated web server contains a known vulnerability that allows attackers to execute malicious code.",
      "A misconfigured cloud storage bucket exposes sensitive files to the public internet.",
      "A mobile app stores passwords in plain text, creating a vulnerability that attackers could exploit."
    ]
  },
  {
    id: 15,
    question: "What is a penetration test?",
    modelAnswer:
      `A penetration test is a simulated cyberattack performed by security professionals to identify vulnerabilities before attackers exploit them. Penetration testers attempt to break into systems using the same techniques as hackers. The goal is to discover weaknesses and improve security defenses.`,
    realWorldExamples: [
      "A company hires security professionals to test whether their web application can be hacked.",
      "A bank conducts penetration tests on its mobile banking app before releasing it to customers.",
      "A retailer hires ethical hackers to test the security of its online payment system before a major shopping season."
    ]
  },
  {
    id: 16,
    question: "What is a zero-day vulnerability?",
    modelAnswer:
      `A zero-day vulnerability is a security flaw that is unknown to the vendor or has no available patch. Attackers may exploit the vulnerability before developers have time to fix it. Zero-day attacks are particularly dangerous because systems are unprotected.`,
    realWorldExamples: [
      "Hackers discover a new flaw in a popular browser and use it to install malware before a patch is released.",
      "A zero-day vulnerability in a messaging application allows attackers to remotely control devices.",
      "Attackers exploit a newly discovered vulnerability in a widely used operating system before developers release a security update."
    ]
  },
  {
    id: 17,
    question: "What is a SIEM system?",
    modelAnswer:
      `Security Information and Event Management system collects and analyzes logs from multiple systems to detect suspicious activity. SIEM tools help security teams identify threats, investigate incidents, and monitor network activity. They combine security information management and event management capabilities.`,
    realWorldExamples: [
      "A SIEM detects multiple failed login attempts from a suspicious IP address.",
      "Security analysts use SIEM logs to investigate a potential data breach.",
      "A SIEM alerts analysts when a user account suddenly logs in from multiple countries within minutes."
    ]
  },
  {
    id: 18,
    question: "What is social engineering?",
    modelAnswer:
      `Social engineering is the manipulation of people to gain access to sensitive information or systems. Attackers exploit human trust rather than technical vulnerabilities. Common techniques include phishing, pretexting, and baiting.`,
    realWorldExamples: [
      "An attacker calls an employee pretending to be IT support and asks for their password.",
      "A USB drive labeled “confidential” is left in a parking lot, hoping someone will plug it into their computer.",
      "An attacker pretends to be a delivery worker to gain physical access to an office building."
    ]
  },
  {
    id: 19,
    question: "What is patch management?",
    modelAnswer:
      `Patch management is the process of updating software to fix security vulnerabilities and bugs. Regular patching reduces the risk of cyberattacks. Organizations often automate patch management to ensure systems remain secure.`,
    realWorldExamples: [
      "A company installs operating system updates to fix known security flaws.",
      "A web server receives patches to prevent attackers from exploiting outdated software.",
      "An organization schedules monthly updates to ensure all company laptops have the latest security patches."
    ]
  },
  {
    id: 20,
    question: "What is a brute force attack?",
    modelAnswer:
      `A brute force attack attempts to guess passwords by trying many possible combinations. Attackers use automated tools to test thousands of passwords quickly. Strong passwords and account lockout policies help prevent these attacks.`,
    realWorldExamples: [
      "A hacker attempts thousands of login attempts on a website to guess user passwords.",
      "An attacker uses software to crack weak Wi-Fi passwords.",
      "An attacker uses automated tools to try thousands of password combinations against an administrator account."
    ]
  },
  {
    id: 21,
    question: "What should you do if you suspect a security incident?",
    modelAnswer:
      `If I suspect a security incident, the first step is to follow the organization’s incident response procedures. Most organizations have a documented incident response plan that outlines how employees and security teams should respond to potential threats. The process typically includes identifying the incident, reporting it to the appropriate security team, preserving evidence, and helping contain the threat. It is important not to ignore suspicious activity because early detection can prevent larger damage. Security professionals should also document what happened, including timestamps, affected systems, and any unusual activity. Proper documentation helps investigators understand the attack and prevent similar incidents in the future. The goal during an incident is to contain the threat quickly while minimizing disruption to business operations.`,
    realWorldExamples: [
      "A security analyst notices multiple failed login attempts from a foreign IP address. They report the activity to the security operations team and temporarily block the IP address.",
      "An employee receives a suspicious email attachment that installs malware. The employee reports it immediately so the IT team can isolate the affected system and prevent the malware from spreading across the network.",
      "An employee notices unusual system behavior and reports it to IT so security analysts can investigate possible unauthorized access."
    ]
  },
  {
    id: 22,
    question: "Why is logging important in cybersecurity?",
    modelAnswer:
      `Logging is the process of recording system activities and events within a network or computer system. Logs provide valuable information about what actions occurred, when they happened, and who performed them. Security teams rely on logs to detect suspicious activity, investigate security incidents, and maintain accountability. Logs help identify unusual behavior such as repeated login failures, unauthorized access attempts, or unexpected system changes. Logging also supports compliance and auditing requirements. Many organizations must maintain logs to meet regulatory standards and demonstrate that they are monitoring their systems. Security tools such as SIEM platforms analyze logs from multiple systems to detect patterns that may indicate cyberattacks.`,
    realWorldExamples: [
      "A company’s logging system detects that an employee account attempted to access restricted files late at night, which triggers a security investigation.",
      "After a cyberattack, investigators analyze system logs to determine how the attacker entered the network and what systems were affected.",
      "A company reviews firewall logs and discovers repeated attempts to access its servers from unknown IP addresses."
    ]
  },
  {
    id: 23,
    question: "How do you stay updated with cybersecurity threats?",
    modelAnswer:
      `Cybersecurity is constantly evolving, so professionals must stay updated on the latest threats, vulnerabilities, and defense techniques. I stay informed by following trusted cybersecurity news sources, reading security advisories, and reviewing threat intelligence reports. These sources provide information about new vulnerabilities, attack techniques, and recommended security practices. Another important method is hands-on learning through labs, simulations, and cybersecurity training platforms. Practical experience helps reinforce theoretical knowledge. Additionally, many cybersecurity professionals participate in online communities, security forums, and conferences to share knowledge and learn from others in the field. Continuous learning is essential because new attack methods and vulnerabilities appear frequently.`,
    realWorldExamples: [
      "A cybersecurity analyst reads a vulnerability report about a new ransomware variant and updates security tools to detect it.",
      "A security professional practices identifying cyberattacks in a lab environment to improve incident detection skills.",
      "A security professional subscribes to vulnerability databases and cybersecurity newsletters to stay informed about emerging threats."
    ]
  },
  {
    id: 24,
    question: "How would you explain cybersecurity risks to non-technical users?",
    modelAnswer:
      `When explaining cybersecurity risks to non-technical users, it is important to use clear and simple language and avoid technical jargon. Many users are not familiar with cybersecurity terminology, so the explanation should focus on practical examples they can understand. The goal is to help users understand how their actions can impact security and how they can protect themselves and the organization. Using real-life scenarios, analogies, and demonstrations can help make cybersecurity concepts easier to understand. Security awareness training is an important part of cybersecurity because human error is one of the most common causes of security incidents.`,
    realWorldExamples: [
      "Instead of explaining complex phishing techniques, I might say: “If you receive an unexpected email asking for your password or personal information, do not click the link. Contact IT to verify the message.”",
      "When explaining password security, I might compare it to a house key. If you share your key with strangers, they could enter your home.",
      "A trainer shows employees examples of suspicious emails and explains how to recognize phishing attempts."
    ]
  },
  {
    id: 25,
    question: "What is risk management?",
    modelAnswer:
      `Risk management is the process of identifying potential threats, evaluating their likelihood and impact, and implementing controls to reduce or manage those risks. Organizations use risk management to protect critical systems, sensitive data, and business operations. By understanding potential risks, organizations can prioritize security investments and reduce vulnerabilities. The risk management process typically includes risk identification, risk analysis, risk mitigation, and ongoing monitoring. Security controls such as firewalls, encryption, and access controls are examples of measures used to reduce risk.`,
    realWorldExamples: [
      "A company identifies that storing sensitive customer data without encryption is risky and implements encryption.",
      "An organization installs backup systems to ensure business operations continue during outages.",
      "A company evaluates the risk of employees using personal devices for work and introduces a secure device policy."
    ]
  },
  {
    id: 26,
    question: "What is Data Loss Prevention (DLP)?",
    modelAnswer:
      `Data Loss Prevention refers to tools and policies designed to prevent sensitive information from being lost, leaked, or accessed by unauthorized individuals. DLP systems monitor data usage and detect when sensitive information such as credit card numbers or confidential documents are being transmitted outside the organization. Organizations use DLP solutions to protect intellectual property and comply with data protection regulations.`,
    realWorldExamples: [
      "A company’s DLP system blocks an employee from emailing a spreadsheet containing customer credit card numbers.",
      "A DLP system alerts security teams when sensitive files are uploaded to an unauthorized cloud storage service.",
      "A DLP system prevents employees from copying confidential company files onto USB drives."
    ]
  },
  {
    id: 27,
    question: "What is a security policy?",
    modelAnswer:
      `A security policy is a formal document that defines rules, guidelines, and procedures for protecting an organization’s systems, networks, and data. Security policies help establish clear expectations for employees and ensure that everyone follows consistent security practices. Policies often cover topics such as password requirements, acceptable use of company devices, and incident reporting procedures.`,
    realWorldExamples: [
      "A company’s password policy requires employees to create strong passwords.",
      "An acceptable use policy states employees cannot install unauthorized software.",
      "A company policy requires employees to lock their computers whenever they leave their desk."
    ]
  },
  {
    id: 28,
    question: "Describe a time you solved a technical problem.",
    modelAnswer:
      `I identified the issue, determined the cause, applied the correct fix, and confirmed the problem was resolved successfully.`,
    realWorldExamples: [
      "An employee could not access a shared network drive because their permissions had been removed. Restoring permissions fixed the issue.",
      "A user’s computer was extremely slow because a background program was using too much CPU.",
      "A user could not connect to Wi-Fi because of an incorrect network configuration that was later corrected."
    ]
  },
  {
    id: 29,
    question: "Why do you want to work in cybersecurity?",
    modelAnswer:
      `Cybersecurity is an exciting field that combines technology, problem-solving, and protecting organizations from real-world threats. I enjoy identifying vulnerabilities and implementing solutions that help keep systems secure. Cybersecurity also requires continuous learning because threats and technologies are constantly evolving.`,
    realWorldExamples: [
      "Security professionals help prevent criminals from stealing financial data.",
      "Cybersecurity teams protect hospitals from ransomware attacks.",
      "Cybersecurity professionals help businesses prevent data breaches that could damage reputation and finances."
    ]
  },
  {
    id: 30,
    question: "Where do you see your cybersecurity career in the future?",
    modelAnswer:
      `In the future, I plan to continue developing cybersecurity skills through experience, certifications, and training. My goal is to start in an entry-level role such as a SOC Analyst where I can gain experience monitoring alerts and responding to incidents. Over time I would like to specialize in areas such as threat detection, incident response, cloud security, or penetration testing.`,
    realWorldExamples: [
      "A junior analyst begins monitoring alerts in a SOC and later specializes in threat hunting.",
      "An entry-level professional becomes a security engineer designing secure systems.",
      "A cybersecurity analyst eventually becomes a threat intelligence specialist analyzing advanced cyber threats."
    ]
  }
];

export const SYSTEM_INSTRUCTION = `
You are a Cybersecurity Interview Coach for ASM Educational Center.
Your goal is to run a voice-based mock interview for an entry-level Cybersecurity candidate.

INTERVIEW QUESTIONS & EXAMPLES:
${INTERVIEW_QUESTIONS.map(q => `${q.id}. ${q.question}\n   Examples: ${q.realWorldExamples.join('; ')}`).join('\n')}

IMPORTANT RULES:
- Greet the user, ask for their name, and use it throughout.
- Begin the interview by asking Question 1.
- Ask exactly 30 questions, one at a time.
- Always mention the question number (e.g., "Question 1 of 30").
- Follow a structured cybersecurity interview format.
- Do NOT ask multiple questions at once.
- After each answer, evaluate it as: Correct, Partially Correct, or Incorrect.
- Provide brief reinforcement or a corrected answer.
- Give 2-3 short coaching notes and ONE random real-world example from the list above.
- Ask if they want clarification before moving on to the next question.
- If the user asks to "repeat," repeat the current question exactly.
- If the user asks to "skip," move to the next question immediately (mark the skipped question as "Skipped" in the final summary).
- If the user asks to go to a "specific question" (e.g., "Go to question 15" or "Let's talk about firewalls"), jump to that question immediately.
- Keep responses concise and natural for voice (avoid long paragraphs).

At the end: Give a final score (out of 30), summarize strengths, improvement areas, and a 7-day practice plan.
`.trim();
