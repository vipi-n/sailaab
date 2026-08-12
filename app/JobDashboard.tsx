"use client";

import { useEffect, useRef, useState } from "react";
import { playlistTracks } from "./playlist";

const playlistUrl = "https://music.youtube.com/playlist?list=PLLMp8bI3w5fA&si=dxwmi-KlHWreS6x9";
const spotifyUrl = "https://open.spotify.com/playlist/3sv1rMlHxhoBKEUt0HLkTX?si=YqAFMW-TR4uVi04b9zHuQw";
const videoEmbedUrl = (videoId: string, origin: string) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&disablekb=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;

export function JobDashboard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const heroBackground = `${basePath}/sailaab-storm-painting-v3.png`;
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const currentSongRef = useRef<HTMLButtonElement | null>(null);
  const currentIndexRef = useRef(0);
  const advancingRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [embedSrc, setEmbedSrc] = useState("");
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const currentTrack = playlistTracks[currentIndex];
  const songThumbnail = `https://i.ytimg.com/vi/${currentTrack.id}/hqdefault.jpg`;

  useEffect(() => {
    setEmbedSrc(videoEmbedUrl(playlistTracks[0].id, window.location.origin));

    function receivePlayerMessage(event: MessageEvent) {
      if (!event.origin.includes("youtube.com")) return;
      let payload: { event?: string; info?: { currentTime?: number; duration?: number; playerState?: number } };
      try {
        payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (payload.event !== "infoDelivery" || !payload.info) return;
      if (typeof payload.info.playerState === "number") {
        const playerState = payload.info.playerState;
        setPlaying(playerState === 1);
        if (playerState === 1) advancingRef.current = false;
        if (playerState === 0 && !advancingRef.current) {
          advancingRef.current = true;
          const nextIndex = (currentIndexRef.current + 1) % playlistTracks.length;
          const nextTrack = playlistTracks[nextIndex];
          currentIndexRef.current = nextIndex;
          connectPlayer();
          sendPlayerCommand("loadVideoById", [nextTrack.id]);
          setCurrentIndex(nextIndex);
          setCurrentTime(0);
          setDuration(0);
          setPlaying(true);
        }
      }
      if (typeof payload.info.currentTime === "number") setCurrentTime(payload.info.currentTime);
      if (typeof payload.info.duration === "number") setDuration(payload.info.duration);
    }
    window.addEventListener("message", receivePlayerMessage);
    return () => window.removeEventListener("message", receivePlayerMessage);
  }, []);

  useEffect(() => {
    if (!playlistOpen) return;
    const frame = requestAnimationFrame(() => currentSongRef.current?.scrollIntoView({ block: "center" }));
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPlaylistOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [playlistOpen, currentIndex]);

  function sendPlayerCommand(command: "playVideo" | "pauseVideo" | "loadVideoById" | "seekTo", args: unknown[] = []) {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args }),
      "https://www.youtube.com",
    );
  }

  function connectPlayer() {
    const frame = playerRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(JSON.stringify({ event: "listening", id: "sailaab-player", channel: "sailaab" }), "https://www.youtube.com");
    frame.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }), "https://www.youtube.com");
  }

  function togglePlayback() {
    const player = playerRef.current;
    if (!player) return;
    connectPlayer();
    sendPlayerCommand(playing ? "pauseVideo" : "playVideo");
    setPlaying(!playing);
  }

  function playNext() {
    if (!playerRef.current) return;
    const nextIndex = (currentIndex + 1) % playlistTracks.length;
    const nextTrack = playlistTracks[nextIndex];
    connectPlayer();
    sendPlayerCommand("loadVideoById", [nextTrack.id]);
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
  }

  function playPrevious() {
    if (!playerRef.current) return;
    const previousIndex = (currentIndex - 1 + playlistTracks.length) % playlistTracks.length;
    const previousTrack = playlistTracks[previousIndex];
    connectPlayer();
    sendPlayerCommand("loadVideoById", [previousTrack.id]);
    currentIndexRef.current = previousIndex;
    setCurrentIndex(previousIndex);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
  }

  function playTrack(index: number) {
    if (!playerRef.current) return;
    const track = playlistTracks[index];
    connectPlayer();
    sendPlayerCommand("loadVideoById", [track.id]);
    currentIndexRef.current = index;
    setCurrentIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(true);
  }

  function seekTo(seconds: number) {
    connectPlayer();
    sendPlayerCommand("seekTo", [seconds, true]);
    setCurrentTime(seconds);
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  return (
    <main className="sailaab-page">
      <section className="sailaab-hero" id="top">
        <div className="ocean-scene" style={{ backgroundImage: `url("${heroBackground}")` }} aria-hidden="true" />
        <div className="moving-cloud cloud-one" aria-hidden="true" />
        <div className="moving-cloud cloud-two" aria-hidden="true" />
        <div className="moving-wave wave-back" aria-hidden="true" />
        <div className="moving-wave wave-front" aria-hidden="true" />
        <div className="song-color-wash" style={{ backgroundImage: `url("${songThumbnail}")` }} aria-hidden="true" />
        <div className="hero-shade" />
        <header className="sailaab-nav">
          <nav className="platform-links" aria-label="Music platforms">
            <a href={playlistUrl} target="_blank" rel="noreferrer" aria-label="Open YouTube Music"><img src="https://cdn.simpleicons.org/youtubemusic/FF0000" alt="YouTube Music" /></a>
            <a href={spotifyUrl} target="_blank" rel="noreferrer" aria-label="Open Spotify"><img src="https://cdn.simpleicons.org/spotify/1ED760" alt="Spotify" /></a>
          </nav>
        </header>

        <div className="hero-title">
          <h1>Sailaab</h1>
          <p className="hero-hindi" lang="hi">सैलाब</p>
        </div>

        <div className="floating-player">
          <div className={`disc-art${playing ? " is-spinning" : ""}`}>
            <img src={songThumbnail} alt="Current Sailaab song artwork" />
          </div>
          <div className="floating-info">
            <b>{currentTrack.title}</b>
            <span>{currentTrack.artist}</span>
            <div className="progress-row">
              <small>{formatTime(currentTime)}</small>
              <input
                aria-label="Song progress"
                className="progress-slider"
                type="range"
                min="0"
                max={duration || 100}
                step="1"
                value={duration ? Math.min(currentTime, duration) : 0}
                onChange={(event) => seekTo(Number(event.target.value))}
                style={{ background: `linear-gradient(to right, rgba(255,249,239,.9) 0%, rgba(255,249,239,.9) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,.2) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,.2) 100%)` }}
              />
              <small>{formatTime(duration)}</small>
            </div>
          </div>
          <button className="transport-button previous-button" type="button" onClick={playPrevious} aria-label="Play previous song">|◀</button>
          <button className="round-play" type="button" onClick={togglePlayback} aria-label={playing ? "Pause song" : "Play first song"}>{playing ? "Ⅱ" : "▶"}</button>
          <button className="transport-button next-button" type="button" onClick={playNext} aria-label="Play next song">▶|</button>
        </div>
        <button
          className="playlist-toggle"
          type="button"
          aria-label="Show all songs"
          aria-controls="sailaab-song-list"
          aria-expanded={playlistOpen}
          onClick={() => setPlaylistOpen(true)}
        >
          <span aria-hidden="true">☷</span>
          <small>{playlistTracks.length}</small>
        </button>
        {playlistOpen && (
          <>
            <button className="playlist-backdrop" type="button" aria-label="Close song list" onClick={() => setPlaylistOpen(false)} />
            <aside className="playlist-drawer" id="sailaab-song-list" role="dialog" aria-modal="true" aria-label="Sailaab songs">
              <div className="playlist-drawer-header">
                <div>
                  <small>SAILAAB</small>
                </div>
                <button type="button" onClick={() => setPlaylistOpen(false)} aria-label="Close song list">×</button>
              </div>
              <div className="song-list">
                {playlistTracks.map((track, index) => (
                  <button
                    className={`song-row${index === currentIndex ? " is-current" : ""}`}
                    key={track.id}
                    ref={index === currentIndex ? currentSongRef : undefined}
                    type="button"
                    onClick={() => playTrack(index)}
                  >
                    <span className="song-number">{index === currentIndex && playing ? "Ⅱ" : String(index + 1).padStart(2, "0")}</span>
                    <img src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`} alt="" loading="lazy" />
                    <span className="song-copy"><b>{track.title}</b><small>{track.artist}</small></span>
                    <span className="song-play" aria-hidden="true">▶</span>
                  </button>
                ))}
              </div>
            </aside>
          </>
        )}
        <div className="yt-engine-wrap" aria-hidden="true">
          <iframe
            ref={playerRef}
            className="yt-engine"
            title={currentTrack.title}
            width="640"
            height="360"
            src={embedSrc || undefined}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onLoad={connectPlayer}
          />
        </div>
      </section>
    </main>
  );
}
