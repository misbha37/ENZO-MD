const { zokou } = require("../framework/zokou");
const yts = require("yt-search");
const axios = require("axios");

zokou({
  nomCom: "video",
  categorie: "Search",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("Which song do you want?");
    return;
  }

  try {
    const searchQuery = arg.join(" ");
    const results = await yts(searchQuery);
    const video = results.videos[0]; // Get the first video from the results

    if (video && video.url) {
      const songDetails = {
        image: { url: video.thumbnail },
        caption: `*ENZO-MD VIDEO PLAYER*\n\nJoin for more tracks of the song:\nhttps://t.me/enzotech\n╭───────────────◆\n│ *Title:* ${video.title}\n│ *Duration:* ${video.timestamp}\n│ *Yt link:* ${video.url}\n╰────────────────◆`
      };

      await zk.sendMessage(origineMessage, songDetails, { quoted: commandeOptions.ms });

      const response = await axios.get(`https://widipe.com/download/ytdl?url=${video.url}`);
      const data = response.data;

      if (data && data.result && data.result.mp4 && data.result.title) {
        const fileName = `${data.result.title}.mp4`;

        // Send as document
        await zk.sendMessage(origineMessage, {
          document: { url: data.result.mp4 },
          mimetype: "video/mp4",
          fileName: fileName
        }, { quoted: commandeOptions.ms });

        // Send as video
        await zk.sendMessage(origineMessage, {
          video: { url: data.result.mp4 },
          mimetype: "video/mp4",
          fileName: fileName
        }, { quoted: commandeOptions.ms });
      } else {
        repondre("Download failed: No valid data found.");
      }
    } else {
      repondre("No video found.");
    }
  } catch (error) {
    console.error("Error during search or download:", error);
    repondre("Download failed due to an error.");
  }
});

zokou({
  nomCom: "play",
  categorie: "Search",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("Which song do you want?");
    return;
  }

  try {
    const searchQuery = arg.join(" ");
    const results = await yts(searchQuery);
    const video = results.videos[0]; // Get the first video from the results

    if (video) {
      const songDetails = {
        image: { url: video.thumbnail },
        caption: `*ENZO-MD SONG PLAYER*\nJoin for more tracks: https://t.me/enzo\n╭───────────────◆\n│ *Title:* ${video.title}\n│ *Duration:* ${video.timestamp}\n│ *Yt link:* ${video.url}\n╰────────────────◆`
      };

      await zk.sendMessage(origineMessage, songDetails, { quoted: commandeOptions.ms });

      const response = await axios.get(`https://widipe.com/download/ytdl?url=${video.url}`);
      const data = response.data;

      if (data && data.result && data.result.mp3) {
        await zk.sendMessage(origineMessage, {
          document: { url: data.result.mp3 },
          mimetype: "audio/mp3",
          fileName: `${data.result.title}.mp3`
        }, { quoted: commandeOptions.ms });
      } else {
        repondre("Download failed: No valid data found.");
      }
    } else {
      repondre("No video found.");
    }
  } catch (error) {
    console.error("Error during search or download:", error);
    repondre("Download failed: " + error.message);
  }
});
