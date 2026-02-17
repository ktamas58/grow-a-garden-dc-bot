const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { buildStockEmbed, getCache } = require("../../utils/stockData.js")



module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Show current Grow a Garden shop stock')
        .addStringOption((opt) =>
            opt
                .setName("category")
                .setDescription(
                    "Which shop? seed | gear | egg | cosmetics | honey | travelingmerchant"
                )
                .setRequired(true)
                .addChoices(
                    { name: "seed", value: "seed" },
                    { name: "gear", value: "gear" },
                    { name: "egg", value: "egg" },
                    { name: "cosmetics", value: "cosmetics" },
                    { name: "honey", value: "honey" },
                    { name: "traveling-merchant", value: "travelingmerchant" },
                )
        ),

    async execute(interaction, client) {


        const category = interaction.options.getString("category");

        let cache = getCache()
        let embed = await buildStockEmbed(category, cache.stock.data)

        await interaction.reply({embeds:[embed]})
    },
};