const {Events} = require('discord.js');


module.exports = {

	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`${client.user.tag} online 🔥🔥`);
		console.log(client.guilds.cache.map(guild => guild.name));
	},

};