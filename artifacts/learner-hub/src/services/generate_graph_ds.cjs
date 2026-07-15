const fs = require('fs');

const questions = [];
let qId = 1;

const pythonStarter = `import sys\nimport numpy as np\nimport pandas as pd\n\ndef solve(input_data):\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    input_data = sys.stdin.read().strip()\n    print(solve(input_data))`;

// 1. 25 Linear Regression Questions (Top priority)
for (let i = 1; i <= 25; i++) {
  questions.push({
    id: `graph-lr-${i}`,
    title: `Linear Regression & Plotting ${i}: Fit and Predict`,
    difficulty: i > 15 ? "Hard" : "Medium",
    description: `Given a dataset of X and y values, fit a Simple Linear Regression model. Calculate the slope and intercept, and predict the value of y for a given X. (Note: In a real environment, you would use matplotlib to plot the graph of the regression line).`,
    inputTestCase: `${i}, ${i+2}, ${i+4}\n${i*2}, ${i*2+4}, ${i*2+8}`,
    expectedOutput: `Slope: 2.0\nIntercept: 0.0`,
    starterCode: `import sys\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\n# import matplotlib.pyplot as plt\n\ndef solve(input_data):\n    # Parse input, fit LinearRegression, and return slope/intercept\n    pass\n\nif __name__ == '__main__':\n    input_data = sys.stdin.read().strip()\n    print(solve(input_data))`
  });
}

// 2. 25 NumPy Questions
for (let i = 1; i <= 25; i++) {
  questions.push({
    id: `graph-numpy-${i}`,
    title: `NumPy Challenge ${i}: Array Operations`,
    difficulty: i > 15 ? "Hard" : (i > 5 ? "Medium" : "Easy"),
    description: `Given a list of numbers, convert them into a NumPy array, reshape them into a 2D matrix, and compute the sum of the elements along the main diagonal.`,
    inputTestCase: `1 2 3\n4 5 6\n7 8 9`,
    expectedOutput: `15`,
    starterCode: pythonStarter
  });
}

// 3. 25 Pandas Questions
for (let i = 1; i <= 25; i++) {
  questions.push({
    id: `graph-pandas-${i}`,
    title: `Pandas Challenge ${i}: Data Manipulation`,
    difficulty: i > 15 ? "Hard" : (i > 5 ? "Medium" : "Easy"),
    description: `Given CSV formatted text, load it into a Pandas DataFrame. Filter out rows where the 'Value' column is less than ${i * 10}, and compute the mean of the remaining values.`,
    inputTestCase: `ID,Value\n1,${i*5}\n2,${i*15}\n3,${i*20}`,
    expectedOutput: `${(i*15 + i*20)/2}`,
    starterCode: pythonStarter
  });
}

// 4. 25 Graph (Data Structures) Questions
const patterns = [
  { action: "Find the number of connected components", input: "5 4\n1 2\n2 3\n4 5\n1 3", output: "2" },
  { action: "Perform BFS traversal", input: "4 4\n1 2\n1 3\n2 4\n3 4", output: "1 2 3 4" },
  { action: "Perform DFS traversal", input: "4 4\n1 2\n1 3\n2 4\n3 4", output: "1 2 4 3" },
  { action: "Find the shortest path using BFS", input: "5 5\n1 2\n2 3\n3 5\n1 4\n4 5", output: "2" },
  { action: "Detect a cycle in an undirected graph", input: "3 3\n1 2\n2 3\n3 1", output: "True" }
];
const jsStarter = `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split('\\n');\n\n// Write your optimal graph solution here\nfunction solve(input) {\n  \n}\n\nconsole.log(solve(input));`;

for (let i = 1; i <= 25; i++) {
  const pattern = patterns[i % patterns.length];
  questions.push({
    id: `graph-ds-${i}`,
    title: `Graph Data Structure ${i}: ${pattern.action}`,
    difficulty: i > 15 ? "Hard" : "Medium",
    description: `Given an adjacency list representation of a graph, ${pattern.action.toLowerCase()}. Ensure your algorithm is optimized.`,
    inputTestCase: pattern.input,
    expectedOutput: pattern.output,
    starterCode: jsStarter
  });
}

fs.writeFileSync(
  "C:/Users/91626/OneDrive/Desktop/Learning-Hub/Learning-Hub/artifacts/learner-hub/src/services/graph_coding_questions.json", 
  JSON.stringify(questions, null, 2)
);
console.log("Successfully generated 100 graph-related coding questions.");
