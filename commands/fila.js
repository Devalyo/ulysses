const {SlashCommandBuilder} = require('discord.js');
const {fila}= require('../utils/player');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('fila')
	.setDescription('...fila'),


async execute(interaction)
{
		const guildId = interaction.guild.id
        fila(interaction, guildId);
}
}