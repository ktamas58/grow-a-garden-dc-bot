const { REST, Routes } = require('discord.js');
const { clientId } = require('../config.json'); 
require('dotenv').config();
let token = process.env.DISCORD_TOKEN
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('⛔ Deleting globale commands...');
    
    const commands = await rest.get(Routes.applicationCommands(clientId));
    console.log(commands)

    const target = commands.find(cmd => cmd.name === ''); //insert command name

    if (target) {
      await rest.delete(Routes.applicationCommand(clientId, target.id));
      console.log(`✅ Command deleted: ${target.name}`);
    } else {
      console.log('⚠️ Cannot find this command');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
