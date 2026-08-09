"use client";

import { useEffect, useRef, useState } from "react";

const playlistUrl = "https://music.youtube.com/playlist?list=PLLMp8bI3w5fA&si=dxwmi-KlHWreS6x9";
const spotifyUrl = "https://open.spotify.com/playlist/3sv1rMlHxhoBKEUt0HLkTX?si=YqAFMW-TR4uVi04b9zHuQw";
const playlistId = "PLLMp8bI3w5fA";
const firstVideoId = "DHjXaASKzqM";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  loadPlaylist: (options: { list: string; index: number }) => void;
  getVideoData: () => { title?: string; author?: string; video_id?: string };
};

type YouTubeWindow = Window & {
  YT?: { Player: new (element: string, options: Record<string, unknown>) => YouTubePlayer };
  onYouTubeIframeAPIReady?: () => void;
};

export function JobDashboard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const localThumbnail = `${basePath}/sailaab-thumbnail.png`;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("Loading song…");
  const [songArtist, setSongArtist] = useState("");
  const [songThumbnail, setSongThumbnail] = useState(localThumbnail);

  useEffect(() => {
    const browserWindow = window as YouTubeWindow;
    let pollId: number | undefined;
    const updateSong = (player: YouTubePlayer) => {
      const data = player.getVideoData();
      if (data.title) setSongTitle(data.title);
      if (data.author) setSongArtist(data.author);
      if (data.video_id) setSongThumbnail(`https://i.ytimg.com/vi/${data.video_id}/hqdefault.jpg`);
    };
    const createPlayer = () => {
      if (!browserWindow.YT?.Player || playerRef.current) return;
      playerRef.current = new browserWindow.YT.Player("sailaab-youtube-player", {
        height: "1",
        width: "1",
        videoId: firstVideoId,
        playerVars: { list: playlistId, listType: "playlist", autoplay: 0, controls: 0, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: () => { setPlayerReady(true); if (playerRef.current) updateSong(playerRef.current); },
          onStateChange: (event: { data: number }) => {
            setPlaying(event.data === 1);
            if (playerRef.current && event.data === 1) updateSong(playerRef.current);
          },
        },
      });
    };
    if (browserWindow.YT?.Player) createPlayer();
    else {
      browserWindow.onYouTubeIframeAPIReady = createPlayer;
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
      pollId = window.setInterval(() => {
        if (browserWindow.YT?.Player) {
          window.clearInterval(pollId);
          createPlayer();
        }
      }, 250);
    }
    return () => {
      if (pollId) window.clearInterval(pollId);
      browserWindow.onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  function togglePlayback() {
    const player = playerRef.current;
    if (!player || !playerReady) return;
    if (playing) player.pauseVideo();
    else {
      player.loadPlaylist({ list: playlistId, index: 0 });
      player.playVideo();
    }
  }

  function playNext() {
    if (playerRef.current && playerReady) playerRef.current.nextVideo();
  }

  return (
    <main className="sailaab-page">
      <section className="sailaab-hero" id="top" style={{ backgroundImage: `url("${localThumbnail}")` }}>
        <div className="hero-shade" />
        <header className="sailaab-nav">
          <nav className="platform-links" aria-label="Music platforms">
            <a href={playlistUrl} target="_blank" rel="noreferrer" aria-label="Open YouTube Music"><img src="https://cdn.simpleicons.org/youtubemusic/fff9ef" alt="YouTube Music" /></a>
            <a href={spotifyUrl} target="_blank" rel="noreferrer" aria-label="Open Spotify"><img src="https://cdn.simpleicons.org/spotify/fff9ef" alt="Spotify" /></a>
          </nav>
        </header>

        <div className="hero-title"><h1>Sailaab</h1></div>

        <div className="floating-player">
          <img src={songThumbnail} alt="Current Sailaab song artwork" />
          <div className="floating-info"><b>{songTitle}</b><span>{songArtist}</span></div>
          <button className="round-play" type="button" onClick={togglePlayback} aria-label={playing ? "Pause song" : "Play first song"}>{playing ? "Ⅱ" : "▶"}</button>
          <button className="next-button" type="button" onClick={playNext} aria-label="Play next song">▶|</button>
        </div>
        <div className="yt-engine" id="sailaab-youtube-player" aria-hidden="true" />
      </section>
    </main>
  );
}
