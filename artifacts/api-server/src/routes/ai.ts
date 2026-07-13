import { Router, type Request, type Response } from "express";
import axios from "axios";

const router = Router();

// Mock bank of AI generated questions for fallback
const mockMcqs: Record<string, Array<{ questionText: string; options: string[]; correctAnswer: string }>> = {
  "GK Question": [
    { questionText: "Who is known as the father of Indian Space Program?", options: ["Homi Bhabha", "Vikram Sarabhai", "APJ Abdul Kalam", "C.V. Raman"], correctAnswer: "Vikram Sarabhai" },
    { questionText: "Which is the largest fresh water lake in India?", options: ["Wular Lake", "Chilika Lake", "Vembanad Lake", "Dal Lake"], correctAnswer: "Wular Lake" },
  ],
  "Quantitative Aptitude": [
    { questionText: "A train moves at 80 km/hr. How much distance does it cover in 15 minutes?", options: ["15 km", "20 km", "25 km", "30 km"], correctAnswer: "20 km" },
    { questionText: "What is the simple interest on Rs. 5000 for 2 years at 10% per annum?", options: ["Rs. 500", "Rs. 1000", "Rs. 1500", "Rs. 2000"], correctAnswer: "Rs. 1000" },
  ],
  "Reasoning": [
    { questionText: "If A = 2, B = 4, C = 6, what is the value of DOG?", options: ["52", "54", "56", "58"], correctAnswer: "52" },
    { questionText: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", options: ["1/3", "1/8", "2/8", "1/16"], correctAnswer: "1/8" },
  ],
  "English": [
    { questionText: "Choose the synonym for 'ABANDON':", options: ["Retain", "Keep", "Forsake", "Adopt"], correctAnswer: "Forsake" },
    { questionText: "Identify the correctly spelled word:", options: ["Committee", "Comitte", "Commitee", "Comitee"], correctAnswer: "Committee" },
  ],
};

const mockTimelineSummaries: string[] = [
  "00:00 - Introduction & Course Syllabus Overview",
  "05:30 - Core Concept Definition & Practical Examples",
  "12:45 - Key Syntax Explanation & Coding Walkthrough",
  "22:15 - Common Pitfalls & Debugging Techniques",
  "29:50 - Summary of Today's Lecture & Next Steps homework assignment details",
];

// POST /api/ai/generate-questions
router.post("/generate-questions", async (req: Request, res: Response) => {
  const { subject, count = 5 } = req.body;

  if (!subject) {
    return res.status(400).json({ message: "subject is required." });
  }

  // Fallback MCQ generation
  const baseQuestions = mockMcqs[subject] || mockMcqs["GK Question"];
  const generated = [];

  for (let i = 0; i < Number(count); i++) {
    const template = baseQuestions[i % baseQuestions.length];
    generated.push({
      id: Math.floor(Math.random() * 10000) + 1000,
      questionText: `${template.questionText} (AI Gen #${i + 1})`,
      options: [...template.options],
      correctAnswer: template.correctAnswer,
      category: subject,
    });
  }

  return res.json({ questions: generated });
});

// POST /api/ai/summarize-video
router.post("/summarize-video", async (req: Request, res: Response) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ message: "videoUrl is required." });
  }

  let videoTitle = "Lecture Video Resource";
  let channel = "SGSU Faculty Library";

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    const response = await axios.get(oembedUrl, { timeout: 3000 });
    if (response.data) {
      if (response.data.title) videoTitle = response.data.title;
      if (response.data.author_name) channel = response.data.author_name;
    }
  } catch (error) {
    // Fallback if offline
  }

  const titleLower = videoTitle.toLowerCase();
  let summaryPoints: string[] = [];
  let timelinePoints: string[] = [];

  if (titleLower.includes("html")) {
    summaryPoints = [
      `A complete introduction to HTML tags and skeleton structure shown in "${videoTitle}".`,
      "Understanding absolute/relative links, layout tags, and embedding assets.",
      "How to code forms, inputs, buttons, and responsive inputs.",
      "Best practices for semantic HTML and building accessible page headers.",
    ];
    timelinePoints = [
      "00:00 - Introduction to HTML structures",
      "03:40 - Writing skeleton tags and page layouts",
      "10:15 - Coding hyperlinks, input boxes, and list items",
      "18:50 - Reviewing homework exercises on HTML structures",
    ];
  } else if (titleLower.includes("css") || titleLower.includes("style")) {
    summaryPoints = [
      `A detailed breakdown of basic styling rules and layout definitions in "${videoTitle}".`,
      "Mastering margins, paddings, borders, box-sizing, and style priorities.",
      "Practical demonstration of Flexbox: containers, axis direction, and aligning elements.",
      "Tips for responsive styles, clean variables, and styling components.",
    ];
    timelinePoints = [
      "00:00 - Introduction & CSS rules",
      "04:15 - Understanding margins, padding, and box sizes",
      "12:30 - Live Coding Flexbox grids in Chrome inspector",
      "22:10 - Next steps: writing modular stylesheets",
    ];
  } else if (titleLower.includes("javascript") || titleLower.includes("js")) {
    summaryPoints = [
      `An essential overview of variables, functions, and scopes shown in "${videoTitle}".`,
      "How to write event handlers, select elements, and manipulate the browser DOM.",
      "Managing array loops, map statements, and parsing data objects.",
      "Reviewing common runtime errors and browser console testing tips.",
    ];
    timelinePoints = [
      "00:00 - Introduction to JS concepts",
      "03:50 - Writing variables, loops, and conditions",
      "09:15 - DOM Selection, adding list items dynamically",
      "16:45 - Summary of console test cases and exercises",
    ];
  } else {
    // Generic dynamic fallback using the actual videoTitle words!
    const cleanTitle = videoTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    const words = cleanTitle.split(" ").filter(w => w.length > 3);
    const keyWord1 = words[0] || "Foundational";
    const keyWord2 = words[1] || "Core Theory";
    const keyWord3 = words[2] || "Practical Lab";

    summaryPoints = [
      `Walkthrough of the initial setups and logic design shown in "${videoTitle}".`,
      `In-depth conceptual overview of ${keyWord1} syntax and core operations.`,
      `Practical live demonstration of ${keyWord2} and key system features.`,
      `Guidelines for verifying code, testing ${keyWord3}, and troubleshooting errors.`,
      `Course announcements, homework assignments, and mentor feedback instructions from ${channel}.`,
    ];
    timelinePoints = [
      `00:00 - Introduction to ${keyWord1} syllabus`,
      `04:30 - Detailed discussion on ${keyWord2} basics`,
      `11:15 - Live walkthrough coding of "${videoTitle}" features`,
      `21:50 - Staging verification, testing ${keyWord3}, and next lessons`,
    ];
  }

  return res.json({
    summary: summaryPoints,
    timeline: timelinePoints,
  });
});

export default router;
