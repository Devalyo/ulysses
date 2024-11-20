const {joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus} = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');  
const {EmbedBuilder} = require('discord.js');


let player = null;
let connection = null;

queues = new Map()
/// Make song dict that holds playing?, url, and title ??? actual retard


module.exports.joinChannel = (channel, guildId) => {
    if (connection) {
        console.log("Already connected to a voice channel.");
        return;
    }

    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        bitrate: 96000,
    });
};



module.exports.addToQueue = async (guildId, song, channel, textChannel) => {
    if (!queues.has(guildId)) {
        queues.set(guildId, []);
    }

    const queue = queues.get(guildId);
    queue.push(song); 
    console.log(`Added song to queue`);
    if (queue.length === 1) {
        module.exports.playNextSong(guildId, channel, textChannel); 
    }
};



module.exports.playNextSong = async (guildId, channel, textChannel) => {

    const queue = queues.get(guildId);
    if (queue.length === 0) {
        console.log("Queue is empty.");
        connection.destroy();
        connection = null;
        return;
    }
    
    if(!connection)
    {
        module.exports.joinChannel(channel, guildId)
        
    }
   

    const song = queue[0]; 
    player = createAudioPlayer();
    console.log(song)
    stream = ytdl(song.url, {
        filter: 'audioonly',
        type: 'opus',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
}}});

    const audioResource = createAudioResource(stream)
    player.play(audioResource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
        console.log(`Now playing: ${song.title}`);
        createEmbed(textChannel, song)
      
    });

    player.on(AudioPlayerStatus.Idle, () => {
        queue.shift(); 
        module.exports.playNextSong(guildId, channel, textChannel);
    });
};



module.exports.skipSong = (interaction, guildId, channel) => {
    const queue = queues.get(guildId);
    if (queue) {
        interaction.reply(`pulando **"${queue[0].title}"**`)
        player.stop();
        queue.shift()
        console.log("Skipping current song.");
        this.playNextSong(guildId, channel, interaction.channel);
    }


};


module.exports.fila = (interaction, guildId) => {
    const queue = queues.get(guildId);
    if (!queue || queue.length() < 1)
    {
        interaction.reply("fila vazia"); 
        return
    }

    message = "```\n"
    message += "1 - " + queue[0].title + "\n";

    for(i = 1; i < queue.length(); i++)
    {
        message += (i + 1) + " - " + queue[i].title + "\n"; 

    }

    interaction.reply(message + "```");

};



module.exports.stopAudio = () => {
    if (player) {
        player.stop();
        connection.destroy();
    }
};

module.exports.remove = (interaction, index, guildId) => {

    queue = queues.get(guildId)
    if(!queue)
    {
        interaction.reply("fila?????")
        return
    }

    song = queue[index]
    if(!song)
    {
        interaction.reply("posição invalida")
    }

    interaction.reply(`**"${song.title}"** removido da fila`)
    queue.splice(index, 1);

};

module.exports.clear = (interaction, guildId) => {

    queue = queues.get(guildId)
    if(!queue)
    {
        interaction.reply("fila?????/")
        return
    }

    queue = [];

    interaction.reply("👍")
};


function createEmbed(channel, song)
{
    const exampleEmbed = new EmbedBuilder()
	.setColor(0xD91010)
	.setTitle(`${song.title}`)
	.setURL(song.url)
	.setDescription(song.description + "\n")
	.setImage(song.thumbnail);


channel.send({
    content: "Tocano:", 
    embeds: [exampleEmbed] });

}