import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_TEMPLATES } from './src/data/templates.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Database storage (representing Oracle tables: USERS, POSTS, TEMPLATES, AI_REQUESTS)
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DBSchema {
  users: Array<{
    USER_ID: number;
    NAME: string;
    EMAIL: string;
    PASSWORD_HASH: string;
    HEADLINE: string;
    AVATAR_URL: string;
    PLATFORM?: string;
    CREATED_AT: string;
  }>;
  posts: Array<{
    POST_ID: number;
    USER_ID: number;
    TOPIC: string;
    TONE: string;
    CONTENT: string;
    HASHTAGS: string;
    CREATED_AT: string;
    UPDATED_AT?: string;
  }>;
  templates: Array<{
    TEMPLATE_ID: number;
    NAME: string;
    CATEGORY: string;
    STRUCTURE: string;
    DESCRIPTION: string;
    SAMPLE_TOPIC: string;
  }>;
  ai_requests: Array<{
    REQUEST_ID: number;
    USER_ID: number;
    PROMPT_TEXT: string;
    RESPONSE_TEXT: string;
    MODEL_NAME: string;
    TOKENS_USED: number;
    CREATED_AT: string;
  }>;
}

// Ensure data folder and file
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB(): DBSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (!data.templates || data.templates.length === 0) {
        data.templates = INITIAL_TEMPLATES.map((t) => ({
          TEMPLATE_ID: t.id,
          NAME: t.name,
          CATEGORY: t.category,
          STRUCTURE: t.structure,
          DESCRIPTION: t.description,
          SAMPLE_TOPIC: t.sampleTopic,
        }));
        saveDB(data);
      }
      return data;
    } catch {
      // Fallback
    }
  }

  const initialDB: DBSchema = {
    users: [
      {
        USER_ID: 1,
        NAME: 'Sonia Akter',
        EMAIL: 'sonia.akterown@gmail.com',
        PASSWORD_HASH: 'demo_secure_hash_89234',
        HEADLINE: 'Growth Marketer & AI Content Strategist | Helping Brands Scale',
        AVATAR_URL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        CREATED_AT: new Date().toISOString(),
      },
    ],
    posts: [
      {
        POST_ID: 101,
        USER_ID: 1,
        TOPIC: 'The Future of AI in Content Creation',
        TONE: 'Thought Leadership',
        CONTENT: `AI won't replace content creators. But creators who master AI will replace those who don't.\n\nHere are 3 shifts happening right now:\n\n1. Speed is no longer a moat — authenticity and perspective are.\n2. Raw drafts are generated in seconds, but editorial judgment takes years to build.\n3. Personalized storytelling wins over generic summaries every single time.\n\nThe real superpower? Using AI as your thought partner, not your ghostwriter.\n\nWhat's your biggest experiment with AI tools this month?`,
        HASHTAGS: '#ArtificialIntelligence #ContentStrategy #FutureOfWork #Productivity #Marketing',
        CREATED_AT: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        POST_ID: 102,
        USER_ID: 1,
        TOPIC: 'Hitting 10k Followers on LinkedIn',
        TONE: 'Achievement',
        CONTENT: `One year ago today, I had less than 200 followers and zero confidence posting on LinkedIn.\n\nThis week, our community crossed 10,000 professional minds. 🎉\n\nNo viral gimmicks. No pods. Just 3 simple rules:\n\n• Show up 4x a week consistently\n• Share failures as openly as wins\n• Spend 15 minutes engaging with other people's ideas daily\n\nThank you to everyone who reads, comments, and challenges my thinking here.\n\nIf you're hesitating to publish your first post: start today. Your voice matters!`,
        HASHTAGS: '#Milestone #GrowthMindset #PersonalBranding #LinkedInTips #Gratitude',
        CREATED_AT: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ],
    templates: INITIAL_TEMPLATES.map((t) => ({
      TEMPLATE_ID: t.id,
      NAME: t.name,
      CATEGORY: t.category,
      STRUCTURE: t.structure,
      DESCRIPTION: t.description,
      SAMPLE_TOPIC: t.sampleTopic,
    })),
    ai_requests: [
      {
        REQUEST_ID: 1,
        USER_ID: 1,
        PROMPT_TEXT: 'Topic: The Future of AI in Content Creation, Tone: Thought Leadership',
        RESPONSE_TEXT: 'AI won\'t replace content creators...',
        MODEL_NAME: 'gemini-3.8-flash',
        TOKENS_USED: 342,
        CREATED_AT: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
  };

  saveDB(initialDB);
  return initialDB;
}

function saveDB(db: DBSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist DB file:', err);
  }
}

let db = loadDB();

// Server-side Gemini API client with multi-model fallback resiliency
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function callGeminiWithModelFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
): Promise<{ response: any; modelUsed: string }> {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      console.warn(
        `[Gemini] Model ${model} unavailable or returned error (${err.status || err.code || err.message}). Switching to fallback model candidate...`
      );
      lastError = err;
    }
  }
  throw lastError;
}

// ----------------------------------------------------
// 1. AUTH ENDPOINTS (/api/auth/*)
// ----------------------------------------------------

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, headline } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.find((u) => u.EMAIL.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUserId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.USER_ID)) + 1 : 1;
    const newUser = {
    USER_ID: newUserId,
    NAME: name,
    EMAIL: email,
    PASSWORD_HASH: `hash_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    HEADLINE: headline || 'Professional Creator & Specialist',
    AVATAR_URL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    PLATFORM: req.body.platform || 'linkedin',
    CREATED_AT: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDB(db);

  const token = `jwt_token_${newUser.USER_ID}_${Date.now()}`;
  return res.json({
    token,
    user: {
      id: newUser.USER_ID,
      name: newUser.NAME,
      email: newUser.EMAIL,
      headline: newUser.HEADLINE,
      avatarUrl: newUser.AVATAR_URL,
      platform: newUser.PLATFORM || 'linkedin',
      createdAt: newUser.CREATED_AT,
    },
  });
});

app.post('/api/auth/social', (req, res) => {
  const { provider, name, email, avatarUrl, headline } = req.body;
  const platform = (provider || 'linkedin').toLowerCase(); // 'linkedin' | 'facebook' | 'instagram' | 'youtube'

  const defaultMeta: Record<
    string,
    { name: string; email: string; headline: string; avatar: string }
  > = {
    linkedin: {
      name: 'Sonia Akter',
      email: 'sonia.akterown@gmail.com',
      headline: 'Growth Marketer & AI Content Strategist | Helping Brands Scale',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    facebook: {
      name: 'Sonia Akter',
      email: 'sonia.facebook@creator.com',
      headline: 'Digital Content Creator & Social Media Influencer (120K+ Followers)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    instagram: {
      name: 'Sonia Akter (@sonia.creatives)',
      email: 'sonia.instagram@creator.com',
      headline: 'Reels Creator, Visual Storyteller & Brand Partner ✨',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    youtube: {
      name: 'Sonia Akter Official',
      email: 'sonia.youtube@creator.com',
      headline: 'Tech & Lifestyle YouTuber | 85K Subscribers',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  };

  const meta = defaultMeta[platform] || defaultMeta.linkedin;
  const targetEmail = email || meta.email;

  let user = db.users.find((u) => u.EMAIL.toLowerCase() === targetEmail.toLowerCase());
  if (!user) {
    const newUserId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.USER_ID)) + 1 : 1;
    user = {
      USER_ID: newUserId,
      NAME: name || meta.name,
      EMAIL: targetEmail,
      PASSWORD_HASH: `social_hash_${platform}_${Date.now()}`,
      HEADLINE: headline || meta.headline,
      AVATAR_URL: avatarUrl || meta.avatar,
      PLATFORM: platform,
      CREATED_AT: new Date().toISOString(),
    };
    db.users.push(user);
    saveDB(db);
  } else {
    // Update platform if switched
    user.PLATFORM = platform;
    saveDB(db);
  }

  const token = `jwt_token_${user.USER_ID}_${Date.now()}`;
  return res.json({
    token,
    user: {
      id: user.USER_ID,
      name: user.NAME,
      email: user.EMAIL,
      headline: user.HEADLINE,
      avatarUrl: user.AVATAR_URL,
      platform: user.PLATFORM || platform,
      createdAt: user.CREATED_AT,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.find((u) => u.EMAIL.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  const token = `jwt_token_${user.USER_ID}_${Date.now()}`;
  return res.json({
    token,
    user: {
      id: user.USER_ID,
      name: user.NAME,
      email: user.EMAIL,
      headline: user.HEADLINE,
      avatarUrl: user.AVATAR_URL,
      platform: user.PLATFORM || 'linkedin',
      createdAt: user.CREATED_AT,
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = 1;
  if (authHeader && authHeader.startsWith('Bearer jwt_token_')) {
    const parts = authHeader.replace('Bearer jwt_token_', '').split('_');
    const parsedId = parseInt(parts[0], 10);
    if (!isNaN(parsedId)) {
      userId = parsedId;
    }
  }

  const user = db.users.find((u) => u.USER_ID === userId) || db.users[0];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.USER_ID,
      name: user.NAME,
      email: user.EMAIL,
      headline: user.HEADLINE,
      avatarUrl: user.AVATAR_URL,
      platform: user.PLATFORM || 'linkedin',
      createdAt: user.CREATED_AT,
    },
  });
});

// ----------------------------------------------------
// 2. TEMPLATES ENDPOINTS (/api/templates)
// ----------------------------------------------------

app.get('/api/templates', (req, res) => {
  const formatted = db.templates.map((t) => ({
    id: t.TEMPLATE_ID,
    name: t.NAME,
    category: t.CATEGORY,
    structure: t.STRUCTURE,
    description: t.DESCRIPTION,
    sampleTopic: t.SAMPLE_TOPIC,
  }));
  res.json(formatted);
});

// ----------------------------------------------------
// 3. POST GENERATION WITH GEMINI (/api/posts/generate)
// ----------------------------------------------------

app.post('/api/posts/generate', async (req, res) => {
  try {
    const {
      topic,
      tone = 'Professional',
      length = 'medium',
      language = 'en',
      includeEmojis = true,
      variationsCount = 2,
      targetAudience = 'LinkedIn Professionals, Recruiters, and Peers',
      customNotes = '',
      templateId,
      userId = 1,
    } = req.body;

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Topic or keywords are required' });
    }

    const template = templateId ? db.templates.find((t) => t.TEMPLATE_ID === Number(templateId)) : null;

    const lengthWords = length === 'short' ? '80-150 words' : length === 'long' ? '300-450 words' : '180-280 words';

    const systemPrompt = `You are a world-class LinkedIn ghostwriter and content strategist.
Your mission is to craft high-performing, authentic LinkedIn posts that stop the scroll, encourage "see more" clicks, maximize dwell time, and drive meaningful conversations.
Key formatting rules:
- Hook: The first 1-2 lines must be compelling, clear, and spark curiosity without deceptive clickbait.
- Spacing: Use white space generously with single line breaks between paragraphs for mobile readability.
- Structure: Short punchy sentences, bullet points or numbered lists where appropriate, and a genuine closing call-to-action question.
- Hashtags: Suggest 3-5 relevant, high-traction hashtags.
- Emojis: ${includeEmojis ? 'Use tasteful, professional emojis to enhance readability.' : 'Do NOT use emojis.'}
- Language: ${language === 'bn' ? 'Generate natural, modern, professional Bengali (বাংলা) text suitable for LinkedIn.' : 'Generate natural, impactful English text.'}
- Tone: ${tone}
- Target Audience: ${targetAudience}
${template ? `Follow the structure of this template:\n${template.STRUCTURE}` : ''}
${customNotes ? `Important details to include: ${customNotes}` : ''}`;

    const userPrompt = `Topic: "${topic}"
Desired Tone: "${tone}"
Length guideline: approximately ${lengthWords}
Number of distinct variations to produce: ${Math.min(Math.max(Number(variationsCount) || 1, 1), 3)}

Generate ${variationsCount} distinct variations with different hooks and narrative angles.`;

    let generatedVariations: Array<{
      id: string;
      hook: string;
      content: string;
      hashtags: string[];
      callToAction: string;
      characterCount: number;
      wordCount: number;
      estimatedReadTime: string;
      engagementScore: number;
      tone: string;
    }> = [];

    let tokensUsed = 350;
    let actualModelUsed = 'gemini-3.1-flash-lite';
    const ai = getGeminiClient();

    if (ai) {
      try {
        const { response, modelUsed } = await callGeminiWithModelFallback(ai, {
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                variations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      hook: { type: Type.STRING, description: 'The scroll-stopping opening line' },
                      body: { type: Type.STRING, description: 'The main body content with paragraph breaks' },
                      callToAction: { type: Type.STRING, description: 'Closing question or takeaway' },
                      hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: '3 to 5 relevant hashtags with #',
                      },
                      engagementScore: { type: Type.INTEGER, description: 'Estimated engagement score 75-98' },
                    },
                    required: ['hook', 'body', 'callToAction', 'hashtags'],
                  },
                },
              },
              required: ['variations'],
            },
          },
        });

        actualModelUsed = modelUsed;
        const textOutput = response.text || '';
        const parsed = JSON.parse(textOutput);

        if (parsed.variations && Array.isArray(parsed.variations) && parsed.variations.length > 0) {
          generatedVariations = parsed.variations.map((v: any, index: number) => {
            const fullContent = `${v.hook}\n\n${v.body}\n\n${v.callToAction}\n\n${v.hashtags.join(' ')}`.trim();
            const words = fullContent.split(/\s+/).filter(Boolean).length;
            const readTime = Math.max(1, Math.ceil(words / 180));

            return {
              id: `var-${Date.now()}-${index + 1}`,
              hook: v.hook,
              content: fullContent,
              hashtags: v.hashtags || [],
              callToAction: v.callToAction || '',
              characterCount: fullContent.length,
              wordCount: words,
              estimatedReadTime: `${readTime} min read`,
              engagementScore: v.engagementScore || Math.floor(82 + Math.random() * 15),
              tone,
            };
          });
        }
        tokensUsed = 420 + generatedVariations.length * 90;
      } catch (geminiError) {
        console.error('All candidate Gemini models failed, using intelligent fallback generator:', geminiError);
        actualModelUsed = 'fallback-heuristic-engine';
        generatedVariations = generateFallbackVariations(topic, tone, length, language, includeEmojis, variationsCount);
      }
    } else {
      // Fallback generator if GEMINI_API_KEY is not configured
      actualModelUsed = 'fallback-heuristic-engine';
      generatedVariations = generateFallbackVariations(topic, tone, length, language, includeEmojis, variationsCount);
    }

    // Save primary post to Oracle POSTS table
    const primaryVar = generatedVariations[0];
    const newPostId = db.posts.length > 0 ? Math.max(...db.posts.map((p) => p.POST_ID)) + 1 : 101;
    const newPostRecord = {
      POST_ID: newPostId,
      USER_ID: Number(userId) || 1,
      TOPIC: topic,
      TONE: tone,
      CONTENT: primaryVar.content,
      HASHTAGS: primaryVar.hashtags.join(' '),
      CREATED_AT: new Date().toISOString(),
    };

    db.posts.unshift(newPostRecord);

    // Log in AI_REQUESTS table
    const newRequestId = db.ai_requests.length > 0 ? Math.max(...db.ai_requests.map((r) => r.REQUEST_ID)) + 1 : 1;
    const aiLog = {
      REQUEST_ID: newRequestId,
      USER_ID: Number(userId) || 1,
      PROMPT_TEXT: `Topic: ${topic}, Tone: ${tone}, Length: ${length}`,
      RESPONSE_TEXT: primaryVar.content.substring(0, 300) + '...',
      MODEL_NAME: actualModelUsed,
      TOKENS_USED: tokensUsed,
      CREATED_AT: new Date().toISOString(),
    };
    db.ai_requests.unshift(aiLog);

    saveDB(db);

    return res.json({
      variations: generatedVariations,
      selectedPostId: newPostId,
      tokensUsed,
      modelName: actualModelUsed,
      requestId: newRequestId,
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while generating post' });
  }
});

// Fallback high-quality variation generator
function generateFallbackVariations(
  topic: string,
  tone: string,
  length: string,
  language: string,
  includeEmojis: boolean,
  count: number
) {
  const e1 = includeEmojis ? '🚀 ' : '';
  const e2 = includeEmojis ? '💡 ' : '';
  const e3 = includeEmojis ? '📌 ' : '';
  const e4 = includeEmojis ? '🎯 ' : '';

  const cleanTags = [
    `#${topic.replace(/[^a-zA-Z0-9]/g, '')}`,
    '#Leadership',
    '#Innovation',
    '#Productivity',
    '#LinkedInGrowth',
  ].slice(0, 4);

  if (language === 'bn') {
    return [
      {
        id: `var-${Date.now()}-1`,
        hook: `${e1}"${topic}" নিয়ে কাজ করতে গিয়ে আমি যে সবচেয়ে বড় শিক্ষাটা পেয়েছি:`,
        content: `${e1}"${topic}" নিয়ে কাজ করতে গিয়ে আমি যে সবচেয়ে বড় শিক্ষাটা পেয়েছি:\n\nশুরুতে মনে হয়েছিল পথটা খুব জটিল। কিন্তু ৩টি সহজ নীতি সবকিছু বদলে দিয়েছে:\n\n${e2}১. ধারাবাহিকতা প্রতিভার চেয়ে দ্রুত ফলাফল এনে দেয়।\n${e3}২. ভুল থেকে শেখা লজ্জার কিছু নয়, বরং অগ্রগতির মূল ভিত্তি।\n${e4}৩. সঠিক মানুষের সাথে নেটওয়ার্কিং নতুন দ্বার উন্মোচন করে।\n\nআপনি যদি একই লক্ষ্য নিয়ে কাজ করছেন, তবে মনে রাখবেন—ছোট ছোট দৈনিক পদক্ষেপেও দীর্ঘমেয়াদে বিশাল পরিবর্তন আসে।\n\n${topic} বিষয়ে আপনার অভিজ্ঞতা কেমন? কমেন্টে জানান!\n\n${cleanTags.join(' ')}`,
        hashtags: cleanTags,
        callToAction: `${topic} বিষয়ে আপনার অভিজ্ঞতা কেমন? কমেন্টে জানান!`,
        characterCount: 650,
        wordCount: 110,
        estimatedReadTime: '1 min read',
        engagementScore: 92,
        tone,
      },
    ];
  }

  const variations = [];
  // Variation 1: Analytical & Framework
  variations.push({
    id: `var-${Date.now()}-1`,
    hook: `${e1}Most people overcomplicate ${topic}. Here is the 3-step framework that changed everything:`,
    content: `${e1}Most people overcomplicate ${topic}. Here is the 3-step framework that changed everything:\n\n18 months ago, I thought success in this area required 80-hour weeks and constant grind.\n\nThen I realized high performers do 3 things differently:\n\n${e2}1. Ruthless Prioritization: Cut the noise and protect the single daily task that moves the needle.\n${e3}2. Systems Over Motivation: Build a process so clear that execution requires zero willpower.\n${e4}3. Public Accountability: Share what you learn in real-time, invite feedback, and iterate quickly.\n\nMastery isn't about doing more things—it's about doing the right things with relentless consistency.\n\nWhat is your #1 takeaway when dealing with ${topic}?\n\n${cleanTags.join(' ')}`,
    hashtags: cleanTags,
    callToAction: `What is your #1 takeaway when dealing with ${topic}?`,
    characterCount: 780,
    wordCount: 135,
    estimatedReadTime: '1 min read',
    engagementScore: 94,
    tone,
  });

  if (count > 1) {
    // Variation 2: Storytelling & Lesson
    variations.push({
      id: `var-${Date.now()}-2`,
      hook: `${e2}I used to think ${topic} was only for industry veterans. I was completely wrong.`,
      content: `${e2}I used to think ${topic} was only for industry veterans. I was completely wrong.\n\nWhen I first started, the impostor syndrome was real. Every voice inside my head said:\n"Wait until you have 10 more years of experience."\n\nHere's what waiting would have cost me:\n• Missed opportunities\n• Slower career growth\n• Never building a network of like-minded innovators\n\nThe secret? You don't need all the answers before you begin. You discover the answers BY beginning.\n\nIf you're hesitating right now, consider this your green light.\n\nHave you ever postponed a project because you felt "not ready"? Let's discuss below!\n\n${cleanTags.join(' ')}`,
      hashtags: cleanTags,
      callToAction: `Have you ever postponed a project because you felt "not ready"? Let's discuss below!`,
      characterCount: 720,
      wordCount: 125,
      estimatedReadTime: '1 min read',
      engagementScore: 89,
      tone,
    });
  }

  if (count > 2) {
    // Variation 3: Contrarian & Thought-Provoking
    variations.push({
      id: `var-${Date.now()}-3`,
      hook: `${e3}Unpopular opinion: Everything you've been told about ${topic} is outdated.`,
      content: `${e3}Unpopular opinion: Everything you've been told about ${topic} is outdated.\n\nFor the last 5 years, the consensus was clear: follow the traditional playbook and hope for results.\n\nToday, the playbook is broken.\n\nHere are 3 counter-intuitive truths:\n• Output quality matters more than vanity volume.\n• Authenticity builds higher trust than polished corporate jargon.\n• Direct conversations beat passive broadcasting every time.\n\nThe future belongs to those who test, adapt, and build in public.\n\nDo you agree, or do you still swear by the conventional playbook?\n\n${cleanTags.join(' ')}`,
      hashtags: cleanTags,
      callToAction: `Do you agree, or do you still swear by the conventional playbook?`,
      characterCount: 680,
      wordCount: 115,
      estimatedReadTime: '1 min read',
      engagementScore: 96,
      tone,
    });
  }

  return variations.slice(0, count);
}

// ----------------------------------------------------
// 4. POST REFINEMENT WITH AI (/api/posts/refine)
// ----------------------------------------------------

app.post('/api/posts/refine', async (req, res) => {
  try {
    const { currentContent, refinementType = 'punchier', customInstruction = '', language = 'en' } = req.body;

    if (!currentContent) {
      return res.status(400).json({ error: 'currentContent is required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert LinkedIn editor.
Refine this existing LinkedIn post according to the following instruction:
Refinement Mode: "${refinementType}"
${customInstruction ? `Specific user instructions: ${customInstruction}` : ''}
Language: ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}

Original Post:
"""
${currentContent}
"""

Return the refined, polished LinkedIn post ready to publish. Maintain appropriate line breaks and 3-5 hashtags at the end.`;

    let refinedText = '';
    let actualModelUsed = 'gemini-3.1-flash-lite';
    if (ai) {
      try {
        const { response, modelUsed } = await callGeminiWithModelFallback(ai, {
          contents: prompt,
        });
        actualModelUsed = modelUsed;
        refinedText = response.text?.trim() || currentContent;
      } catch (err) {
        console.error('All candidate Gemini models failed during refine, applying algorithmic refinement:', err);
        actualModelUsed = 'local-algorithmic';
        refinedText = applyLocalRefine(currentContent, refinementType);
      }
    } else {
      actualModelUsed = 'local-algorithmic';
      refinedText = applyLocalRefine(currentContent, refinementType);
    }

    return res.json({ refinedContent: refinedText, modelUsed: actualModelUsed });
  } catch (error: any) {
    console.error('Refine failed:', error);
    return res.status(500).json({ error: 'Failed to refine post' });
  }
});

function applyLocalRefine(content: string, type: string) {
  if (type === 'punchier') {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n\n');
  }
  if (type === 'emojis') {
    return `🚀 ${content}\n\n💡 Remember: Consistency leads to mastery!`;
  }
  if (type === 'questions') {
    return `${content}\n\n💬 What's your personal rule of thumb on this? Would love to hear your perspectives in the comments!`;
  }
  return content;
}

// ----------------------------------------------------
// 4B. GENERIC TOOLS AI GENERATOR (/api/tools/generate)
// ----------------------------------------------------

app.post('/api/tools/generate', async (req, res) => {
  try {
    const { toolName, topic = '', prompt = '', tone = 'Engaging', options = {} } = req.body;

    const ai = getGeminiClient();

    let systemInstruction = '';
    let userPrompt = '';

    if (toolName === 'Instagram Caption Generator') {
      systemInstruction = 'You are a social media expert who writes viral, high-converting Instagram captions.';
      userPrompt = `Write an Instagram caption about: "${topic || prompt}".
Tone: ${tone}
Structure:
1. Hook (First line that stops the scroll)
2. Value/Story (Short punchy lines with line breaks and aesthetic emojis)
3. Call to Action (Engagement question or prompt to save/share)
4. 20-25 targeted, trending hashtags categorized by niche.`;
    } else if (toolName === 'Facebook Caption Generator') {
      systemInstruction = 'You are a social media expert specializing in high-reach, viral Facebook post captions and discussions.';
      userPrompt = `Write 3 high-engagement Facebook caption options for a post about: "${topic || prompt}".
Tone: ${tone}
Structure:
- Scroll-stopping opening line
- Relatable storytelling or value bullets with clean formatting
- Conversation-starting CTA question that drives comments & shares
- 3-5 relevant hashtags.`;
    } else if (toolName === 'TikTok Caption Generator') {
      systemInstruction = 'You are a TikTok algorithm specialist and viral content creator.';
      userPrompt = `Write 3 viral TikTok caption options for a video about: "${topic || prompt}".
Tone: ${tone}
For each option provide:
- Hook (under 12 words)
- Curiosity gap / video context
- Call to Action
- 5-7 high-performing TikTok hashtags (e.g. #fyp, #viral, niche tags).`;
    } else if (toolName === 'LinkedIn Summary Generator') {
      systemInstruction = 'You are an executive LinkedIn branding strategist and career consultant.';
      userPrompt = `Write 3 complete LinkedIn 'About / Summary' section variations for: "${topic || prompt}".
Current Role / Background: ${options.role || 'Professional'}
Key Highlights: ${options.highlights || 'Driving impact and building solutions'}

Variation 1: Executive & Authoritative (Leadership, metrics, vision)
Variation 2: Storyteller & Human (Personal journey, passion, values)
Variation 3: High-Growth Builder (Action-oriented, skills, current mission)

Format each with clean spacing, bullet points, and a contact CTA.`;
    } else if (toolName === 'LinkedIn Cheat Sheet Generator') {
      systemInstruction = 'You create viral 1-page visual LinkedIn cheat sheets and frameworks.';
      userPrompt = `Create a comprehensive, structured 1-page cheat sheet for: "${topic || prompt}".
Format:
- 📌 THE CORE FRAMEWORK (Name and 1-sentence definition)
- ⚡ 5 GOLDEN RULES / FORMULAS
- ❌ TOP 3 MISTAKES TO AVOID
- ✅ 3 IMMEDIATE ACTION STEPS
- 💡 PRO-TIP FOR SUCCESS
Keep it clean, high-density, and formatted with emojis.`;
    } else if (toolName === 'Free Video Resume Maker') {
      systemInstruction = 'You are an executive speechwriter and video pitch coach.';
      userPrompt = `Write a high-impact 60-second video elevator pitch script for:
Candidate Name: ${options.name || 'Candidate'}
Target Role: ${topic || options.role || 'Software Engineer / Marketer'}
Key Superpowers: ${options.skills || 'Problem solving, growth, execution'}

Include timestamps:
[00:00 - 00:10] The Irresistible Hook
[00:10 - 00:30] Proven Track Record & Concrete Win
[00:30 - 00:50] What Sets Me Apart / Cultural Fit
[00:50 - 01:00] Direct Call To Action (Interview invitation)`;
    } else if (toolName === 'OCR PDF to Text') {
      systemInstruction = 'You are an OCR document transcription engine and proofreader.';
      userPrompt = `Format, clean up, and structure the following extracted raw document text into clean, readable Markdown with proper headers and tables:
"""
${prompt || topic || 'INVOICE / CONTRACT SAMPLE\nDate: 2026-09-15\nItem 1: Services rendered ($1,500)\nTerms: Net 30 days.'}
"""`;
    } else {
      systemInstruction = 'You are an expert digital creator and tool assistant.';
      userPrompt = `Generate high quality, ready-to-use output for the tool "${toolName}" on the topic: "${topic || prompt}". Tone: ${tone}.`;
    }

    let generatedText = '';
    let actualModelUsed = 'gemini-3.1-flash-lite';

    if (ai) {
      try {
        const { response, modelUsed } = await callGeminiWithModelFallback(ai, {
          contents: `${systemInstruction}\n\n${userPrompt}`,
        });
        actualModelUsed = modelUsed;
        generatedText = response.text?.trim() || '';
      } catch (err) {
        console.error('Gemini tools generate error:', err);
        actualModelUsed = 'local-fallback';
        generatedText = getToolLocalFallback(toolName, topic, options);
      }
    } else {
      actualModelUsed = 'local-fallback';
      generatedText = getToolLocalFallback(toolName, topic, options);
    }

    if (!generatedText) {
      generatedText = getToolLocalFallback(toolName, topic, options);
    }

    return res.json({ result: generatedText, modelUsed: actualModelUsed });
  } catch (error: any) {
    console.error('Tools generation failed:', error);
    return res.status(500).json({ error: 'Failed to generate tool output' });
  }
});

function getToolLocalFallback(toolName: string, topic: string, options: any = {}) {
  const query = topic || 'Growth & Innovation';

  if (toolName.includes('Instagram')) {
    return `Stop scrolling if you want to master ${query} 👇\n\nMost people spend months trying to figure this out on their own. But once you realize these 3 simple rules, everything clicks:\n\n✨ Rule 1: Clarity always beats complexity.\n✨ Rule 2: Show up before you feel 100% ready.\n✨ Rule 3: Quality compounds when you are consistent.\n\nSave this post so you can revisit it when you need a quick reminder! 🔖\n\nWhich rule resonates with you the most? Drop 1, 2, or 3 below! 👇\n\n#${query.replace(/\s+/g, '')} #instagramtips #contentcreation #creativeprocess #growthmindset #successhabits #creatorsgonnacreate #digitalcreators #buildinpublic`;
  }

  if (toolName.includes('TikTok')) {
    return `🔥 OPTION 1 (The Curiosity Hook):\n"The one thing nobody warned me about ${query}..."\nWait until the end to see how this saved me 20 hours a week.\n#fyp #learnontiktok #${query.replace(/\s+/g, '')} #viral #tips\n\n⚡ OPTION 2 (The Contrarian):\n"Why 99% of people fail at ${query} in 2026."\nStop doing step 2 right now.\n#foryou #${query.replace(/\s+/g, '')}tips #lifehack #career\n\n🚀 OPTION 3 (The Tutorial):\n"3 tools that make ${query} 10x easier (save this!)."\nComment 'TOOL' and I'll send you the cheat sheet.\n#trending #productivity #contentcreator`;
  }

  if (toolName.includes('Summary')) {
    return `🌟 OPTION 1: EXECUTIVE & VISIONARY\n\nI help ambitious teams scale by bridging the gap between strategy and flawless execution in ${query}.\n\nOver the past 6+ years, I have:\n• Driven multi-channel growth programs that scaled audience engagement by 240%.\n• Designed scalable frameworks adopted across cross-functional teams.\n• Mentored emerging talents and built high-performance workflows.\n\nCore Competencies: ${query}, Strategic Roadmapping, Leadership, Content Strategy, Analytics.\n\nLet's connect or drop me an email to collaborate!\n\n---\n\n🚀 OPTION 2: THE BUILDER'S JOURNEY\n\nI believe the best work happens at the intersection of deep curiosity and relentless experimentation.\n\nMy journey started with a simple obsession: how can we make ${query} more human, more impactful, and 10x more efficient? Today, I partner with forward-thinking brands and leaders to bring that vision to life.\n\nWhen I am not deep in data or designing content, you'll find me exploring emerging AI tools and sharing actionable playbooks.\n\nOpen to: Advisory roles, collaborative projects, and speaking opportunities.`;
  }

  if (toolName.includes('Cheat Sheet')) {
    return `📌 THE ULTIMATE CHEAT SHEET: ${query.toUpperCase()}\n\n⚡ 5 GOLDEN RULES:\n1. Hook in the first 3 seconds / 140 characters.\n2. One single idea per piece of content—do not dilute the message.\n3. Make your insights actionable within 5 minutes.\n4. Format for visual breathing room: 1-2 sentence paragraphs maximum.\n5. Always conclude with a frictionless, conversation-starting prompt.\n\n❌ 3 COSTLY MISTAKES TO AVOID:\n• Writing walls of unbroken text that look like college textbooks.\n• Burying the lead—get straight to the value before explaining the backstory.\n• Forgetting to reply to comments within the first 60 minutes.\n\n✅ 3 IMMEDIATE ACTION STEPS:\n1. Audit your top 3 performing posts to identify common patterns.\n2. Build an idea swipe file with at least 15 proven frameworks.\n3. Test 2 different hook styles on the same underlying insight.\n\n💡 PRO-TIP:\n"High engagement isn't about being universally liked; it's about being undeniably specific."`;
  }

  if (toolName.includes('Video Resume')) {
    return `🎬 60-SECOND ELEVATOR PITCH SCRIPT:\n\n[00:00 - 00:10] THE HOOK\n"Hi, I'm ${options.name || 'a passionate creator'}, and for the past 5 years, I've dedicated my career to solving one major problem: how to scale ${query} without burning out teams."\n\n[00:10 - 00:30] CONCRETE WIN\n"In my last role, I led a cross-functional initiative that boosted our key engagement metrics by 140% in just 90 days. I did that by combining data-driven automation with high-touch storytelling."\n\n[00:30 - 00:50] WHAT SETS ME APART\n"What makes me different is that I don't just strategize—I build, test, and ship. I thrive in fast-paced environments where agility and high standards are celebrated."\n\n[00:50 - 01:00] THE CALL TO ACTION\n"I would love to bring this energy to your team. Feel free to check out my portfolio below, and let's schedule a 15-minute introductory call this week!"`;
  }

  return `Here is your high-impact content for ${toolName} on "${query}":\n\n1. Core Focus: High-efficiency execution\n2. Key Takeaway: Simplify the message, amplify the reach\n3. Action Step: Test and iterate with live audience feedback\n\nReady to copy and use immediately!`;
}

// ----------------------------------------------------
// 5. POSTS HISTORY & DRAFTS CRUD (/api/posts/*)
// ----------------------------------------------------

app.get('/api/posts/history', (req, res) => {
  const postsFormatted = db.posts.map((p) => ({
    id: p.POST_ID,
    userId: p.USER_ID,
    topic: p.TOPIC,
    tone: p.TONE,
    content: p.CONTENT,
    hashtags: p.HASHTAGS,
    createdAt: p.CREATED_AT,
    updatedAt: p.UPDATED_AT,
  }));
  res.json(postsFormatted);
});

app.put('/api/posts/:id', (req, res) => {
  const postId = Number(req.params.id);
  const { content, topic, tone, hashtags } = req.body;

  const postIndex = db.posts.findIndex((p) => p.POST_ID === postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (content !== undefined) db.posts[postIndex].CONTENT = content;
  if (topic !== undefined) db.posts[postIndex].TOPIC = topic;
  if (tone !== undefined) db.posts[postIndex].TONE = tone;
  if (hashtags !== undefined) db.posts[postIndex].HASHTAGS = hashtags;
  db.posts[postIndex].UPDATED_AT = new Date().toISOString();

  saveDB(db);

  return res.json({
    success: true,
    post: {
      id: db.posts[postIndex].POST_ID,
      userId: db.posts[postIndex].USER_ID,
      topic: db.posts[postIndex].TOPIC,
      tone: db.posts[postIndex].TONE,
      content: db.posts[postIndex].CONTENT,
      hashtags: db.posts[postIndex].HASHTAGS,
      createdAt: db.posts[postIndex].CREATED_AT,
      updatedAt: db.posts[postIndex].UPDATED_AT,
    },
  });
});

app.delete('/api/posts/:id', (req, res) => {
  const postId = Number(req.params.id);
  const initialLength = db.posts.length;
  db.posts = db.posts.filter((p) => p.POST_ID !== postId);

  if (db.posts.length === initialLength) {
    return res.status(404).json({ error: 'Post not found' });
  }

  saveDB(db);
  return res.json({ success: true, message: 'Post deleted successfully' });
});

// ----------------------------------------------------
// 6. ORACLE DATABASE SCHEMA & INSPECTOR (/api/database/schema-viewer)
// ----------------------------------------------------

app.get('/api/database/schema-viewer', (req, res) => {
  const ddl = `
-- ===================================================
-- Oracle Database 19c/21c DDL Schema for LinkedIn Post Generator
-- ===================================================

CREATE TABLE USERS (
    USER_ID       NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    NAME          VARCHAR2(100) NOT NULL,
    EMAIL         VARCHAR2(150) UNIQUE NOT NULL,
    PASSWORD_HASH VARCHAR2(255) NOT NULL,
    HEADLINE      VARCHAR2(255),
    AVATAR_URL    VARCHAR2(500),
    CREATED_AT    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE POSTS (
    POST_ID       NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    USER_ID       NUMBER NOT NULL REFERENCES USERS(USER_ID) ON DELETE CASCADE,
    TOPIC         VARCHAR2(255) NOT NULL,
    TONE          VARCHAR2(50) NOT NULL,
    CONTENT       CLOB NOT NULL,
    HASHTAGS      VARCHAR2(500),
    CREATED_AT    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UPDATED_AT    TIMESTAMP
);

CREATE TABLE TEMPLATES (
    TEMPLATE_ID   NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    NAME          VARCHAR2(100) NOT NULL,
    CATEGORY      VARCHAR2(50) NOT NULL,
    STRUCTURE     CLOB NOT NULL,
    DESCRIPTION   VARCHAR2(255),
    SAMPLE_TOPIC  VARCHAR2(255)
);

CREATE TABLE AI_REQUESTS (
    REQUEST_ID    NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    USER_ID       NUMBER REFERENCES USERS(USER_ID),
    PROMPT_TEXT   CLOB NOT NULL,
    RESPONSE_TEXT CLOB NOT NULL,
    MODEL_NAME    VARCHAR2(100) DEFAULT 'gemini-3.8-flash',
    TOKENS_USED   NUMBER DEFAULT 0,
    CREATED_AT    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;

  res.json({
    ddl,
    tables: {
      USERS: {
        count: db.users.length,
        columns: ['USER_ID', 'NAME', 'EMAIL', 'HEADLINE', 'CREATED_AT'],
        rows: db.users.map((u) => ({
          USER_ID: u.USER_ID,
          NAME: u.NAME,
          EMAIL: u.EMAIL,
          HEADLINE: u.HEADLINE,
          CREATED_AT: u.CREATED_AT,
        })),
      },
      POSTS: {
        count: db.posts.length,
        columns: ['POST_ID', 'USER_ID', 'TOPIC', 'TONE', 'HASHTAGS', 'CREATED_AT'],
        rows: db.posts.map((p) => ({
          POST_ID: p.POST_ID,
          USER_ID: p.USER_ID,
          TOPIC: p.TOPIC,
          TONE: p.TONE,
          CONTENT_PREVIEW: p.CONTENT.substring(0, 60) + '...',
          HASHTAGS: p.HASHTAGS,
          CREATED_AT: p.CREATED_AT,
        })),
      },
      TEMPLATES: {
        count: db.templates.length,
        columns: ['TEMPLATE_ID', 'NAME', 'CATEGORY', 'SAMPLE_TOPIC'],
        rows: db.templates.map((t) => ({
          TEMPLATE_ID: t.TEMPLATE_ID,
          NAME: t.NAME,
          CATEGORY: t.CATEGORY,
          SAMPLE_TOPIC: t.SAMPLE_TOPIC,
        })),
      },
      AI_REQUESTS: {
        count: db.ai_requests.length,
        columns: ['REQUEST_ID', 'USER_ID', 'MODEL_NAME', 'TOKENS_USED', 'CREATED_AT'],
        rows: db.ai_requests.map((r) => ({
          REQUEST_ID: r.REQUEST_ID,
          USER_ID: r.USER_ID,
          MODEL_NAME: r.MODEL_NAME,
          TOKENS_USED: r.TOKENS_USED,
          CREATED_AT: r.CREATED_AT,
        })),
      },
    },
  });
});

// ----------------------------------------------------
// 7. ANALYTICS ENDPOINT (/api/analytics)
// ----------------------------------------------------

app.get('/api/analytics', (req, res) => {
  const totalTokens = db.ai_requests.reduce((acc, curr) => acc + (curr.TOKENS_USED || 0), 0);
  const toneMap: Record<string, number> = {};
  db.posts.forEach((p) => {
    toneMap[p.TONE] = (toneMap[p.TONE] || 0) + 1;
  });

  const popularTones = Object.entries(toneMap).map(([tone, count]) => ({ tone, count }));
  popularTones.sort((a, b) => b.count - a.count);

  const totalChars = db.posts.reduce((acc, p) => acc + (p.CONTENT ? p.CONTENT.length : 0), 0);
  const averageLength = db.posts.length > 0 ? Math.round(totalChars / db.posts.length) : 0;

  res.json({
    totalPostsGenerated: db.posts.length,
    totalTokensUsed: totalTokens,
    popularTones,
    recentRequests: db.ai_requests.slice(0, 10).map((r) => ({
      id: r.REQUEST_ID,
      userId: r.USER_ID,
      promptText: r.PROMPT_TEXT,
      responseText: r.RESPONSE_TEXT,
      modelName: r.MODEL_NAME,
      tokensUsed: r.TOKENS_USED,
      createdAt: r.CREATED_AT,
    })),
    averageLength,
  });
});

// ----------------------------------------------------
// 8. VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinkedIn Post Generator server running on http://0.0.0.0:${PORT}`);
  });
}

start();
