"use client";

import { useState } from "react";

const playlistUrl = "https://www.youtube.com/watch?v=DHjXaASKzqM&list=PLLMp8bI3w5fA";
const embedUrl = "https://www.youtube.com/embed/DHjXaASKzqM?list=PLLMp8bI3w5fA&autoplay=0&rel=0&modestbranding=1";

export function JobDashboard() {
  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <main className="sailaab-page">
      <section className="sailaab-hero" id="top">
        <div className="hero-shade" />
        <header className="sailaab-nav">
          <a className="sailaab-logo" href="#top"><span>✳</span> Sailaab</a>
          <nav><a href={playlistUrl} target="_blank" rel="noreferrer">YouTube ↗</a><a href="#playlist" onClick={(event) => { event.preventDefault(); setShowPlaylist(true); document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth" }); }}>Playlist ↘</a></nav>
        </header>

        <div className="hero-title">
          <h1>Sailaab</h1>
        </div>

        <div className="floating-player">
          <img src="/sailaab-thumbnail.png" alt="Sailaab playlist cover" />
          <div className="floating-info"><b>Sailaab</b><span>YouTube playlist · imported from Spotify</span><small>Play inside this page below</small></div>
          <button className="round-play" type="button" onClick={() => document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth" })} aria-label="Play Sailaab playlist">▶</button>
        </div>
        <a className="scroll-hint" href="#playlist">scroll to playlist <span>↓</span></a>
      </section>

      <section className="playlist-drawer" id="playlist">
        <div className="drawer-top"><div><p className="drawer-kicker">THE FULL PLAYLIST</p><h2>Sailaab on YouTube</h2></div><a href={playlistUrl} target="_blank" rel="noreferrer">Open YouTube ↗</a></div>
        <div className="spotify-box youtube-box"><iframe title="Sailaab YouTube playlist" src={embedUrl} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /></div>
        <p className="drawer-note">Click any song in the YouTube playlist to play it inside this page.</p>
      </section>
    </main>
  );
}
