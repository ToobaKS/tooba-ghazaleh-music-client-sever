import express from "express";
import axios from "axios";

const router = express.Router();

//Lyrics.ovh Api

async function getLyrics(artist, title) {
  try {
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${artist}/${title}`
    );
    const data = await response.json();
    if (data.lyrics) {
      console.log(data.lyrics);
      return data.lyrics;
    } else {
      console.log("Lyrics not found");
      return "Lyrics not found";
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return "Error fetching lyrics";
  }
}

//Deezer API
const baseURL = "https://api.deezer.com";

async function getArtistByGenre(id) {
  try {
    const request = `${baseURL}/genre/${id}/artists`;
    const response = await axios.get(request);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function pickRandomArtist(artists) {
  const randomArtist = artists[Math.floor(Math.random() * artists.length)];
  return randomArtist;
}

function pickRandomSong(songs) {
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  return randomSong;
}

async function getSong(artist) {
  try {
    const request = artist.tracklist;
    const response = await axios.get(request);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

router.get("/genre/:id", async (req, res) => {
  const id = req.params.id;
  const artists = await getArtistByGenre(id);
  const randomArtist = pickRandomArtist(artists.data);
  const songs = await getSong(randomArtist);
  let lyrics = "";
  let randomSong = "";

  while (!lyrics) {
    randomSong = pickRandomSong(songs.data);
    let fullLyrics = await getLyrics(randomArtist.name, randomSong.title);

    const lyricsLines = fullLyrics
      .split("\n")
      .filter((line) => line.trim() !== "");
    if (lyricsLines.length === 0) {
      console.log(
        `No valid lyrics found for ${randomSong.title}, trying another song...`
      );
      continue;
    }

    const firstLyricsSnippet = lyricsLines.slice(0, 6).join(" "); 

    

    console.log(`Matched Lyrics Snippet: ${firstLyricsSnippet}`);
    if (firstLyricsSnippet != "Lyric not found") {
        console.log(firstLyricsSnippet)
      lyrics = firstLyricsSnippet; 
    }
  }

  res.json({
    artist: randomArtist.name,
    song: randomSong.title,
    preview: randomSong.preview,
    lyrics: lyrics || "Lyrics not found",
  });
});

export default router;
