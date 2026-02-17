const { Events, ActivityType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const stock = require("../utils/stockData.js")
const weather = require("../utils/weatherData.js")

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {

		function getFormattedDate() {
			const now = new Date();

			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');

			return `${month}.${day}. ${hours}:${minutes}`;
		}
		console.log(`Ready! Logged in as ${client.user.tag}, at: ` + getFormattedDate());
		client.user.setActivity('🥕 /help', { type: ActivityType.Custom })

    setInterval(() => {
		client.user.setActivity('🥕 /help', { type: ActivityType.Custom })
	}, 240 * 60 * 1000);//4 hour period


	//initialize data collection
		stock.start(client)
		weather.start(client)
		volt=false

	},
};