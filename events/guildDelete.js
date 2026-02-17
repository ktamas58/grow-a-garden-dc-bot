const { Events} = require('discord.js');
const config = require("../config.json")

module.exports = {
    name: Events.GuildDelete,
    async execute(guild, client) {
        let devserver = client.guilds.cache.get(config.guildId)
        let reportchannel = devserver.channels.cache.get(config.welcomeChannelId)
        reportchannel.send(`:x: **[Leave]** ${guild.name} (${guild.id})` )
    },
};