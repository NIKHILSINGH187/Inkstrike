// Curated code snippets for Code Typing mode

export const CODE_SNIPPETS = [
  {
    language: "JavaScript",
    title: "Array Filter & Map",
    code: "const activeUsers = users.filter(u => u.isActive).map(u => u.id);"
  },
  {
    language: "JavaScript",
    title: "Async Data Fetcher",
    code: "async function fetchData(url) { const res = await fetch(url); return await res.json(); }"
  },
  {
    language: "JavaScript",
    title: "Custom Hook State",
    code: "const [count, setCount] = useState(() => calculateInitial(seed));"
  },
  {
    language: "Python",
    title: "List Comprehension",
    code: "squares = [x ** 2 for x in range(10) if x % 2 == 0]"
  },
  {
    language: "Python",
    title: "Decorator Function",
    code: "def timer_decorator(func): def wrapper(*args): return func(*args) return wrapper"
  },
  {
    language: "Python",
    title: "Context Manager",
    code: "with open('data.json', 'r', encoding='utf-8') as file: payload = json.load(file)"
  },
  {
    language: "Rust",
    title: "Result Matching",
    code: "let value = match result { Ok(val) => val, Err(e) => return Err(e.into()), };"
  },
  {
    language: "Rust",
    title: "Vector Iteration",
    code: "let doubled: Vec<i32> = numbers.iter().map(|&x| x * 2).collect();"
  },
  {
    language: "SQL",
    title: "Aggregate Query",
    code: "SELECT user_id, COUNT(*) AS total_orders FROM orders GROUP BY user_id HAVING total_orders > 5;"
  }
];

export function getRandomSnippet(lang = 'all') {
  const filtered = lang === 'all' ? CODE_SNIPPETS : CODE_SNIPPETS.filter(s => s.language.toLowerCase() === lang.toLowerCase());
  const pool = filtered.length > 0 ? filtered : CODE_SNIPPETS;
  return pool[Math.floor(Math.random() * pool.length)];
}
