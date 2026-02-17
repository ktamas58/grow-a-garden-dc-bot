const { Events, MessageFlags } = require("discord.js");
const { QuickDB } = require("quick.db");
const { owner } = require("../config.json");
const db = new QuickDB();
const fs = require("fs");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.user.bot) return;
    if (interaction.user.id !== owner) {
      if (!interaction.inGuild()) {
        return interaction.reply({
          content: ":x: Commands are disabled in DMs.",
          flags: 64,
        });
      }
      if (!interaction.guild) {
        return interaction.reply({
          content: ":x: Commands are disabled in DMs.",
          flags: 64,
        });
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }

      try {
        await command.execute(interaction, client);

        function getFormattedDate() {
          const now = new Date();

          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");

          return `${month}.${day}. ${hours}:${minutes}`;
        }
        let fileName = "./data/" + "usage.txt";
        if (interaction.user.id !== owner) {
          fs.appendFile(
            fileName,
            `${interaction.commandName}   <->${interaction.guild.name}(${interaction.guild.id})=guild ___ ${interaction.channel.name}(${interaction.channel.id})=channel ___ ${interaction.user.tag}(${interaction.user.id}) ___ ${getFormattedDate()} \n`,
            (err) => {
              if (err) throw err;
            },
          );
        }
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content:
              ":x: There was an error during the executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }
  },
};
