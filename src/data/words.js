// Inkstrike Ultra Curated Word Banks

export const COMMON_WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I",
  "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "his", "from",
  "they", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
  "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
  "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your",
  "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first",
  "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "great", "between", "need", "large", "under", "system", "program", "code", "light", "world",
  "matrix", "cyber", "stream", "digital", "strike", "power", "future", "signal", "speed", "space",
  "focus", "shift", "pulse", "drive", "neural", "logic", "flow", "orbit", "vision", "vector",
  "sound", "paper", "memory", "cache", "server", "canvas", "engine", "quantum", "react", "style",
  "keyboard", "switch", "linear", "click", "stroke", "flame", "burst", "streak", "record", "score",
  "master", "rhythm", "tempo", "motion", "dynamo", "echo", "vertex", "prism", "shadow", "spark",
  "glitch", "arcade", "vintage", "carbon", "layout", "module", "string", "syntax", "render", "state"
];

export const TECHNICAL_WORDS = [
  "async", "await", "function", "const", "let", "return", "import", "export", "class", "interface",
  "type", "number", "string", "boolean", "promise", "resolve", "reject", "algorithm", "compiler",
  "framework", "runtime", "component", "render", "virtual", "pointer", "memory", "thread", "kernel",
  "socket", "packet", "protocol", "gateway", "binary", "terminal", "console", "debugger", "variable"
];

export function getRandomWords(count = 50, options = { punctuation: false, numbers: false }) {
  const list = [];
  const punctuationMarks = [".", ",", "!", "?", ";", ":", "-", "\"", "'"];

  for (let i = 0; i < count; i++) {
    // 10% chance to insert technical term
    const pool = Math.random() < 0.15 ? TECHNICAL_WORDS : COMMON_WORDS;
    let word = pool[Math.floor(Math.random() * pool.length)];

    if (options.numbers && Math.random() < 0.18) {
      word = Math.floor(Math.random() * 999).toString();
    } else if (options.punctuation && Math.random() < 0.25) {
      const punc = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      if (punc === "\"" || punc === "'") {
        word = `${punc}${word}${punc}`;
      } else {
        word = `${word}${punc}`;
      }
      if (Math.random() < 0.3) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    list.push(word);
  }

  return list;
}
