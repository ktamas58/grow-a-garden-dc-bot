const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-config')
        .setDescription('Check the current config')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        let data = await db.get(`stock.${interaction.guild.id}`) || null
        let weather = await db.get(`weather.${interaction.guild.id}`) || null

        let fields = []
        if (data) {
            for (const category of Object.keys(data)) {
                let role = data[category].role ? `<@${data[category].role}>` : "*No ping*";

                fields.push(`- ${category}: <#${data[category].channel}> | ${role}\n`)
            }

            fields = fields.join(" ")
        } else {
            fields = "*No stock update has been set up yet!*"
        }

        let weatherTxt = "*Weather updates aren't set up*"
        if (weather) {
            let wRole = weather.role ? `<@${weather.role}>` : "*No ping*";

            weatherTxt = `- Weather: <#${weather.channel}> | ${wRole}`
        }

        const embed = new EmbedBuilder()
            .setTitle(":tools: Current settings")
            .addFields(
                { name: ":cloud_snow: Weather updates:", value: weatherTxt },
                { name: ":scroll: Stock updates:", value: fields })
            .setTimestamp()
            .setColor('Blurple')


        await interaction.reply({ embeds: [embed] })
    },
};