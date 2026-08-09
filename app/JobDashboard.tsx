"use client";

import { useState } from "react";

const playlistUrl = "https://open.spotify.com/playlist/3sv1rMlHxhoBKEUt0HLkTX?si=YqAFMW-TR4uVi04b9zHuQw";
const embedUrl = "https://open.spotify.com/embed/playlist/3sv1rMlHxhoBKEUt0HLkTX?utm_source=generator&si=e27d3e723f764a3d";

export function JobDashboard() {
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <main className="sailaab-page">
      <section className="sailaab-hero" id="top">
        <div className="hero-shade" />
        <header className="sailaab-nav">
          <a className="sailaab-logo" href="#top"><span>✳</span> Sailaab</a>
          <div className="nav-center"><span className="online-dot" /> 40 online</div>
          <nav><a href={playlistUrl} target="_blank" rel="noreferrer">Spotify ↗</a><a href="#playlist" onClick={(event) => { event.preventDefault(); setShowPlaylist(true); document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth" }); }}>Playlist ↘</a></nav>
        </header>

        <div className="hero-title">
          <p className="hero-time">1:47 pm</p>
          <p className="hero-kicker">YOUR PERSONAL SOUNDTRACK</p>
          <h1>Sailaab</h1>
          <p className="hero-subtitle">the playlist you never asked for</p>
        </div>

        <div className="floating-player">
          <img src="/sailaab-thumbnail.png" alt="Sailaab playlist cover" />
          <div className="floating-info"><b>Sailaab</b><span>367 songs · over 24 hours</span><small>Open Spotify to play the playlist</small></div>
          <a className="round-play" href={playlistUrl} target="_blank" rel="noreferrer" aria-label="Play Sailaab on Spotify">▶</a>
        </div>
        <a className="scroll-hint" href="#playlist">scroll to playlist <span>↓</span></a>
      </section>

      <section className="playlist-drawer" id="playlist">
        <div className="drawer-top"><div><p className="drawer-kicker">THE FULL PLAYLIST</p><h2>Sailaab — 367 songs</h2></div><a href={playlistUrl} target="_blank" rel="noreferrer">Open in Spotify ↗</a></div>
        <div className="spotify-box"><iframe title="Sailaab Spotify playlist" src={embedUrl} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /></div>
        <p className="drawer-note">Click any song inside the Spotify player to play that exact song.</p>
      </section>
    </main>
  );
}
