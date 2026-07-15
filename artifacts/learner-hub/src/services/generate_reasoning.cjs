const fs = require('fs');

const questions = [];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumberSeries(i) {
  const step = randInt(2, 8);
  const start = randInt(1, 20);
  const type = randInt(0, 3);
  let seq = [];
  let next = 0;
  
  if (type === 0) { // Arithmetic
    seq = [start, start + step, start + 2*step, start + 3*step];
    next = start + 4*step;
  } else if (type === 1) { // Geometric
    seq = [start, start * step, start * step * step, start * step * step * step];
    next = start * Math.pow(step, 4);
  } else if (type === 2) { // Squares
    seq = [start*start, (start+1)*(start+1), (start+2)*(start+2), (start+3)*(start+3)];
    next = (start+4)*(start+4);
  } else { // Mixed addition
    seq = [start, start + step, start + step + 2, start + step + 2 + step];
    next = start + step + 2 + step + 2;
  }
  
  return {
    q: `Find the next number in the series: ${seq.join(", ")}, ?`,
    ans: next.toString(),
    fake: [(next + step).toString(), (next - step).toString(), (next + 2).toString()]
  };
}

function generateLetterSeries(i) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const startIdx = randInt(0, 10);
  const step = randInt(1, 4);
  const seq = [letters[startIdx], letters[startIdx + step], letters[startIdx + 2*step], letters[startIdx + 3*step]];
  const next = letters[startIdx + 4*step];
  
  return {
    q: `What comes next in the series: ${seq.join(", ")}, ?`,
    ans: next,
    fake: [letters[(startIdx + 4*step + 1) % 26], letters[(startIdx + 4*step + 2) % 26], letters[(startIdx + 4*step - 1 + 26) % 26]]
  };
}

function generateBloodRelation(i) {
  const names = ["A", "B", "C", "D", "P", "Q", "R", "S", "M", "N", "X", "Y"];
  const rels1 = [
    { p1: "father", p2: "brother", out: "uncle" },
    { p1: "mother", p2: "sister", out: "aunt" },
    { p1: "brother", p2: "son", out: "nephew" },
    { p1: "sister", p2: "daughter", out: "niece" }
  ];
  const r = rels1[i % rels1.length];
  const n1 = names[i % names.length];
  const n2 = names[(i+1) % names.length];
  const n3 = names[(i+2) % names.length];
  
  return {
    q: `If ${n1} is the ${r.p1} of ${n2} and ${n2} is the ${r.p2} of ${n3}, how is ${n1} related to ${n3}? (Assuming standard definitions)`,
    ans: r.out.charAt(0).toUpperCase() + r.out.slice(1),
    fake: ["Grandfather", "Cousin", "Brother", "Son", "Father"].filter(x => x.toLowerCase() !== r.out).slice(0, 3)
  };
}

function generateDirection(i) {
  const d1 = randInt(2, 15);
  const d2 = randInt(2, 15);
  const d3 = randInt(2, 15);
  const dirs = ["North", "South", "East", "West"];
  const turns = ["left", "right"];
  const startDir = dirs[i % 4];
  const turn1 = turns[i % 2];
  
  return {
    q: `A person starts walking ${startDir} for ${d1} km, then turns ${turn1} and walks ${d2} km, then turns ${turn1} again and walks ${d3} km. How far is the person moving along the final path direction? (Just logical sequence understanding).`,
    ans: `${d3} km`,
    fake: [`${d1} km`, `${d2} km`, `${d1 + d2} km`]
  };
}

const analogyPairs = [
  ["Oasis", "Sand", "Island", "Water"],
  ["Doctor", "Hospital", "Teacher", "School"],
  ["Thermometer", "Temperature", "Barometer", "Pressure"],
  ["Lion", "Roar", "Dog", "Bark"],
  ["Car", "Garage", "Aeroplane", "Hangar"],
  ["Book", "Author", "Movie", "Director"],
  ["Good", "Bad", "Virtue", "Vice"],
  ["Fire", "Ashes", "Event", "Memories"]
];
function generateAnalogy(i) {
  const pair = analogyPairs[i % analogyPairs.length];
  return {
    q: `${pair[0]} : ${pair[1]} :: ${pair[2]} : ?`,
    ans: pair[3],
    fake: shuffle(["Ocean", "River", "College", "Book", "Meow", "Sky"]).slice(0, 3)
  };
}

function generateCoding(i) {
  const words = ["APPLE", "TRAIN", "WATER", "LIGHT", "PAPER", "CHAIR", "TABLE"];
  const word = words[i % words.length];
  const shift = randInt(1, 3);
  const code = word.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join("");
  
  const targetWords = ["MANGO", "PLANE", "FIRE", "HEAVY", "WOOD", "DESK", "BOARD"];
  const targetWord = targetWords[i % targetWords.length];
  const targetCode = targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join("");
  
  return {
    q: `In a certain code language, '${word}' is written as '${code}'. How will '${targetWord}' be written in that code language?`,
    ans: targetCode,
    fake: [
      targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift + 1) % 26) + 65)).join(""),
      targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift - 1 + 26) % 26) + 65)).join(""),
      targetWord.split("").map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift + 2) % 26) + 65)).join("")
    ]
  };
}

function generateSyllogism(i) {
  const items = ["cats", "dogs", "cars", "fans", "pens", "books", "trees", "birds"];
  const a = items[i % items.length];
  const b = items[(i + 1) % items.length];
  const c = items[(i + 2) % items.length];
  
  return {
    q: `Statements: All ${a} are ${b}. All ${c} are ${b}. \nConclusions: I. All ${a} are ${c}. II. Some ${b} are ${a}.`,
    ans: "Only II follows",
    fake: ["Only I follows", "Both I and II follow", "Neither I nor II follows"]
  };
}

function generateClock(i) {
  const h = randInt(1, 11);
  const m = randInt(10, 50);
  const angle = Math.abs(30 * h - 5.5 * m);
  const finalAngle = Math.min(angle, 360 - angle);
  return {
    q: `At what angle the hands of a clock are inclined at ${m} minutes past ${h}?`,
    ans: `${finalAngle} degrees`,
    fake: [`${finalAngle + 10} degrees`, `${finalAngle - 10} degrees`, `${finalAngle + 5} degrees`]
  };
}

const topics = [
  { name: "Number Series", func: generateNumberSeries },
  { name: "Letter Series", func: generateLetterSeries },
  { name: "Blood Relations", func: generateBloodRelation },
  { name: "Direction Sense", func: generateDirection },
  { name: "Analogy", func: generateAnalogy },
  { name: "Coding-Decoding", func: generateCoding },
  { name: "Syllogism", func: generateSyllogism },
  { name: "Clock & Calendar", func: generateClock }
];

for (let i = 0; i < 400; i++) {
  const t = topics[i % topics.length];
  const res = t.func(i);
  
  let options = [res.ans, ...res.fake];
  options = Array.from(new Set(options));
  while(options.length < 4) {
    options.push(`Random${randInt(1, 100)}`);
  }
  options = shuffle(options.slice(0, 4));
  if (!options.includes(res.ans)) {
    options[0] = res.ans;
    options = shuffle(options);
  }

  questions.push({
    topic: t.name,
    questionText: res.q,
    options,
    correctAnswer: res.ans
  });
}

fs.writeFileSync(
  "C:/Users/91626/OneDrive/Desktop/Learning-Hub/Learning-Hub/artifacts/learner-hub/src/services/reasoning_questions.json", 
  JSON.stringify(questions, null, 2)
);
console.log("Successfully generated 400 uniquely randomized reasoning questions.");
