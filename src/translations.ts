export interface TranslationContent {
  navbar: {
    tagline: string;
    signIn: string;
    createPost: string;
    switchLang: string;
  };
  hero: {
    badges: string[];
    headlinePrefix: string;
    headlineHighlight: string;
  };
  editor: {
    generateWithAI: string;
    generateImage: string;
    clearText: string;
    undo: string;
    redo: string;
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
    bulletList: string;
    numberedList: string;
    addSpacing: string;
    aiTouchUps: string;
    attachImage: string;
    snippets: string;
    saveDraft: string;
    loadDrafts: string;
    placeholder: string;
    charLabel: string;
    wordsLabel: string;
    sentencesLabel: string;
    readingTimeLabel: string;
    sec: string;
    aiCommandPlaceholder: string;
    editPostBtn: string;
    copyBtn: string;
    copiedBtn: string;
    postLinkedInBtn: string;
    previewTitle: string;
    desktop: string;
    mobile: string;
    sampleBio: string;
    timeAgo: string;
    commentsCount: string;
    repostsCount: string;
    likeBtn: string;
    commentBtn: string;
    shareBtn: string;
    sendBtn: string;
  };
  features: {
    introTitle: string;
    introDesc: string;
    featuresTitle: string;
    featuresSubtitle: string;
    items: Array<{ icon: string; title: string; desc: string }>;
    howToTitle: string;
    howToSteps: Array<{ title: string; desc: string }>;
  };
  moreTools: {
    sectionTitle: string;
    useForFree: string;
    tools: Array<{ name: string; bnName: string }>;
  };
  footer: {
    heroHeadline: string;
    createBtn: string;
    agreeText: string;
    terms: string;
    privacy: string;
    pages: string;
    home: string;
    about: string;
    termsPrivacy: string;
    language: string;
    freeTools: string;
    copyright: string;
    termsOfService: string;
    support: string;
  };
}

export const translations: Record<'en' | 'bn', TranslationContent> = {
  en: {
    navbar: {
      tagline: 'Create Stunning Posts in Seconds',
      signIn: 'Sign In',
      createPost: 'Create JaduMamah',
      switchLang: 'Switch Language',
    },
    hero: {
      badges: ['FREE TOOL', 'SOCIAL MEDIA', 'LINKEDIN', 'AI', 'POST GENERATOR', 'POST MAKER'],
      headlinePrefix: 'Free LinkedIn ',
      headlineHighlight: 'Post Generator',
    },
    editor: {
      generateWithAI: 'Generate with AI...',
      generateImage: 'Generate Image',
      clearText: 'Clear Text',
      undo: 'Undo',
      redo: 'Redo',
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strikethrough: 'Strikethrough',
      bulletList: 'Bullet List',
      numberedList: 'Numbered List',
      addSpacing: 'Add Spacing',
      aiTouchUps: 'AI Touch-Ups',
      attachImage: 'Attach Image',
      snippets: 'Snippets...',
      saveDraft: 'Save',
      loadDrafts: 'Load...',
      placeholder: 'Write Your Post...',
      charLabel: 'Characters',
      wordsLabel: 'Words',
      sentencesLabel: 'Sentences',
      readingTimeLabel: 'Reading Time',
      sec: 'sec',
      aiCommandPlaceholder: "Ask AI what to change, e.g., 'add 2 more points to the list'",
      editPostBtn: 'Edit Post',
      copyBtn: 'Copy to Clipboard',
      copiedBtn: 'Copied to Clipboard!',
      postLinkedInBtn: 'Post On LinkedIn',
      previewTitle: 'Post Preview',
      desktop: 'Desktop',
      mobile: 'Mobile',
      sampleBio: 'Founder at JaduMamah, the first AI Carousel Generator ✨',
      timeAgo: '12h',
      commentsCount: '27 comments',
      repostsCount: '4 reposts',
      likeBtn: 'Like',
      commentBtn: 'Comment',
      shareBtn: 'Share',
      sendBtn: 'Send',
    },
    features: {
      introTitle: 'Introducing the Best Free LinkedIn AI Post Generator',
      introDesc:
        'Our LinkedIn AI Post Editor and Generator is designed to help professionals craft and enhance their posts with ease. This tool supports advanced styling and format editing, along with impressive AI features.',
      featuresTitle: 'AI Post Writing Assistant Features',
      featuresSubtitle:
        "Enhance your post's quality and engagement with our AI writing assistant, offering capabilities to:",
      items: [
        {
          icon: '🤖',
          title: 'Advanced AI Generation',
          desc: 'Generate posts directly from a Topic, Text, URLs, YouTube videos, or PDF documents.',
        },
        {
          icon: '📈',
          title: 'Over 130 Viral Templates',
          desc: 'Unlock access to +150 post templates, designed specifically to go viral on LinkedIn.',
        },
        {
          icon: '📌',
          title: 'Reference Favorite Posts',
          desc: 'Paste posts from top creators into the "Template" field and mirror their format and tone precisely.',
        },
        {
          icon: '✍️',
          title: 'Custom AI Instructions',
          desc: 'Dictate specific instructions to the AI to match your unique style. Save them as default settings, for consistent future posts.',
        },
        {
          icon: '🖼️',
          title: 'AI Image Generator',
          desc: 'Enhance post reach by 15-20% with AI-generated images. Generate images to complement your posts with just one click.',
        },
        {
          icon: '👁️',
          title: 'Preview Posts',
          desc: 'Ensure your content looks perfect before going live. Preview and make adjustments in real time.',
        },
        {
          icon: '🔧',
          title: 'Post Formatting Tools',
          desc: 'Apply bold, italics, underline, strikethrough, and more to make your content stand out.',
        },
        {
          icon: '💬',
          title: 'AI Writing Assistant',
          desc: 'Select text for the AI to adjust length, rephrase, or enrich with emojis, hashtags, and more.',
        },
        {
          icon: '🌐',
          title: '+100 Languages',
          desc: 'Expand your reach with support for Español, Français, বাংলা, and many more.',
        },
        {
          icon: '🔗',
          title: 'Posting to LinkedIn',
          desc: 'Seamlessly publish your posts to LinkedIn without leaving the editor. No extra steps, just instant sharing.',
        },
        {
          icon: '📌',
          title: 'Snippets Manager',
          desc: 'Save and reuse your favorite text snippets to streamline your posting process and maintain consistency.',
        },
        {
          icon: '💾',
          title: 'Drafts & Autosave',
          desc: 'Never lose your work. Save drafts and pick up right where you left off.',
        },
      ],
      howToTitle: 'How to Use the Free LinkedIn Post Generator',
      howToSteps: [
        {
          title: 'Input Your Text',
          desc: 'In the input field, type a topic or a brief text that you want your post to cover. This guides the AI in crafting content that aligns with your intended message.',
        },
        {
          title: 'Select a Template',
          desc: 'Explore our collection of LinkedIn Post Templates, each designed for different professional scenarios. Select one that matches the message you want to convey.',
        },
        {
          title: 'Generate Your Post',
          desc: 'With your inputs ready, click the "Generate" button. The AI will use your text, style preferences, and chosen template to create a tailored post.',
        },
        {
          title: 'Personalization and Edits',
          desc: 'Review the post and edit it to ensure it mirrors your unique voice. Adjust the format, and use the AI Writing Assistant to adjust length and rephrase sections.',
        },
        {
          title: 'Preview and Finalize',
          desc: 'Use the preview feature to check how your post appears on desktop and mobile formats. Make final adjustments to enhance clarity.',
        },
        {
          title: 'Share Your Post',
          desc: "Once you're satisfied with the final version, copy your post to the clipboard and share it on your LinkedIn profile with 1 click.",
        },
      ],
    },
    moreTools: {
      sectionTitle: 'More Free Tools',
      useForFree: 'Use for Free',
      tools: [
        { name: 'Organize PDF Pages', bnName: 'পিডিএফ পেজ সাজান' },
        { name: 'Instagram Caption Generator', bnName: 'ইনস্টাগ্রাম ক্যাপশন জেনারেটর' },
        { name: 'Facebook Caption Generator', bnName: 'ফেসবুক ক্যাপশন জেনারেটর' },
        { name: 'Extract Pages from PDF', bnName: 'পিডিএফ থেকে পেজ এক্সট্র্যাক্ট' },
        { name: 'LinkedIn QR Code Generator', bnName: 'লিঙ্কডইন কিউআর কোড জেনারেটর' },
        { name: 'Smart Bookmark Tool for LinkedIn Posts', bnName: 'লিঙ্কডইন পোস্ট বুকমার্ক টুল' },
        { name: 'Resume Maker & CV Builder', bnName: 'রিজিউম ও সিভি বিল্ডার' },
        { name: 'OCR PDF to Text', bnName: 'ওসিআর পিডিএফ টু টেক্সট' },
        { name: 'Free Video Resume Maker', bnName: 'ভিডিও রিজিউম মেকার' },
        { name: 'LinkedIn Cheat Sheet Generator', bnName: 'লিঙ্কডইন চিট শিট জেনারেটর' },
        { name: 'LinkedIn Banner Maker', bnName: 'লিঙ্কডইন ব্যানার মেকার' },
        { name: 'Font Pairing Generator', bnName: 'ফন্ট পেয়ারিং জেনারেটর' },
        { name: 'LinkedIn Quote Card Generator', bnName: 'লিঙ্কডইন কোট কার্ড জেনারেটর' },
        { name: 'Bluesky Text Formatter', bnName: 'ব্লুস্কাই টেক্সট ফরম্যাটার' },
        { name: 'YouTube Safe Zone Checker', bnName: 'ইউটিউব সেফ জোন চেকার' },
        { name: 'All-in-One Social Media Profile Preview Tool', bnName: 'সোশ্যাল মিডিয়া প্রোফাইল প্রিভিউ' },
        { name: 'Repair PDF File', bnName: 'পিডিএফ ফাইল মেরামত' },
        { name: 'Scan to PDF', bnName: 'স্ক্যান টু পিডিএফ' },
        { name: 'LinkedIn Post Generator', bnName: 'লিঙ্কডইন পোস্ট জেনারেটর' },
        { name: 'Split PDF File', bnName: 'পিডিএফ স্প্লিট টুল' },
        { name: 'Color Palette Generator', bnName: 'কালার প্যালেট জেনারেটর' },
        { name: 'Instagram Feed Planner', bnName: 'ইনস্টাগ্রাম ফিড প্ল্যানার' },
        { name: 'Merge PDF Files', bnName: 'পিডিএফ মার্জ টুল' },
        { name: 'LinkedIn Text Staircase Generator', bnName: 'লিঙ্কডইন স্টেয়ারকেস জেনারেটর' },
        { name: 'LinkedIn Post Preview', bnName: 'লিঙ্কডইন পোস্ট প্রিভিউ' },
        { name: 'LinkedIn Summary Generator', bnName: 'লিঙ্কডইন সামারি জেনারেটর' },
        { name: 'LinkedIn JaduMamah to Video Converter', bnName: 'লিঙ্কডইন পোস্ট টু ভিডিও' },
        { name: 'Instagram Text Format Editor', bnName: 'ইনস্টাগ্রাম টেক্সট ফরম্যাট এডিটর' },
      ],
    },
    footer: {
      heroHeadline: 'A beautiful day begins with JaduMamah. ☀️',
      createBtn: 'Create JaduMamah',
      agreeText: "By pressing 'Create JaduMamah' you agree to our",
      terms: 'Terms',
      privacy: 'Privacy Policy',
      pages: 'Pages',
      home: 'Home',
      about: 'About',
      termsPrivacy: 'Terms & Privacy Policy',
      language: 'Language',
      freeTools: 'Free Tools',
      copyright: '© 2026 JaduMamah. All rights reserved.',
      termsOfService: 'Terms of Service',
      support: 'Support',
    },
  },
  bn: {
    navbar: {
      tagline: 'কয়েক সেকেন্ডে আকর্ষণীয় পোস্ট তৈরি করুন',
      signIn: 'লগইন',
      createPost: 'পোস্ট তৈরি করুন',
      switchLang: 'ভাষা পরিবর্তন করুন',
    },
    hero: {
      badges: ['ফ্রি টুল', 'সোশ্যাল মিডিয়া', 'লিঙ্কডইন', 'এআই', 'পোস্ট জেনারেটর', 'পোস্ট মেকার'],
      headlinePrefix: 'ফ্রি লিঙ্কডইন ',
      headlineHighlight: 'পোস্ট জেনারেটর',
    },
    editor: {
      generateWithAI: 'AI দিয়ে তৈরি করুন...',
      generateImage: 'ছবি তৈরি করুন',
      clearText: 'মুছে ফেলুন',
      undo: 'আগের অবস্থা',
      redo: 'পুনরাবৃত্তি',
      bold: 'বোল্ড',
      italic: 'ইটালিক',
      underline: 'আন্ডারলাইন',
      strikethrough: 'স্ট্রাইক-থ্রু',
      bulletList: 'বুলেট লিস্ট',
      numberedList: 'নম্বর লিস্ট',
      addSpacing: 'ফাঁকা জায়গা যোগ করুন',
      aiTouchUps: 'AI টাচ-আপ',
      attachImage: 'ছবি যুক্ত করুন',
      snippets: 'স্নিপেটস...',
      saveDraft: 'সংরক্ষণ',
      loadDrafts: 'ড্রাফটস...',
      placeholder: 'আপনার লিঙ্কডইন পোস্ট এখানে লিখুন...',
      charLabel: 'অক্ষর',
      wordsLabel: 'শব্দ',
      sentencesLabel: 'বাক্য',
      readingTimeLabel: 'পড়ার সময়',
      sec: 'সেকেন্ড',
      aiCommandPlaceholder: "AI-কে বলুন কী পরিবর্তন করতে চান, যেমন: 'আরও ২টি পয়েন্ট যোগ করো'",
      editPostBtn: 'পোস্ট এডিট করুন',
      copyBtn: 'ক্লিপবোর্ডে কপি করুন',
      copiedBtn: 'কপি করা হয়েছে!',
      postLinkedInBtn: 'লিঙ্কডইনে পোস্ট করুন',
      previewTitle: 'পোস্ট প্রিভিউ',
      desktop: 'ডেস্কটপ',
      mobile: 'মোবাইল',
      sampleBio: 'ফাউন্ডার, জাদুমামা — এআই পোস্ট ও ক্যারোসেল মেকার ✨',
      timeAgo: '১২ঘন্টা',
      commentsCount: '২৭টি মন্তব্য',
      repostsCount: '৪টি শেয়ার',
      likeBtn: 'লাইক',
      commentBtn: 'মন্তব্য',
      shareBtn: 'শেয়ার',
      sendBtn: 'পাঠান',
    },
    features: {
      introTitle: 'সেরা ফ্রি লিঙ্কডইন এআই পোস্ট জেনারেটর',
      introDesc:
        'আমাদের লিঙ্কডইন এআই পোস্ট এডিটর এবং জেনারেটর প্রফেশনালদের সহজে দারুণ পোস্ট তৈরি ও সাজাতে সাহায্য করে। এতে আধুনিক স্টাইলিং ও ফরম্যাটিংয়ের পাশাপাশি শক্তিশালী এআই ফিচার রয়েছে।',
      featuresTitle: 'এআই পোস্ট রাইটিং অ্যাসিস্ট্যান্টের সুবিধাসমূহ',
      featuresSubtitle:
        'আমাদের এআই রাইটিং অ্যাসিস্ট্যান্টের মাধ্যমে আপনার পোস্টের মান এবং এনগেজমেন্ট কয়েক গুণ বৃদ্ধি করুন:',
      items: [
        {
          icon: '🤖',
          title: 'উন্নত এআই জেনারেশন',
          desc: 'যেকোনো টপিক, টেক্সট, লিঙ্ক বা ডকুমেন্ট থেকে সরাসরি আকর্ষণীয় পোস্ট তৈরি করুন।',
        },
        {
          icon: '📈',
          title: '১৩০+ ভাইরাল টেমপ্লেট',
          desc: 'লিঙ্কডইনে ভাইরাল হওয়ার জন্য বিশেষভাবে ডিজাইন করা ১৫০+ টেমপ্লেট ব্যবহার করুন।',
        },
        {
          icon: '📌',
          title: 'পছন্দের পোস্ট রেফারেন্স',
          desc: 'শীর্ষ নির্মাতাদের সফল পোস্ট পেস্ট করে তাদের লেখার ধরন ও টোন অনুসরণ করুন।',
        },
        {
          icon: '✍️',
          title: 'কাস্টম এআই নির্দেশনা',
          desc: 'আপনার নিজস্ব লেখার ধরন বজায় রাখতে এআই-কে নির্দিষ্ট নির্দেশনা দিন ও সেভ রাখুন।',
        },
        {
          icon: '🖼️',
          title: 'এআই ইমেজ জেনারেটর',
          desc: 'মাত্র এক ক্লিকে পোস্টের উপযোগী আকর্ষণীয় ছবি তৈরি করে পৌঁছান আরও মানুষের কাছে।',
        },
        {
          icon: '👁️',
          title: 'রিয়েল-টাইম প্রিভিউ',
          desc: 'পোস্ট প্রকাশের আগেই মোবাইল ও ডেস্কটপে কেমন দেখাবে তা তাৎক্ষণিক যাচাই করুন।',
        },
        {
          icon: '🔧',
          title: 'পোস্ট ফরম্যাটিং টুলস',
          desc: 'বোল্ড, ইটালিক, আন্ডারলাইন এবং লিস্টের মাধ্যমে আপনার পোস্টকে নজরকাড়া করুন।',
        },
        {
          icon: '💬',
          title: 'এআই রাইটিং অ্যাসিস্ট্যান্ট',
          desc: 'টেক্সট সিলেক্ট করে দৈর্ঘ্য কমান/বাড়ান, রিফ্রেজ করুন অথবা হ্যাশট্যাগ যুক্ত করুন।',
        },
        {
          icon: '🌐',
          title: '১০০+ ভাষা সাপোর্ট',
          desc: 'বাংলা, ইংরেজি, স্প্যানিশ সহ বিশ্বের বিভিন্ন ভাষায় সহজে পোস্ট তৈরি করুন।',
        },
        {
          icon: '🔗',
          title: 'সরাসরি লিঙ্কডইনে প্রকাশ',
          desc: 'কোনো ঝামেলা ছাড়াই এক ক্লিকে এডিটর থেকেই লিঙ্কডইনে পোস্ট শেয়ার করুন।',
        },
        {
          icon: '📌',
          title: 'স্নিপেটস ম্যানেজার',
          desc: 'আপনার পছন্দের হুক, সিটিএ ও সাইন-অফ সংরক্ষণ করে বারবার সহজে ব্যবহার করুন।',
        },
        {
          icon: '💾',
          title: 'ড্রাফটস ও অটোসেভ',
          desc: 'কাজের কোনো অগ্রগতি হারাবেন না। ড্রাফট হিসেবে সেভ করে যেকোনো সময় কাজ শুরু করুন।',
        },
      ],
      howToTitle: 'কীভাবে ফ্রি লিঙ্কডইন পোস্ট জেনারেটর ব্যবহার করবেন',
      howToSteps: [
        {
          title: 'আপনার টপিক বা টেক্সট লিখুন',
          desc: 'ইনপুট বক্সে আপনার পছন্দের টপিক বা সংক্ষিপ্ত বিষয় লিখুন যাতে এআই আপনার উদ্দেশ্য অনুযায়ী পোস্ট তৈরি করতে পারে।',
        },
        {
          title: 'একটি টেমপ্লেট বেছে নিন',
          desc: 'আপনার বার্তার সাথে মানানসই পেশাদার লিঙ্কডইন টেমপ্লেট সংগ্রহ থেকে একটি বেছে নিন।',
        },
        {
          title: 'পোস্ট তৈরি করুন',
          desc: 'সবকিছু প্রস্তুত হলে "Generate" বাটনে ক্লিক করুন। এআই আপনার পছন্দের স্টাইলে আকর্ষণীয় পোস্ট সাজিয়ে দেবে।',
        },
        {
          title: 'ব্যক্তিগতকরণ ও সম্পাদনা',
          desc: 'পোস্টটি পড়ে নিজের পছন্দমতো ফরম্যাট ঠিক করুন এবং এআই অ্যাসিস্ট্যান্ট দিয়ে প্রয়োজনীয় পরিবর্তন আনুন।',
        },
        {
          title: 'প্রিভিউ দেখে চূড়ান্ত করুন',
          desc: 'মোবাইল ও ডেস্কটপ ভিউতে পোস্টটি কেমন দেখাবে তা পরীক্ষা করে চূড়ান্ত রূপ দিন।',
        },
        {
          title: 'লিঙ্কডইনে পোস্ট করুন',
          desc: 'চূড়ান্ত পোস্টটি ক্লিপবোর্ডে কপি করুন অথবা ১-ক্লিকে সরাসরি আপনার লিঙ্কডইন প্রোফাইলে শেয়ার করুন।',
        },
      ],
    },
    moreTools: {
      sectionTitle: 'আরও ফ্রি টুলস',
      useForFree: 'ফ্রিতে ব্যবহার করুন',
      tools: [
        { name: 'Organize PDF Pages', bnName: 'পিডিএফ পেজ সাজান' },
        { name: 'Instagram Caption Generator', bnName: 'ইনস্টাগ্রাম ক্যাপশন জেনারেটর' },
        { name: 'Facebook Caption Generator', bnName: 'ফেসবুক ক্যাপশন জেনারেটর' },
        { name: 'Extract Pages from PDF', bnName: 'পিডিএফ থেকে পেজ এক্সট্র্যাক্ট' },
        { name: 'LinkedIn QR Code Generator', bnName: 'লিঙ্কডইন কিউআর কোড জেনারেটর' },
        { name: 'Smart Bookmark Tool for LinkedIn Posts', bnName: 'লিঙ্কডইন পোস্ট বুকমার্ক টুল' },
        { name: 'Resume Maker & CV Builder', bnName: 'রিজিউম ও সিভি বিল্ডার' },
        { name: 'OCR PDF to Text', bnName: 'ওসিআর পিডিএফ টু টেক্সট' },
        { name: 'Free Video Resume Maker', bnName: 'ভিডিও রিজিউম মেকার' },
        { name: 'LinkedIn Cheat Sheet Generator', bnName: 'লিঙ্কডইন চিট শিট জেনারেটর' },
        { name: 'LinkedIn Banner Maker', bnName: 'লিঙ্কডইন ব্যানার মেকার' },
        { name: 'Font Pairing Generator', bnName: 'ফন্ট পেয়ারিং জেনারেটর' },
        { name: 'LinkedIn Quote Card Generator', bnName: 'লিঙ্কডইন কোট কার্ড জেনারেটর' },
        { name: 'Bluesky Text Formatter', bnName: 'ব্লুস্কাই টেক্সট ফরম্যাটার' },
        { name: 'YouTube Safe Zone Checker', bnName: 'ইউটিউব সেফ জোন চেকার' },
        { name: 'All-in-One Social Media Profile Preview Tool', bnName: 'সোশ্যাল মিডিয়া প্রোফাইল প্রিভিউ' },
        { name: 'Repair PDF File', bnName: 'পিডিএফ ফাইল মেরামত' },
        { name: 'Scan to PDF', bnName: 'স্ক্যান টু পিডিএফ' },
        { name: 'LinkedIn Post Generator', bnName: 'লিঙ্কডইন পোস্ট জেনারেটর' },
        { name: 'Split PDF File', bnName: 'পিডিএফ স্প্লিট টুল' },
        { name: 'Color Palette Generator', bnName: 'কালার প্যালেট জেনারেটর' },
        { name: 'Instagram Feed Planner', bnName: 'ইনস্টাগ্রাম ফিড প্ল্যানার' },
        { name: 'Merge PDF Files', bnName: 'পিডিএফ মার্জ টুল' },
        { name: 'LinkedIn Text Staircase Generator', bnName: 'লিঙ্কডইন স্টেয়ারকেস জেনারেটর' },
        { name: 'LinkedIn Post Preview', bnName: 'লিঙ্কডইন পোস্ট প্রিভিউ' },
        { name: 'LinkedIn Summary Generator', bnName: 'লিঙ্কডইন সামারি জেনারেটর' },
        { name: 'LinkedIn JaduMamah to Video Converter', bnName: 'লিঙ্কডইন পোস্ট টু ভিডিও' },
        { name: 'Instagram Text Format Editor', bnName: 'ইনস্টাগ্রাম টেক্সট ফরম্যাট এডিটর' },
      ],
    },
    footer: {
      heroHeadline: 'একটি সুন্দর দিনের শুরু হোক জাদুমামার সাথে। ☀️',
      createBtn: 'পোস্ট তৈরি করুন',
      agreeText: "'পোস্ট তৈরি করুন' বাটনে চাপ দিয়ে আপনি আমাদের সাথে সম্মত হচ্ছেন",
      terms: 'শর্তাবলী',
      privacy: 'গোপনীয়তা নীতি',
      pages: 'পেজসমূহ',
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      termsPrivacy: 'শর্তাবলী ও গোপনীয়তা নীতি',
      language: 'ভাষা (Language)',
      freeTools: 'ফ্রি টুলস',
      copyright: '© ২০২৬ JaduMamah. সর্বস্বত্ব সংরক্ষিত।',
      termsOfService: 'সেবার শর্তাবলী',
      support: 'সহায়তা',
    },
  },
};
