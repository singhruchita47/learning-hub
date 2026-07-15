const fs = require("fs");

const topics = [
  "Array", "String", "Matrix", "Two Pointers", "Sliding Window",
  "HashMap", "Dynamic Programming", "Stack", "Queue", "Math",
  "Sorting", "Searching", "Greedy", "Backtracking", "Bit Manipulation"
];

const patterns = [
  { action: "Find the maximum subarray sum", input: "1 -2 3 4 -1 2 1 -5 4", output: "9" },
  { action: "Find the longest substring without repeating characters", input: "abcabcbb", output: "3" },
  { action: "Rotate the array by K steps", input: "1 2 3 4 5\\n2", output: "4 5 1 2 3" },
  { action: "Merge overlapping intervals", input: "1 3 2 6 8 10 15 18", output: "1 6 8 10 15 18" },
  { action: "Find the first missing positive integer", input: "3 4 -1 1", output: "2" },
  { action: "Find peak element", input: "1 2 3 1", output: "2" },
  { action: "Count palindromic substrings", input: "abc", output: "3" },
  { action: "Find Kth largest element", input: "3 2 1 5 6 4\\n2", output: "5" },
  { action: "Check if valid parenthesis", input: "()[]{}", output: "true" },
  { action: "Evaluate Reverse Polish Notation", input: "2 1 + 3 *", output: "9" },
];

const starterCode = `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split('\\n');\n\n// Write your optimal solution here\nfunction solve(input) {\n  \n}\n\nconsole.log(solve(input));`;

const questions = [];

for (let i = 1; i <= 150; i++) {
  const topic = topics[i % topics.length];
  const pattern = patterns[i % patterns.length];
  
  questions.push({
    id: `med-coding-${i}`,
    title: `${topic} Challenge: ${pattern.action.split(' ').slice(0, 3).join(' ')} ${i}`,
    difficulty: "Medium",
    description: `Given a dataset representing a ${topic.toLowerCase()} problem, ${pattern.action.toLowerCase()}. Ensure your algorithm is optimized for O(N) or O(N log N) time complexity.`,
    inputTestCase: pattern.input,
    expectedOutput: pattern.output,
    starterCode: starterCode
  });
}

fs.writeFileSync(
  "C:/Users/91626/OneDrive/Desktop/Learning-Hub/Learning-Hub/artifacts/learner-hub/src/services/coding_questions.json", 
  JSON.stringify(questions, null, 2)
);
console.log("Successfully generated 150 medium coding questions.");
