const { JSDOM } = require('jsdom');
const yts = require('yt-search');

module.exports.youtubeSearch = async (query) =>
{
    if(query.includes("spotify"))
    {
        title = await module.exports.HandleSpotifyLink(query)

        return (await yts(title)).videos;
    }
    
    return  (await yts(query)).videos;

}

module.exports.HandleSpotifyLink = async (query) =>
{

    title = await getTitleFromURL(query)
    title = title.replace("- song and lyrics", "").slice(0, -10);

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
        console.error("AAAAAAAAAAAAAAAAAAAA", error);
        return null; 
    }
}


