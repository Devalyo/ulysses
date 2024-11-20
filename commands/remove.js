const {SlashCommandBuilder} = require('discord.js');
const {remove}= require('../utils/player');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('remove')
	.setDescription('remove.....uma musga...')
	.addIntegerOption((option) =>
		option
    .setName("index")
	.setDescription('posição na fila')
	.setRequired(true),
),



async execute(interaction)
{
  
		const guildId = interaction.guild.id
        const index = intraction.options.getInteger('index');

        remove(interaction, index - 1, guildId);

}
}