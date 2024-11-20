const { SlashCommandBuilder } = require('discord.js');
const { exec } = require("child_process");
const {script} = require("../config.json")

module.exports = {
    cooldown: 300,
    data: new SlashCommandBuilder()
        .setName('emiri')
        .setDescription("flooda a tela do computador do daniel com fotos da emily"),

    async execute(interaction)
    {
        exec(script, (error, stderr) => 
        {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
        })
        interaction.reply("👍") 

    }
}
