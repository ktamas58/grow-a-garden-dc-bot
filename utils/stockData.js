const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const STOCK_API_URL = "https://gagstock.gleeze.com/grow-a-garden";

let kliens = null
const cache = {
  stock: { data: null, ts: 0, ttlMs: 30_000 }, // 30s
};

function getNewItems(oldItems, newItems) {
  if (oldItems.length == 0) return [];


  const elteres = new Set()
  for (const category of Object.keys(oldItems)) {

    if (category != "updated_at") {
      let check = hasNameDifference(oldItems[category].items, newItems[category].items)

      if (check) {
        elteres.add(category)
      }
    }
  }

  console.log(elteres);
  return elteres;
}
function hasNameDifference(arr1, arr2) {
  const names1 = new Set(arr1.map(i => i.name));
  const names2 = new Set(arr2.map(i => i.name));

  return [...names1].some(name => !names2.has(name)) ||
    [...names2].some(name => !names1.has(name));
}


async function onEveryFiveMinutes(callback) {
  function check() {
    const now = new Date();
    const minutes = now.getMinutes();
    let lefutott = false

    if (minutes % 5 === 0 && !lefutott) {
      lefutott = true

      callback(now);
    } else if (minutes % 5 !== 0) {
      lefutott = false
    }
  }
  // check every 30 second
  setInterval(check, 10000);
}



// Main function
onEveryFiveMinutes(async (time) => {
  console.log("Checking new stock . . .")
  let stock = await getStock()
  let newItems = getNewItems(cache.stock.data.data, stock.data);
  if (newItems.size > 0) {
    cache.stock.data = stock

    let szerverek = await db.get(`stock`)
    for (const szerver of Object.keys(szerverek)) {
      newItems.forEach(async (category) => {
        if (category in szerverek[szerver]) {
          await buildStockEmbed(category, cache.stock.data, kliens, szerver, szerverek[szerver][category].channel)
        }
      })
    }
  }
});





async function getStock(force = false) {
  const res = await fetch(STOCK_API_URL);
  const data = await res.json();

  if (!cache.stock.data) {
    cache.stock = { data: data, ts: null, ttlMs: cache.stock.ttlMs };
    console.log("stock cache updated")
  } return data;
}


async function buildStockEmbed(category, stock, client, guildID, channelID) {
  const payload = stock?.data?.[category];
  const updatedAt = stock?.updated_at || new Date().toISOString();
  if (!payload) return null;

  const items = Array.isArray(payload.items) ? payload.items : [];
  const lines =
    items.length > 0
      ? items
        .slice(0, 24)
        .map(
          (it) =>
            `${it.emoji ? `${it.emoji} ` : ""}${it.name}${typeof it.quantity === "number" && it.quantity !== 1
              ? ` ×${it.quantity}`
              : ""
            }`
        )
        .join("\n")
      : "No items listed.";

  const titleMap = {
    seed: "🌱 Seed Shop",
    gear: "🧰 Gear Shop",
    egg: "🥚 Egg Shop",
    cosmetics: "🎀 Cosmetics Shop",
    honey: "🍯 Honey Shop",
    travelingmerchant: "🧳 Traveling Merchant",
  };
  const colorMap = {
    seed: "#4CAF50",
    gear: "#E53935",
    egg: "#FFF8DC",
    cosmetics: "#AF0D66",
    honey: "#FFC30B",
    travelingmerchant: "#2152F3",
  };

  function parseCountdown(str) {
    // Example input: "00h 04m 55s"
    const match = str.match(/(\d+)h\s+(\d+)m\s+(\d+)s/);
    if (!match) return null;

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);

    return (hours * 3600 + minutes * 60 + seconds) * 1000; // ms
  }

  // Example usage
  const countdown = payload.countdown;
  const ms = countdown ? parseCountdown(countdown) : null;
  let relative = payload.countdown;
  if (ms) {
    const unix = Math.floor((Date.now() + ms) / 1000);
    relative = `<t:${unix}:R> (${countdown})`; // 👈 relative countdown
    // Output in Discord: "Next event in 5 minutes"
  }
  let placeHolderTxt = [];
  if (payload.status) {
    if (payload.status == "leaved") {
      let m = parseCountdown(payload.appearIn) || null;
      let relative = " ";
      if (m) {
        const unix = Math.floor((Date.now() + m) / 1000);
        relative = `<t:${unix}:R> (${payload.appearIn})`; // 👈 relative countdown
        // Output in Discord: "Next event in 5 minutes"
      }
      placeHolderTxt = [
        { name: "Arrives in:", value: `${relative}`, inline: true },
      ];
    } else if(payload.status == "active"){
            let m = parseCountdown(payload.countdown) || null;
      let relative = " ";
      if (m) {
        const unix = Math.floor((Date.now() + m) / 1000);
        relative = `<t:${unix}:R> (${payload.countdown})`; // 👈 relative countdown
        // Output in Discord: "Next event in 5 minutes"
      }
            placeHolderTxt = [
        { name: "Status", value: `- Active`, inline: true },
        { name: "Countdown", value: `${relative}`, inline: true },
      ];
    }
  } else if (payload.countdown) {
    placeHolderTxt = [
      { name: "Next refresh in", value: `${relative}`, inline: true },
    ];
  }

  const embed = new EmbedBuilder()
    .setTitle(titleMap[category] || category)
    .setColor(colorMap[category] || "#005A1B")
    .setDescription(lines)
    .addFields(placeHolderTxt)
    .setFooter({
      text: `Source: ${new URL(STOCK_API_URL).host} • Updated ${new Date(
        updatedAt
      ).toLocaleString()}`,
      iconURL: "https://cdn.discordapp.com/avatars/1409557292738940999/b68e76f32901eae5e3d80ed1f6fd7235.webp",
    });

  if (guildID) {
    let szerver = await client.guilds.cache.get(guildID);
    if(!szerver)return
    let csatorna = await szerver.channels.cache.get(channelID);

    csatorna.send({ embeds: [embed] })
    return
  }
    return embed;
  
}

// a sima shop minden 5 percben lekérődik ez egyszerű, a többi elv minden 4, órában;
// ha lekéred a stockot, a sima boltokat rakja be cachebe és a 4 órásiakba ellenőrizze h van e változás
// ha van akkor frissíteni a cachet és utánna kiküldeni az ertesiteseket

async function start(client) {
  await getStock()
  kliens = client

  return;
}

function getCache() {
  return cache
}

module.exports = { start, buildStockEmbed, getCache };
