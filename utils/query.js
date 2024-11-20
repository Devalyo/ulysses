const { JSDOM } = require('jsdom');
const yts = require('yt-search');

module.exports.youtubeSearch = async (query) =>
{
    if(query.includes("spotify"))
    {
        return await yts(await module.exports.HandleSpotifyLink(query)).videos;
    }
    
    return  (await yts(query)).videos;

}

module.exports.HandleSpotifyLink = async (query) =>
{

    title = await getTitleFromURL(query)
    title = title.replace("- song and lyrics", "").slice(0, -10);
    console.log(title);

    return title; 


}


async function getTitleFromURL(url) {

    try {
        const response = await fetch(url);
        const html = await response.text();

        const dom = new JSDOM(html);

        const title = dom.window.document.querySelector("title").textContent;

        return title;
    } catch (error) {
        console.error("Error fetching title:", error);
        return null; 
    }
}


