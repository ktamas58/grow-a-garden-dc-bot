# Grow a Garden Discord Bot 🌱

A Discord bot that tracks **in-game items in Roblox "Grow a Garden"** in real-time and shares them directly in your server. This bot is all in one, with data storege, command deploy script to discord, and an api puller.

---

## Features 

- 🔹 **Real-time item tracking** from API "[Grow a Garden Fandom Wiki](https://growagarden.fandom.com/wiki/) and [gagstock.gleeze.com](https://gagstock.gleeze.com/grow-a-garden)"  
- 🔹 **Slash commands** for easy interaction and command file structure
- 🔹 **Automatic data fetching, and messaging in a specific channel**
- 🔹 **Easy to use quick.db database for caching items**
- 🔹 **Customizable mentions when a stock is udated**

---

## Tech Stack 

- **Language:** JavaScript / Node.js  
- **Discord API:** Discord.js v14  
- **Database:** quick.db (wrapper for better-sqlite3)

---


### Installation steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ktamas58/grow-a-garden-dc-bo).git
   cd grow-a-garden-bot
   npm install
    ```
2. Configure enviroment variables
   -  create an .env file similar to the "env-example.md"
   -  fill out the config.json
   -  deploy the slash commands:
    ```bash
    deploy-commands\deploy-commands.js
    ```
    -  run the bot: "node ."
![Node](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)


   
