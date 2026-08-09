"use client";

import { useEffect, useRef, useState } from "react";

const playlistUrl = "https://music.youtube.com/playlist?list=PLLMp8bI3w5fA&si=dxwmi-KlHWreS6x9";
const spotifyUrl = "https://open.spotify.com/playlist/3sv1rMlHxhoBKEUt0HLkTX?si=YqAFMW-TR4uVi04b9zHuQw";
const playlistId = "PLLMp8bI3w5fA";

const playlistEmbedUrl = (autoplay: boolean) =>
  `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=${autoplay ? 1 : 0}&controls=0&playsinline=1&rel=0&enablejsapi=1`;

export function JobDashboard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const localThumbnail = `${basePath}/sailaab-thumbnail.png`;
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songThumbnail, setSongThumbnail] = useState(localThumbnail);

  useEffect(() => {
    function receivePlayerMessage(event: MessageEvent) {
      if (!event.origin.includes("youtube.com")) return;
      let payload: { event?: string; info?: { playerState?: number; videoData?: { title?: string; author?: string; video_id?: string } } };
      try {
        payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (payload.event !== "infoDelivery" || !payload.info) return;
      if (typeof payload.info.playerState === "number") setPlaying(payload.info.playerState === 1);
      const video = payload.info.videoData;
      if (!video) return;
      if (video.title) setSongTitle(video.title);
      if (video.author) setSongArtist(video.author);
      if (video.video_id) setSongThumbnail(`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`);
    }
    window.addEventListener("message", receivePlayerMessage);
    return () => window.removeEventListener("message", receivePlayerMessage);
  }, []);

  function connectPlayer() {
    playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "sailaab-player" }), "*");
  }

  function togglePlayback() {
    const player = playerRef.current;
    if (!player) return;
    if (!started) {
      player.src = playlistEmbedUrl(true);
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
      <section className="sailaab-hero" id="top">
        <div className="ocean-scene" style={{ backgroundImage: `url("${localThumbnail}")` }} aria-hidden="true" />
        <div className="moving-wave wave-back" aria-hidden="true" />
        <div className="moving-wave wave-front" aria-hidden="true" />
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
          {songTitle && <div className="floating-info"><b>{songTitle}</b>{songArtist && <span>{songArtist}</span>}</div>}
          {!songTitle && <div className="floating-spacer" aria-hidden="true" />}
          <button className="round-play" type="button" onClick={togglePlayback} aria-label={playing ? "Pause song" : "Play first song"}>{playing ? "Ⅱ" : "▶"}</button>
          <button className="next-button" type="button" onClick={playNext} aria-label="Play next song">▶|</button>
        </div>
        <iframe
          ref={playerRef}
          className="yt-engine"
          title="Sailaab music player"
          src={playlistEmbedUrl(false)}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={connectPlayer}
        />
      </section>
    </main>
  );
}
