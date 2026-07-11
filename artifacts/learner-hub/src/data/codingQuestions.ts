export interface CodingQuestion {
  id: string;
  title: string;
  difficulty: "Easy";
  description: string;
  inputTestCase: string;
  expectedOutput: string;
  starterCode: string;
}

export const easyCodingQuestions: CodingQuestion[] = [
  {
    id: "coding-easy-1",
    title: "Add Two Numbers",
    difficulty: "Easy",
    description: "Read two integers from input and print their sum.",
    inputTestCase: "5 7",
    expectedOutput: "12",
    starterCode: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\n// Write your code here\n",
  },
  {
    id: "coding-easy-2",
    title: "Find the Largest Number",
    difficulty: "Easy",
    description: "Read three integers and print the largest one.",
    inputTestCase: "12 8 19",
    expectedOutput: "19",
    starterCode: "const fs = require('fs');\nconst nums = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\n// Write your code here\n",
  },
  {
    id: "coding-easy-3",
    title: "Even or Odd",
    difficulty: "Easy",
    description: "Read one integer and print Even if it is even, otherwise print Odd.",
    inputTestCase: "14",
    expectedOutput: "Even",
    starterCode: "const fs = require('fs');\nconst n = Number(fs.readFileSync(0, 'utf8').trim());\n\n// Write your code here\n",
  },
  {
    id: "coding-easy-4",
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Read a string and print it in reverse order.",
    inputTestCase: "react",
    expectedOutput: "tcaer",
    starterCode: "const fs = require('fs');\nconst text = fs.readFileSync(0, 'utf8').trim();\n\n// Write your code here\n",
  },
  {
    id: "coding-easy-5",
    title: "Count Vowels",
    difficulty: "Easy",
    description: "Read a string and print the number of vowels in it.",
    inputTestCase: "education",
    expectedOutput: "5",
    starterCode: "const fs = require('fs');\nconst text = fs.readFileSync(0, 'utf8').trim().toLowerCase();\n\n// Write your code here\n",
  },
];
