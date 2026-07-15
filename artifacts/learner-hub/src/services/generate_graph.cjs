const fs = require('fs');

const patterns = [
  { action: "Find the number of connected components", input: "5 4\n1 2\n2 3\n4 5\n1 3", output: "2" },
  { action: "Perform BFS traversal", input: "4 4\n1 2\n1 3\n2 4\n3 4", output: "1 2 3 4" },
  { action: "Perform DFS traversal", input: "4 4\n1 2\n1 3\n2 4\n3 4", output: "1 2 4 3" },
  { action: "Find the shortest path using BFS", input: "5 5\n1 2\n2 3\n3 5\n1 4\n4 5", output: "2" },
  { action: "Detect a cycle in an undirected graph", input: "3 3\n1 2\n2 3\n3 1", output: "True" },
  { action: "Detect a cycle in a directed graph", input: "4 4\n1 2\n2 3\n3 4\n4 2", output: "True" },
  { action: "Find Topological Sort of a DAG", input: "4 4\n1 2\n1 3\n2 4\n3 4", output: "1 2 3 4" },
  { action: "Find the minimum spanning tree weight", input: "3 3\n1 2 5\n2 3 10\n1 3 15", output: "15" },
  { action: "Find shortest path using Dijkstra", input: "3 3\n1 2 2\n2 3 3\n1 3 6", output: "5" },
  { action: "Check if graph is bipartite", input: "4 4\n1 2\n2 3\n3 4\n4 1", output: "True" }
];

const starterCode = `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split('\\n');\n\n// Write your optimal graph solution here\nfunction solve(input) {\n  \n}\n\nconsole.log(solve(input));`;

const questions = [];

for (let i = 1; i <= 50; i++) {
  const pattern = patterns[i % patterns.length];
  
  questions.push({
    id: `graph-coding-${i}`,
    title: `Graph Challenge: ${pattern.action.split(' ').slice(0, 4).join(' ')} ${i}`,
    difficulty: i % 3 === 0 ? "Hard" : "Medium",
    description: `Given an adjacency list or edge list representation of a graph, ${pattern.action.toLowerCase()}. Ensure your algorithm is optimized for O(V + E) or O(E log V) time complexity depending on the problem type.`,
    inputTestCase: pattern.input,
    expectedOutput: pattern.output,
    starterCode: starterCode
  });
}

fs.writeFileSync(
  "C:/Users/91626/OneDrive/Desktop/Learning-Hub/Learning-Hub/artifacts/learner-hub/src/services/graph_coding_questions.json", 
  JSON.stringify(questions, null, 2)
);
console.log("Successfully generated 50 graph coding questions.");
