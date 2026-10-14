// Einfacher Lastgenerator – zeigt, wie /slow auch /fast ausbremst
// Start: node load.js [slow|slow-async] [anzahl]

const path = `/${process.argv[2] ?? 'slow'}`;
const count = Number(process.argv[3] ?? 10);

async function timed(url) {
  const start = performance.now();
  await fetch(url).then((res) => res.text());
  return performance.now() - start;
}

const slow = Array.from({ length: count }, () => timed(`http://localhost:3000${path}`));
const fast = timed('http://localhost:3000/fast');

console.log(`${count}x ${path}:`, (await Promise.all(slow)).map((ms) => ms.toFixed(0)).join(', '), 'ms');
console.log('1x /fast parallel dazu:', (await fast).toFixed(0), 'ms');
