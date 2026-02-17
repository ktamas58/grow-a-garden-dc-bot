const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock-alerts")
    .setDescription("Set up specific stock alerts to a channel")
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
        .setDescription("Channel for the alert category")
        .addChannelTypes(0)
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("category")
        .setDescription(
          "seed | gear | egg | cosmetics | honey | travelingmerchant"
        )
        .setRequired(true)
        .addChoices(
          { name: "seed", value: "seed" },
          { name: "gear", value: "gear" },
          { name: "egg", value: "egg" },
          { name: "cosmetics", value: "cosmetics" },
          { name: "honey", value: "honey" },
          { name: "traveling-merchant", value: "travelingmerchant" }
        )
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Mention a role when stock update")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const category = interaction.options.getString("category");
    const channel = interaction.options.getChannel("channel");
    const role = interaction.options.getRole("role") || null;
    const status = interaction.options.getBoolean("on-off");

    let data = (await db.get(`stock.${interaction.guild.id}`)) || null;

    if (!status && data.category) {
      await db.delete(`stock.${interaction.guild.id}.${category}`);
      interaction.reply(
        `:white_check_mark: Alerts for: **${category}** are off! :wastebasket:`
      );
      return;
    } else if (!status && data.category) {
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
        await db.set(`stock.${interaction.guild.id}.${category}.role`, role.id);
      } else {
        interaction.reply(
          `:x: I don't have permission to mention <@${role.id}>`
        );
        return;
      }
    }
    await db.set(`stock.${interaction.guild.id}.${category}.channel`, channel.id);
    await interaction.reply(
      ":white_check_mark: :scroll:  Stock allerts been set up!"
    );
  },
};
