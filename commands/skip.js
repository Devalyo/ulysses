const {SlashCommandBuilder } = require('discord.js');
const {skipSong}= require('../utils/player');

module.exports = 
{
    data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skipiddi toilet'),

    async execute(interaction){

        const channel = interaction.member.voice.channel;
        const guildId = interaction.guild.id
       skipSong(interaction, guildId, channel) 

    }
}

