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

const letterSeriesBase = [
  { q: "What comes next in the series: A, C, E, G, ?", ans: "I", fake: ["H", "J", "K"] },
  { q: "What comes next in the series: Z, X, V, T, ?", ans: "R", fake: ["S", "Q", "P"] },
  { q: "What comes next in the series: B, D, F, H, ?", ans: "J", fake: ["K", "I", "L"] }
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

const codingDecodingBase = [
  { q: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that code language?", ans: "EOJDJEFM", fake: ["MFEDJJOE", "EOJDEJFM", "MFEJDJOE"] },
  { q: "If 'CAT' is coded as 24 and 'DOG' is coded as 26, how will 'RAT' be coded?", ans: "39", fake: ["40", "42", "38"] },
  { q: "If 'APPLE' is coded as 'EQTPI', what will be the code for 'MANGO'?", ans: "QERKS", fake: ["QERJR", "PEQKS", "PERKS"] }
];

const syllogismBase = [
  { q: "Statements: All cars are cats. All fans are cats. Conclusions: I. All cars are fans. II. Some fans are cars.", ans: "Neither I nor II follows", fake: ["Only I follows", "Only II follows", "Both I and II follow"] },
  { q: "Statements: Some actors are singers. All the singers are dancers. Conclusions: I. Some actors are dancers. II. No singer is actor.", ans: "Only I follows", fake: ["Only II follows", "Either I or II follows", "Both I and II follow"] }
];

const seatingBase = [
  { q: "Five boys are sitting in a row. A is on the right of B, E is on the left of B, but to the right of C. If A is on the left of D, who is sitting in the middle?", ans: "B", fake: ["A", "C", "E"] },
  { q: "P, Q, R, S, and T sit around a circular table facing the center. P sits second to the right of S, and Q is not an immediate neighbor of P. Who sits immediately to the left of R?", ans: "Cannot be determined", fake: ["P", "Q", "T"] }
];

const oddOneOutBase = [
  { q: "Choose the word which is least like the other words in the group.", ans: "Tomato", fake: ["Potato", "Carrot", "Ginger"] }, // Tomato is a fruit above ground
  { q: "Find the odd one out from the given options.", ans: "121", fake: ["1331", "343", "729"] }, // 121 is square, others are cubes
  { q: "Select the odd letter group.", ans: "WXYZ", fake: ["ABCD", "IJKL", "PQRS"] } 
];

const clockCalendarBase = [
  { q: "What was the day of the week on 15th August 1947?", ans: "Friday", fake: ["Thursday", "Saturday", "Wednesday"] },
  { q: "At what angle the hands of a clock are inclined at 15 minutes past 5?", ans: "67.5 degrees", fake: ["64 degrees", "58.5 degrees", "72.5 degrees"] },
  { q: "Today is Monday. After 61 days, it will be:", ans: "Saturday", fake: ["Tuesday", "Thursday", "Wednesday"] }
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
  } else if (topic === "Letter Series") {
    const base = letterSeriesBase[i % letterSeriesBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
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
  } else if (topic === "Coding-Decoding") {
    const base = codingDecodingBase[i % codingDecodingBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
  } else if (topic === "Syllogism") {
    const base = syllogismBase[i % syllogismBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
  } else if (topic === "Seating Arrangement") {
    const base = seatingBase[i % seatingBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
  } else if (topic === "Odd One Out") {
    const base = oddOneOutBase[i % oddOneOutBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
  } else if (topic === "Clock & Calendar") {
    const base = clockCalendarBase[i % clockCalendarBase.length];
    qText = base.q;
    correct = base.ans;
    options = [correct, ...base.fake];
  }

  // Deduplicate and shuffle options
  options = Array.from(new Set(options));
  while (options.length < 4) {
    options.push("None of these");
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
console.log("Successfully generated 400 proper reasoning questions.");
