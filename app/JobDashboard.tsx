"use client";

import { useState } from "react";

const playlistUrl = "https://music.youtube.com/playlist?list=PLLMp8bI3w5fA&si=4MA7cmhK3Q46JJR9";
const embedUrl = "https://www.youtube.com/embed/DHjXaASKzqM?list=PLLMp8bI3w5fA&rel=0&modestbranding=1";

export function JobDashboard() {
  const [playRequested, setPlayRequested] = useState(false);
  const playerUrl = `${embedUrl}&autoplay=${playRequested ? "1" : "0"}`;

  return (
    <main className="sailaab-page">
      <section className="sailaab-hero" id="top">
        <div className="hero-shade" />
        <header className="sailaab-nav">
          <a className="sailaab-logo" href="#top"><span>✳</span> Sailaab</a>
          <nav><a href={playlistUrl} target="_blank" rel="noreferrer">YouTube Music ↗</a><a href="#playlist" onClick={(event) => { event.preventDefault(); document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth" }); }}>Playlist ↘</a></nav>
        </header>

        <div className="hero-title">
          <h1>Sailaab</h1>
        </div>

        <div className="floating-player">
          <img src="/sailaab-thumbnail.png" alt="Sailaab playlist cover" />
          <div className="floating-info"><b>Sailaab</b><span>YouTube playlist · imported from Spotify</span><small>Play inside this page below</small></div>
          <button className="round-play" type="button" onClick={() => { setPlayRequested(true); document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth" }); }} aria-label="Play Sailaab playlist">▶</button>
        </div>
        <a className="scroll-hint" href="#playlist">scroll to playlist <span>↓</span></a>
      </section>

      <section className="playlist-drawer" id="playlist">
        <div className="drawer-top"><div><p className="drawer-kicker">THE FULL PLAYLIST</p><h2>Sailaab on YouTube</h2></div><a href={playlistUrl} target="_blank" rel="noreferrer">Open YouTube ↗</a></div>
        <div className="spotify-box youtube-box"><iframe title="Sailaab YouTube playlist" src={playerUrl} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" /></div>
        <p className="drawer-note">Click any song in the YouTube player to play it inside this page. If autoplay is blocked, press play once inside the player.</p>
      </section>
    </main>
  );
}
