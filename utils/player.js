const {joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus} = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');  
const {EmbedBuilder} = require('discord.js');

const connections = new Map(); // store connections by guild id

let player = null;
// let connection = null;

let queues = new Map()
/// Make song dict that holds playing?, url, and title /// ??? actual retard // trueee


module.exports.joinChannel = (channel, guildId) => {
    // check for an existing connection in the server
    if (connections.has(guildId)) {
        console.log("Already connected to a voice channel in this server.");
        return;
    }

    let connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        bitrate: 96000,
    });

    // add server and connection to current connections
    connections.set(guildId, connection);
};



module.exports.addToQueue = async (guildId, song, channel, textChannel) => {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            queue: [],
            index: 0,
        });
    }

    const queue = queues.get(guildId).queue;
    queue.push(song); 
    console.log(`Added song to queue`);
    if (queue.length === 1) {
        module.exports.playNextSong(guildId, channel, textChannel); 
    }
};



module.exports.playNextSong = async (guildId, channel, textChannel) => {
    let connection = connections.get(guildId);

    let queue = queues.get(guildId).queue;
    let index = queues.get(guildId).index;
    if (queue.length === 0 || index >= queue.length) {
        console.log("Queue is empty.");
        connection.destroy();
        // connection = null;
        connections.delete(guildId);
        return;
    }
    
    if(!connection)
    {
        module.exports.joinChannel(channel, guildId)
    }
   
    const song = queue[index]; 
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

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch (error) {
            queues.delete(guildId);
            console.log("AAAAAAAAAAAA")
            if (player) { player.stop(); }
            if (connection) { connection.destroy(); }
            // connection = null;
            connections.delete(guildId);
        }
    });


    player.on(AudioPlayerStatus.Playing, () => {
        console.log(`Now playing: **"${song.title}"**`);
        createEmbed(textChannel, song)
        
    });
    
    player.on(AudioPlayerStatus.Idle, () => {
        // queue.shift(); 
        queues.get(guildId).index++;
        module.exports.playNextSong(guildId, channel, textChannel);
    });
};



module.exports.skipSong = (interaction, guildId, channel) => {

    const queue = queues.get(guildId).queue;
    let index = queues.get(guildId).index;
    if (queue) {
        interaction.reply(`pulando **"${queue[index].title}"**`)
        player.stop();
        // queue.shift()
        queues.get(guildId).index++;
        console.log("Skipping current song.");
        this.playNextSong(guildId, channel, interaction.channel);
    }
    else
    {
        interaction.reply("fila?????")
    }

};



module.exports.fila = (interaction, guildId) => {

    const queue = queues.get(guildId).queue;
    let index = queues.get(guildId).index;
    if (!queue || queue.length < 1 || index >= queue.length)
    {
        interaction.reply("fila vazia"); 
        return
    }

    message = "```\n"
    message += "1 - " + queue[index].title + " **TOCANDO AGORA**\n";

    for(i = 1; i < queue.length; i++)
    {
        message += (i + 1) + " - " + queue[i].title + "\n"; 

    }

    interaction.reply(message + "```");

};



module.exports.remove = (interaction, index, guildId) => {

    queue = queues.get(guildId).queue;
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

    queue = queues.get(guildId).queue
    if(!queue)
    {
        interaction.reply("fila?????/")
        return
    }
    
    queue.splice(1);
    queues.set(guildId, queue);

    interaction.reply("👍")
};



function createEmbed(channel, song)
{
    const songEmbed = new EmbedBuilder()
	.setColor(0xD91010)
	.setTitle(`${song.title}`)
	.setURL(song.url)
    .setThumbnail('https://i.imgur.com/ji0uADI.jpeg')
	.setDescription(song.description + "\n")
	.setImage(song.thumbnail)
    .setAuthor({ name: "Tocando agora"})
    .setFooter({ text: "Duração: " + song.duration.timestamp});  


    channel.send({ embeds: [songEmbed] });

}
