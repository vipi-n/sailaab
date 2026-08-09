"use client";

import { useRef, useState } from "react";

const playlistUrl = "https://music.youtube.com/playlist?list=PLLMp8bI3w5fA&si=dxwmi-KlHWreS6x9";
const spotifyUrl = "https://open.spotify.com/playlist/3sv1rMlHxhoBKEUt0HLkTX?si=YqAFMW-TR4uVi04b9zHuQw";
const playlistId = "PLLMp8bI3w5fA";
const firstVideoId = "DHjXaASKzqM";

export function JobDashboard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const localThumbnail = `${basePath}/sailaab-thumbnail.png`;
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [songTitle] = useState("Mujhse Mohabbat Ka Izhaar Karta");
  const [songArtist] = useState("Satrang Music Official");
  const [songThumbnail, setSongThumbnail] = useState(localThumbnail);

  function togglePlayback() {
    const player = playerRef.current;
    if (!player) return;
    if (!started) {
      player.src = `https://www.youtube.com/embed/${firstVideoId}?list=${playlistId}&listType=playlist&autoplay=1&controls=0&playsinline=1&rel=0&enablejsapi=1`;
      setStarted(true);
      setPlaying(true);
      return;
    }
    player.contentWindow?.postMessage(JSON.stringify({ event: "command", func: playing ? "pauseVideo" : "playVideo", args: [] }), "*");
    setPlaying(!playing);
  }

  function playNext() {
    if (!playerRef.current || !started) return;
    playerRef.current.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "nextVideo", args: [] }), "*");
    setPlaying(true);
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
        <iframe
          ref={playerRef}
          className="yt-engine"
          title="Sailaab music player"
          src={`https://www.youtube.com/embed/${firstVideoId}?list=${playlistId}&listType=playlist&autoplay=0&controls=0&playsinline=1&rel=0&enablejsapi=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      </section>
    </main>
  );
}
