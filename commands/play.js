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

/* TODO autocomplete search */

async execute(interaction)
{
		const voiceChannel = interaction.member.voice.channel;
		const textChannel = interaction.channel
		const guildId = interaction.guild.id

		const query = interaction.options.getString('musga');
		/// Sanitize
		if(query.length > 73)
		{
			query = query.slice(0, 73)
		}

		if(!voiceChannel)
		{
			return interaction.reply(`${interaction.member.displayName}, não está em um canal de voz.`)
		}

		await interaction.deferReply();
		song = await youtubeSearch(query)
		song = song.at(0)
		console.log(song)
		
		addToQueue(guildId, song, voiceChannel, textChannel);
		interaction.followUp(`**"${song.title}"** na fila!!!`)

}
}