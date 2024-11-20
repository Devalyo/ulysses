const {Events} = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		const { cooldowns } = interaction.client;	
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, 0);
		}

		const now = Date.now();
		const expirationTime = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (now < expirationTime + cooldownAmount) {
			const expiredTimestamp = Math.round((expirationTime + cooldownAmount) / 1_000);
			if(interaction.member.id == 'akamemis' || interaction.member.id == 'akaems')
			{
				return interaction.reply({ content: `calma amorzinho... <t:${expiredTimestamp}:R>.`});
			}
			return interaction.reply({ content: `calma porra. <t:${expiredTimestamp}:R>.`});
		}
		cooldowns.set(command.data.name, now);
		

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};