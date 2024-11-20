const {SlashCommandBuilder} = require('discord.js');
const {clear}= require('../utils/player');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('clear')
	.setDescription('limpa a fila'),


async execute(interaction)
{
		const guildId = interaction.guild.id


        clear(interaction, guildId);

}
}