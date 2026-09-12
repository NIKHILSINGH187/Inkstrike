// Curated literary, philosophical, and tech quotes

export const QUOTES = [
  {
    id: "q1",
    text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    length: "short"
  },
  {
    id: "q2",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    length: "short"
  },
  {
    id: "q3",
    text: "Do or do not, there is no try.",
    author: "Yoda",
    length: "short"
  },
  {
    id: "q4",
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    length: "short"
  },
  {
    id: "q5",
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    length: "short"
  },
  {
    id: "q6",
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    length: "medium"
  },
  {
    id: "q7",
    text: "The function of good software is to make the complex appear simple and effortless to the user.",
    author: "Grady Booch",
    length: "medium"
  },
  {
    id: "q8",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    length: "medium"
  },
  {
    id: "q9",
    text: "There are only two hard things in Computer Science: cache invalidation and naming things.",
    author: "Phil Karlton",
    length: "medium"
  },
  {
    id: "q10",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit forged in daily devotion.",
    author: "Aristotle",
    length: "medium"
  },
  {
    id: "q11",
    text: "It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.",
    author: "Theodore Roosevelt",
    length: "long"
  },
  {
    id: "q12",
    text: "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference in this voyage called life.",
    author: "Robert Frost",
    length: "long"
  }
];

export function getRandomQuote(length = 'all') {
  const filtered = length === 'all' ? QUOTES : QUOTES.filter(q => q.length === length);
  const pool = filtered.length > 0 ? filtered : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}
