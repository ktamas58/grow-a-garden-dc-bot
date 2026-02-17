const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather-alerts")
    .setDescription("Set up alerts in a channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((option) =>
      option
        .setName("on-off")
        .setDescription("Enable or disable the alerts")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Weather alert channel")
        .addChannelTypes(0)
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Mention a role when weather change")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");
    const role = interaction.options.getRole("role") || null;
    const status = interaction.options.getBoolean("on-off");

    let stored = await db.get(`weather.${interaction.guild.id}.channel`);

    if (!status && stored) {
      await db.delete(`weather.${interaction.guild.id}`);
      interaction.reply(
        ":white_check_mark: Weather allerts sucessfully turned off! :wastebasket: :white_sun_small_cloud:"
      );
      return;
    } else if (!status && !stored) {
      interaction.reply(":x: You do not have a channel set up!");
      return;
    }

    const me = channel.guild.members.me; // the bot as a GuildMember

    if (!me || !channel.permissionsFor(me).has("SendMessages")) {
      interaction.reply(
        `:x: I don't have permissions to send messages to <#${channel.id}>`
      );
      return;
    }

    if (role) {
      if (role.name == "@everyone") {
        return interaction.editReply(":x: The alert-role can't be `@everyone`");
      }
      const me = channel.guild.members.me;
      if (!me) {
        interaction.reply(
          `:x: I don't have permission to mention <@${role.id}>`
        );
        return;
      }

      // check if the bot has permission to @mention all roles
      if (me.permissions.has("MentionEveryone") || role.mentionable) {
        await db.set(`weather.${interaction.guild.id}.role`, role.id);
      } else {
        interaction.reply(
          `:x: I don't have permission to mention <@${role.id}>`
        );
        return;
      }
    }
    await db.set(`weather.${interaction.guild.id}.channel`, channel.id);
    await interaction.reply(
      ":white_check_mark: :white_sun_small_cloud: Weather allerts been set up!"
    );
  },
};
