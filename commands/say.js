const { SlashCommandBuilder } = require('discord.js');
const {getAIresponse} = require('../utils/gemini.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription("fale com a emiri")
        .addStringOption((option) =>
            option
        .setName('prompt')
        .setDescription('fala tu')
        .setRequired(true)),

    async execute(interaction)
    {
        const prompt = interaction.options.getString('prompt')
        const channel = interaction.channel;

        interaction.deferReply("👍") 
        const response = await getAIresponse(prompt);
        
        if (response.length > 2000) 
        {

            const messageNumber = Math.ceil(response.length / 2000);
            for (let i = 0; i < messageNumber; i++) {
                const chunk = response.slice(i * 2000,(i + 1) * 2000);
                
                if (i === 0) {
                    await interaction.followUp(chunk);
                } else {
                    await channel.send(chunk);
                }
            }

        } 
        else 
        {
            await interaction.followUp(response);
        }
        
    }
}