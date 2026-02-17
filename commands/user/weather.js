const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getWeather,weatherEmbed } = require("../../utils/weatherData.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Check the current weather'),

    async execute(interaction, client) {
        let embed2 = await weatherEmbed(true)
        await interaction.reply({ embeds: [embed2] });

    },
};