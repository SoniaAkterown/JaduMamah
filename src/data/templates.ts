import { Template } from '../types.ts';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 1,
    name: 'Problem - Agitate - Solve (PAS)',
    category: 'Thought Leadership',
    structure: `[Hook]: State a common frustrating industry problem in 1 punchy sentence.
[Agitate]: Explain why traditional solutions fail and the cost of doing nothing (2-3 bullet points).
[Solve]: Introduce your counter-intuitive approach or breakthrough framework.
[Actionable Takeaway]: 3 steps anyone can apply today.
[CTA]: Question asking audience their current experience with this problem.
[Hashtags]: 3-5 targeted niche hashtags.`,
    description: 'High-engagement framework that positions you as an industry authority by solving a real pain point.',
    sampleTopic: 'Why 80% of data migration projects go over budget'
  },
  {
    id: 2,
    name: 'Career Milestone & Vulnerable Story',
    category: 'Achievement',
    structure: `[Hook]: "3 years ago, I had 0 [metric/opportunity]. Today, I just [Milestone]."
[The Struggle]: The moment things looked hopeless (raw and honest).
[The Turning Point]: The single mindset shift or mentor advice that changed everything.
[3 Rules I Followed]: Key principles learned the hard way.
[Gratitude]: Thank team, mentors, and community.
[CTA]: Encouraging closing message for anyone in the same boat.
[Hashtags]: 3-5 tags.`,
    description: 'Inspires your network by sharing the behind-the-scenes journey rather than just humble bragging.',
    sampleTopic: 'From junior developer to leading a team of 15 engineers'
  },
  {
    id: 3,
    name: 'The "X Lessons in Y Years" Guide',
    category: 'Educational',
    structure: `[Hook]: "I have spent [X] years doing [Industry/Skill]. Here are [N] non-obvious lessons I wish I knew earlier:"
[Lesson 1]: Bold rule + 1 sentence explanation.
[Lesson 2]: Bold rule + 1 sentence explanation.
[Lesson 3]: Bold rule + 1 sentence explanation.
[Lesson 4]: Bold rule + 1 sentence explanation.
[Summary]: "Mastering [Field] isn't about X, it's about Y."
[CTA]: "Which lesson resonates most with you?"
[Hashtags]: #Leadership #Growth #CareerAdvice`,
    description: 'Bite-sized, listicle-style post that maximizes saves, reposts, and comments.',
    sampleTopic: '7 brutal truths about scaling SaaS products'
  },
  {
    id: 4,
    name: 'The Controversial / Contrarian Take',
    category: 'Thought Leadership',
    structure: `[Hook]: "Unpopular opinion: [Common advice] is actually ruining your [Goal]."
[Why Most People Agree]: Acknowledge why the cliché became popular.
[The Hidden Flaw]: Present real data, observations, or case study proving otherwise.
[Better Alternative]: What high performers do instead.
[CTA]: "Do you agree, or am I totally off base here? Tell me in comments."
[Hashtags]: #Productivity #BusinessStrategy #FutureOfWork`,
    description: 'Sparks intense debate and high comment count by challenging conventional wisdom.',
    sampleTopic: 'Working 60 hours a week is not a badge of honor'
  },
  {
    id: 5,
    name: 'Product / Feature Launch with Social Proof',
    category: 'Product Launch',
    structure: `[Hook]: "After 6 months of silent building, it's finally live:"
[The Why]: The exact frustration that made us build this.
[What it does in 1 line]: Crystal clear value proposition.
[Key Capabilities]:
• Feature 1 (and the outcome it delivers)
• Feature 2 (and the time it saves)
• Feature 3 (built for professionals)
[Special Offer / Access]: Beta link or invitation.
[CTA]: "Drop a comment or DM for early access!"
[Hashtags]: #BuildInPublic #SaaS #ProductLaunch`,
    description: 'Generates excitement and qualified leads for your new release or company update.',
    sampleTopic: 'Launching our automated LinkedIn creator suite'
  },
  {
    id: 6,
    name: 'We Are Hiring / Team Expansion',
    category: 'Hiring & Career',
    structure: `[Hook]: "Our team is growing fast! We're looking for an exceptional [Role] to join us."
[Mission]: What we are building and why it matters.
[Who you are]: 3-4 qualities of the ideal candidate.
[What we offer]: Culture, flexibility, compensation, and impact.
[How to apply]: Simple application process (link or DM).
[CTA]: "Please share or tag someone in your network who would be a great fit!"
[Hashtags]: #Hiring #TechJobs #RemoteWork`,
    description: 'High reach hiring post designed for viral reposts and peer tagging.',
    sampleTopic: 'Hiring Senior Full Stack Engineer (Remote)'
  }
];
