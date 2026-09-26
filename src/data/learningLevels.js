export const learningLevels = [
  {
    id: 1,
    name: 'Level 1: Home Row Basics',
    description: 'Master the home row keys: A, S, D, F, J, K, L, ;',
    words: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'a', 'd', 'd', 'a', 's', 'k', 'f', 'a', 'l', 'l', 'j', 'a', 'd', 'f', 'l', 'a', 's', 'k', 's', 'a', 'd', 'd', 'a', 's']
  },
  {
    id: 2,
    name: 'Level 2: Top Row Reaches',
    description: 'Incorporate the top row letters: Q, W, E, R, T, Y, U, I, O, P',
    words: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'w', 'e', 'r', 't', 'y', 'y', 'o', 'u', 'p', 'i', 'p', 'e', 'w', 'i', 'r', 'e', 'r', 'o', 'u', 't', 'e', 't', 'r', 'y', 'p', 'u', 't']
  },
  {
    id: 3,
    name: 'Level 3: Full Alphabet',
    description: 'All letters from A to Z.',
    words: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'q', 'u', 'i', 'c', 'k', 'b', 'r', 'o', 'w', 'n', 'f', 'o', 'x', 'j', 'u', 'm', 'p', 's', 'o', 'v', 'e', 'r', 'l', 'a', 'z', 'y', 'd', 'o', 'g']
  },
  {
    id: 4,
    name: 'Level 4: Basic Words',
    description: 'Short, common 3 and 4-letter words.',
    words: ['the', 'cat', 'ran', 'fast', 'and', 'the', 'dog', 'did', 'too', 'who', 'can', 'see', 'you', 'now', 'yes', 'we', 'are', 'out', 'for', 'fun', 'get', 'it', 'all', 'day', 'long']
  },
  {
    id: 5,
    name: 'Level 5: Capitalization & Sentences',
    description: 'Full sentences with capital letters and basic punctuation.',
    words: ['Hello', 'world.', 'This', 'is', 'a', 'test', 'of', 'your', 'typing', 'skills.', 'Keep', 'your', 'fingers', 'on', 'the', 'home', 'keys', 'and', 'stay', 'calm.', 'You', 'are', 'doing', 'great!']
  }
];

export function getLearningLevel(levelId) {
  const level = learningLevels.find(l => l.id === levelId);
  return level || learningLevels[0];
}
