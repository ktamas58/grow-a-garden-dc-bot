const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all commands')
,
  async execute(interaction, client) {

    const support = new ButtonBuilder()
      .setEmoji('📰')
      .setLabel('Support server')
      .setURL('')//FILL LINK
      .setStyle(ButtonStyle.Link);

    const invite = new ButtonBuilder()
      .setEmoji('🤖')
      .setLabel('Invite me!')
      .setURL('')//FILL LINK
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder()
      .addComponents(support, invite);
        var emojis = [
            '😍', '🥰', '😘', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎', '🤍', '💕', '💞', '💗', '💖', '💘', '💝'
        ]
        let emote =  emojis[Math.floor(Math.random() * emojis.length)];
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setAuthor({ name: `${client.user.username} help`, iconURL: interaction.guild.iconURL() })
      .setDescription("*Help with the bots developement, join the support server below! Bot made by: github.com/ktamas58*")
      .setTimestamp()
      .addFields(
        {
          name: '❯ 🛠️ **Admin Commands**',
          value: [
            '- `/stock-alerts` - Set up shop alerts to a channel, with optional role ping',
            '- `/weather-alerts` - Set up weather alerts to a channel, with optional role ping',
            '- `/check-config` - Check which channels/roles are set up for alerts',
            '\u200b'

          ].join('\n'),
          inline: false
        },
        {
          name: '❯ ⚙️ **User commands**',
          value: [
            '- `/event` - Check the current event',
            '- `/shop` - Check the current stock',
            '- `/weather` - Check the current weather',
            '- `/help` - Help with commands',
            '- :sparkles:`/invite` - Invite me to your server'
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: `${interaction.user.username} ${emote}`, iconURL: interaction.user.avatarURL() });

    interaction.reply({ embeds: [embed], components: [row] });

  },
};