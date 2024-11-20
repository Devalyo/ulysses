const {SlashCommandBuilder} = require('discord.js');
const {addToQueue}= require('../utils/player');
const {youtubeSearch} = require('../utils/query.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('play')
	.setDescription('musgas')
	.addStringOption((option) =>
		option
	.setName('musga')
	.setDescription('The song to play')
	.setRequired(true),
),



async execute(interaction)
{
		const voiceChannel = interaction.member.voice.channel;
		const textChannel = interaction.channel
		const guildId = interaction.guild.id

		if(!voiceChannel)
		{
			return interaction.reply(`${interaction.member.displayName}, entre em um canal de voz.`)
		}

		song = await youtubeSearch(interaction.options.getString('musga'))
		song = song.at(0)
		console.log(song)

		addToQueue(guildId, song, voiceChannel, textChannel);
		interaction.reply(`**"${song.title}"** na fila!!!`)

}
}