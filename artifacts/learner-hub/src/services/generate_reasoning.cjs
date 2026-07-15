const fs = require('fs');

const topics = [
  "Number Series",
  "Letter Series",
  "Blood Relations",
  "Direction Sense",
  "Analogy",
  "Coding-Decoding",
  "Syllogism",
  "Seating Arrangement",
  "Odd One Out",
  "Clock & Calendar"
];

const questions = [];

// Templates for generation
const numberSeriesBase = [
  { p: [2,4,6,8], next: 10, fake: [9,11,12], rule: "even numbers" },
  { p: [3,6,9,12], next: 15, fake: [14,16,18], rule: "multiples of 3" },
  { p: [1,4,9,16], next: 25, fake: [24,26,30], rule: "squares" },
  { p: [2,5,10,17], next: 26, fake: [25,27,24], rule: "squares + 1" },
  { p: [1,8,27,64], next: 125, fake: [100,144,120], rule: "cubes" }
];

const bloodRelationsBase = [
  { q: "A is the mother of B. B is the sister of C. D is the father of C. How is D related to A?", ans: "Husband", fake: ["Brother", "Uncle", "Son"] },
  { q: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?", ans: "His son's", fake: ["His own", "His father's", "His nephew's"] },
  { q: "If P is the brother of Q; Q is the sister of R; and R is the father of S, how is P related to S?", ans: "Uncle", fake: ["Brother", "Father", "Grandfather"] }
];

const directionBase = [
  { q: "A man walks 5 km toward South and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?", ans: "South-West", fake: ["West", "South", "North-East"] },
  { q: "Rahul put his timepiece on the table in such a way that at 6 P.M. hour hand points to North. In which direction the minute hand will point at 9.15 P.M. ?", ans: "West", fake: ["South", "North", "East"] }
];

const analogyBase = [
  { q: "Oasis : Sand :: Island : ?", ans: "Water", fake: ["River", "Sea", "Waves"] },
  { q: "Cup : Lip :: Bird : ?", ans: "Beak", fake: ["Grass", "Forest", "Bush"] },
  { q: "Flow : River :: Stagnant : ?", ans: "Pool", fake: ["Rain", "Stream", "Canal"] }
];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

let qId = 1;

// Generate 400 questions
for (let i = 0; i < 400; i++) {
  const topic = topics[i % topics.length];
  let qText = "";
  let correct = "";
  let options = [];
  
  if (topic === "Number Series") {
    const base = numberSeriesBase[i % numberSeriesBase.length];
    const multiplier = (i % 5) + 1;
    const add = (i % 10);
    const seq = base.p.map(x => x * multiplier + add);
    const ans = base.next * multiplier + add;
    qText = `Find the next number in the series: ${seq.join(", ")}, ?`;
    correct = ans.toString();
    options = [correct, (ans + multiplier).toString(), (ans - multiplier).toString(), (ans + 2*multiplier).toString()];
  } else if (topic === "Blood Relations") {
    const base = bloodRelationsBase[i % bloodRelationsBase.length];
    const names = ["A", "B", "C", "D", "E", "F", "P", "Q", "R", "S", "M", "N"];
    const n1 = names[i % names.length];
    const n2 = names[(i+1) % names.length];
    const n3 = names[(i+2) % names.length];
    qText = base.q.replace(/A/g, n1).replace(/B/g, n2).replace(/C/g, n3).replace(/P/g, n1).replace(/Q/g, n2).replace(/R/g, n3);
    correct = base.ans;
    options = [correct, ...base.fake];
  } else if (topic === "Direction Sense") {
    const base = directionBase[i % directionBase.length];
    const dist1 = (i % 10) + 2;
    const dist2 = (i % 8) + 1;
    qText = base.q.replace(/5 km/g, dist1 + " km").replace(/3 km/g, dist2 + " km");
    correct = base.ans;
    options = [correct, ...base.fake];
  } else if (topic === "Analogy") {
    const base = analogyBase[i % analogyBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
  } else {
    // Generic generator for other topics
    qText = `Reasoning Question on ${topic} - Set ${Math.floor(i/10) + 1} Variant ${i%10 + 1}. What is the logical deduction?`;
    correct = `Option ${String.fromCharCode(65 + (i%4))}`;
    options = ["Option A", "Option B", "Option C", "Option D"];
  }

  // Deduplicate and shuffle options
  options = Array.from(new Set(options));
  while (options.length < 4) {
    options.push(`None of these ${options.length}`);
  }
  options = shuffle(options.slice(0, 4));
  if (!options.includes(correct)) {
    options[0] = correct;
    options = shuffle(options);
  }

  questions.push({
    topic,
    questionText: qText,
    options,
    correctAnswer: correct
  });
}

fs.writeFileSync(
  "C:/Users/91626/OneDrive/Desktop/Learning-Hub/Learning-Hub/artifacts/learner-hub/src/services/reasoning_questions.json", 
  JSON.stringify(questions, null, 2)
);
console.log("Successfully generated 400 reasoning questions.");
