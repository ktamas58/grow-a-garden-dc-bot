const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Show the current main event in Grow a Garden'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle(`:confetti_ball: Event history :confetti_ball: `)
            .setColor("Aqua")
           .addFields({name:`Name   |  Start   |  END`,value: `- Easter Event 2025	April 19 - April 27, 2025
- Angry Plant Event	April 27 - May 9, 2025
- Lunar Glow Event	May 9 - May 31, 2025
- Bizzy Bee Event	May 31 - June 21, 2025
- Summer Harvest Event	June 21 - July 5, 2025
- Prehistoric Event	July 5 - July 19, 2025
- Zen Event	July 19 - August 2, 2025
- Cooking Event	August 2 - August 16, 2025
- Beanstalk Event	August 16 - August 30, 2025
- Fairy Event	August 30 - September 13, 2025
- :fast_forward: **Fall Market Event	September 13, 2025 - September 27, 2025**`})
            .setFooter({
                text: "Source: Grow a Garden Wiki (Fandom)",
                iconURL: client.user.avatarURL()
            });
        await interaction.reply({ embeds: [embed] });

    },
};