const Discord = require('discord.js');
const { discord } = require('../config.json');

var isReady = false;
var config = discord;

module.exports = async function(emitStatus) {
  const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_WEBHOOKS", "GUILD_PRESENCES"] });
  async function getStatus() {
    if(!isReady) {
      return "unknown";
    }
    var data = (await client.guilds.cache.first().members.fetch()).get(config.authorID);
    if((data.presence && data.presence.status && data.presence.status === "dnd") || !data.presence) {
      return {presence: {
        status: 'offline',
        activities: []
      }}
    }
    return {
      presence: {
        status: data.presence.status,
        activities: data.presence.activities.filter(x => x.name !== "Custom Status")
      }
    }
  }
  client.login(config.token);
  client.on('ready', () => {
    isReady = true;
  });
  client.on('presenceUpdate', data => {
    emitStatus(data);
  });
  return {
    getStatus: getStatus,
    client: client
  }
}