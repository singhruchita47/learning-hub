export type PracticeDifficulty = "Easy";

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: PracticeDifficulty;
  tags: string[];
  acceptance: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  stdin: string;
  expectedOutput: string;
}

export const codingPracticeProblems: PracticeProblem[] = [
  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Easy",
    tags: ["Input", "Math"],
    acceptance: "96.2%",
    description: "Read two integers from input and print their sum.",
    examples: [
      { input: "5 7", output: "12", explanation: "5 plus 7 is 12." },
      { input: "10 20", output: "30", explanation: "10 plus 20 is 30." },
    ],
    constraints: ["-100000 <= a, b <= 100000"],
    stdin: "5 7",
    expectedOutput: "12",
  },
  {
    id: "largest-number",
    title: "Find the Largest Number",
    difficulty: "Easy",
    tags: ["Conditionals", "Math"],
    acceptance: "94.8%",
    description: "Read three integers and print the largest one.",
    examples: [
      { input: "12 8 19", output: "19", explanation: "19 is greater than 12 and 8." },
      { input: "4 9 2", output: "9", explanation: "9 is the largest number." },
    ],
    constraints: ["-100000 <= a, b, c <= 100000"],
    stdin: "12 8 19",
    expectedOutput: "19",
  },
  {
    id: "even-or-odd",
    title: "Even or Odd",
    difficulty: "Easy",
    tags: ["Conditionals", "Modulo"],
    acceptance: "97.1%",
    description: "Read one integer and print Even if it is divisible by 2, otherwise print Odd.",
    examples: [
      { input: "14", output: "Even", explanation: "14 is divisible by 2." },
      { input: "9", output: "Odd", explanation: "9 is not divisible by 2." },
    ],
    constraints: ["-100000 <= n <= 100000"],
    stdin: "14",
    expectedOutput: "Even",
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    tags: ["String", "Loop"],
    acceptance: "92.5%",
    description: "Read a string and print it in reverse order.",
    examples: [
      { input: "react", output: "tcaer", explanation: "The characters are printed from last to first." },
      { input: "code", output: "edoc", explanation: "The reverse of code is edoc." },
    ],
    constraints: ["1 <= string length <= 100000"],
    stdin: "react",
    expectedOutput: "tcaer",
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    difficulty: "Easy",
    tags: ["String", "Counting"],
    acceptance: "90.4%",
    description: "Read a string and print the number of vowels in it. Count a, e, i, o, and u.",
    examples: [
      { input: "education", output: "5", explanation: "education contains e, u, a, i, o." },
      { input: "sky", output: "0", explanation: "sky has no a, e, i, o, or u." },
    ],
    constraints: ["1 <= string length <= 100000"],
    stdin: "education",
    expectedOutput: "5",
  },
];
