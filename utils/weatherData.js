const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

var cache = null;

function getWeather() {
  return cache;
}

async function fetchWeather() {
  const res = await fetch("https://gagapi.onrender.com/weather");
  const data = await res.json();
  if (!cache) cache = data;
  return data;
}

async function checkWeather(client) {
  const data = await fetchWeather();
  if (!data) return;
  if (data.type !== cache.type || data.active !== cache.active) {
    cache = data;

    console.log("change " + data.type);

    let alerts = await db.get("weather");
    Object.keys(alerts).forEach(async (guildID) => {
      const { role, channel } = alerts[guildID];

      let szerver = await client.guilds.cache.get(guildID);
      let csatorna = await szerver.channels.cache.get(channel);

      let embed = await weatherEmbed();
      if (role) {
        csatorna.send({content:`<@&${role}>`, embeds: [embed] });
      } else {
        csatorna.send({ embeds: [embed] });
      }
    });
  }
  console.log("cached: " + data.type);
}

async function weatherEmbed(command) {
  let data = cache;
  const weatherStyles = {
    rain: { emoji: "🌧️", color: "#0404b5" },
    frost: { emoji: "❄️", color: "#AEE6F9" },
    thunder: { emoji: "⛈️", color: "#2C3E50" },
    snow: { emoji: "🌨️", color: "#bdeaff" },
    night: { emoji: "🌙", color: "#1A1A40" },
    "blood moon": { emoji: "🌕", color: "#8B0000" },
    meteor: { emoji: "☄️", color: "#F39C12" },
    "Crystal Beams": { emoji: "🔮", color: "#9B59B6" },
    windy: { emoji: "🍃", color: "#27AE60" },
    gale: { emoji: "💨", color: "#7FDBFF" },
    tornado: { emoji: "🌪", color: "#5D6D7E" },
    sandstorm: { emoji: "🌫", color: "#C2B280" },
    heatwave: { emoji: "🔥", color: "#E67E22" },
    "acid rain": { emoji: "☣️", color: "#7FFF00" },
    "sun god": { emoji: "🌞", color: "#FFD700" },
    "tropical Rain": { emoji: "🌴", color: "#00B894" },
    "Aurora Borealis": { emoji: "🌈", color: "#6A5ACD" },
    "Solar Eclipse": { emoji: "🌑", color: "#0B0F28" },
  };
  function formatLastUpdated(isoString) {
    const date = new Date(isoString);
    const unix = Math.floor(date.getTime() / 1000);

    return `<t:${unix}:T>,  *(<t:${unix}:R>)*`;
  }

  const embed = new EmbedBuilder()
    .setTitle(command? "🌤 Current weather:": "🌤🔄 Weather change:")
    .setTimestamp();

  if (!data) {
    embed.setDescription("No data available at the moment! Try later. . .");
  } else if (data.type == "normal") {
    let details = `- Status: ${
      data.active ? "active" : "inactive"
    }\n- Last updated: ${formatLastUpdated(data.lastUpdated)}`;

    embed
      .setColor("#4287f5")
      .setFields(
        { name: `🌤️ *Normal*`, value: details },
        { name: "Effects:", value: "*No effects*" }
      );
  } else {
    let effect = "";
    data.effects.forEach((x) => {
      effect += "- " + x + "\n";
    });
    let details = `- Status: ${
      data.active ? "active" : "disabled"
    }\n- Last updated: ${formatLastUpdated(data.lastUpdated)}`;

    embed.setColor(weatherStyles[data.type]?.color || "#4A90E2").setFields(
      {
        name: `${weatherStyles[data.type]?.emoji || "❓"} *${data.type}*`,
        value: details,
      },
      { name: "Effects:", value: effect }
    );
  }

  return embed;
}

function start(client) {
  fetchWeather();
  checkWeather(client);
  //5 min
  setInterval(() => checkWeather(client), 1 * 60 * 1000);
}

module.exports = { start, getWeather, weatherEmbed };
