const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invite me to your server! 🚀 || Support server invite'),

	async execute(interaction, client) {
        const inviteUrl= "" //FILL LINK
        var emojis = [
            '😍', '🥰', '😘', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎', '🤍', '💕', '💞', '💗', '💖', '💘', '💝'
        ]
        let emote =  emojis[Math.floor(Math.random() * emojis.length)];
    const inviteButton = new ButtonBuilder()
      .setLabel('Invite me!')
      .setStyle(ButtonStyle.Link)
      .setURL(inviteUrl)
      .setEmoji('📩');
    const row = new ActionRowBuilder().addComponents(inviteButton);

        let embed = new EmbedBuilder()
        .setTitle("Invite me 📈")
        .setColor(0x5865F2)
        .setDescription(`[Click here to invite the bot](${inviteUrl})`)
        .addFields({name:"Support server:",value:"[Join here!]()"})//FILL () WITH LINK
        .setFooter({text:"Thank you for using the bot! "+emote})
		await interaction.reply({embeds:[embed],components:[row]})
	},
};