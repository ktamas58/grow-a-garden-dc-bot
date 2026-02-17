const { Events, EmbedBuilder,ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const config = require("../config.json")

module.exports = {
    name: Events.GuildCreate,
    async execute(guild, client) {
        let devserver = client.guilds.cache.get(config.guildId)
        let reportchannel = devserver.channels.cache.get(config.welcomeChannelId)



        let tulaj = await guild.fetchOwner()
        let viszaEmbed = new EmbedBuilder()
        .setDescription(`
  Owner: ${tulaj ? tulaj.user.tag + ` ${tulaj.id}` : 'Error!'}
  Users size: ${guild.members.cache.size}
  - Channels: ${guild.channels.cache.size}
  - Roles: ${guild.roles.cache.size}
  - Emotesa: ${guild.emojis.cache.size}
  - Created: ${guild.createdAt.toDateString()}
  "Region": ${guild.preferredLocale}`)
.addFields(
    {
      name: 'Humans:',
      value: `${guild.members.cache.filter(member => !member.user.bot).size}`,
      inline: true,
    },
    {
      name: 'Bots:',
      value: `${guild.members.cache.filter(member => member.user.bot).size}`,
      inline: true,
    }
  );

        reportchannel.send({ content: `:white_check_mark: **[Join]** ${guild.name} (${guild.id})`, embeds: [viszaEmbed] })

    },
};