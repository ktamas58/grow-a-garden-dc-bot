
const cache = {
stock: { data: null, ts: 0, ttlMs: 30_000 }, // 30s
event: { data: null, ts: 0, ttlMs: 5 * 60_000 }, // 5 min
};


async function fetchJSON(url, { timeoutMs = 10_000 } = {}) {
const ctrl = new AbortController();
const id = setTimeout(() => ctrl.abort(), timeoutMs);
try {
const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "GAG-DiscordBot/1.0" } });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return await res.json();
} finally {
clearTimeout(id);
}
}


async function fetchText(url, { timeoutMs = 10_000 } = {}) {
const ctrl = new AbortController();
const id = setTimeout(() => ctrl.abort(), timeoutMs);
try {
const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "GAG-DiscordBot/1.0" } });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return await res.text();
} finally {
clearTimeout(id);
}
}

async function getStock(force = false) {
const now = Date.now();
if (!force && cache.stock.data && now - cache.stock.ts < cache.stock.ttlMs) {
return cache.stock.data;
}
const json = await fetchJSON(STOCK_API_URL);
cache.stock = { data: json, ts: now, ttlMs: cache.stock.ttlMs };
return json;
}




async function getCurrentEvent(force = false) {
const now = Date.now();
if (!force && cache.event.data && now - cache.event.ts < cache.event.ttlMs) {
return cache.event.data;
}


// Strategy:
// 1) Parse Events category page for a line with "- TBA" to infer the active event.
// 2) Fallback to Update Log (latest entry) if parsing fails.
let name = null;
let start = null;
let end = null;
let url = null;


try {
const html = await fetchText(
"https://growagarden.fandom.com/wiki/Category:Events"
);
// crude parse: find lines like "Beanstalk Event August 16 2025 - TBA"
const tbaMatch = html
.replace(/<[^>]+>/g, " ")
.match(/([A-Za-z ]+ Event)\s+([A-Za-z]+\s+\d{1,2}\s+\d{4})\s*-\s*TBA/i);
if (tbaMatch) {
name = tbaMatch[1].trim();
start = tbaMatch[2].trim();
end = "TBA";
url = `https://growagarden.fandom.com/wiki/${encodeURIComponent(
name
)}`;
}
} catch {}


if (!name) {
try {
const html = await fetchText(
"https://growagarden.fandom.com/wiki/Update_Log"
);
const text = html.replace(/<[^>]+>/g, " ");
// grab the first occurrence of "Update x.x.x Month DD, YYYY ... Event"
const m = text.match(
/(Update\s+\d+\.\d+\.\d+)\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}).{0,120}?(\b[A-Za-z ]+ Event\b)/
);
if (m) {
name = m[3].trim();
start = m[2].trim();
end = "TBA";
url = `https://growagarden.fandom.com/wiki/${encodeURIComponent(
name
)}`;
}
} catch {}
}


const data = { name, start, end, url };
cache.event = { data, ts: now, ttlMs: cache.event.ttlMs };
return data;
}



module.exports={getStock,getCurrentEvent}