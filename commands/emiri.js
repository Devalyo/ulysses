const { SlashCommandBuilder } = require('discord.js');
const { exec } = require("child_process");
const { stdout, stderr } = require('process');


module.exports = {
    cooldown: 300,
    data: new SlashCommandBuilder()
        .setName('emiri')
        .setDescription("flooda a tela do computador do daniel com fotos da emily"),
    async execute(interaction)
    {
        exec("/media/clava/HDD/code/scripts/emily.sh", (error, stderr) => 
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
        interaction.reply("👍") //// ephemeral = true to make it visible only to the user that executes it

    }
}
