"use client";

import { useEffect, useState } from "react";

const playlistUrl = "https://open.spotify.com/playlist/3sv1rMlHxhoBKEUt0HLkTX";

function extractPlaylistId(value: string) {
  const match = value.match(/playlist[/:]([a-zA-Z0-9]+)|^([a-zA-Z0-9]{22})$/);
  return match?.[1] ?? match?.[2] ?? "";
}

export function JobDashboard() {
  const [url, setUrl] = useState(playlistUrl);
  const [playlistCover, setPlaylistCover] = useState("");
  const playlistId = extractPlaylistId(url);

  useEffect(() => {
    let cancelled = false;
    const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}`;
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data: { thumbnail_url?: string } | null) => {
        if (!cancelled) setPlaylistCover(data?.thumbnail_url ?? "");
      })
      .catch(() => {
        if (!cancelled) setPlaylistCover("");
      });
    return () => { cancelled = true; };
  }, [playlistId]);

  return (
    <main className="music-app">
      <aside className="sidebar">
        <a className="music-brand" href="#top"><span>✳</span> Sailaab</a>
        <div className="side-label">YOUR LIBRARY</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="side-active" href="#tracks"><span>⌁</span> Playlist</a>
          <a href="#tracks"><span>◷</span> Recently played</a>
          <a href="#tracks"><span>♡</span> Liked songs</a>
        </nav>
        <div className="side-label playlist-label">PLAYLISTS <button type="button" aria-label="Add playlist">+</button></div>
        <div className="playlist-list"><a className="playlist-current" href="#top"><i style={{ background: "linear-gradient(135deg,#667286,#202735)" }} /> Sailaab <small>367</small></a></div>
        <div className="sidebar-footer"><span className="live-dot" /> made for headphones</div>
      </aside>

      <section className="main-column" id="top">
        <header className="topbar">
          <div className="crumb"><span>MY PLAYLIST</span><b>/</b> Sailaab</div>
          <div className="top-actions"><a className="spotify-link" href={playlistUrl} target="_blank" rel="noreferrer">Open Spotify ↗</a><button className="avatar" type="button" aria-label="Profile">V</button></div>
        </header>
        <div className="content-wrap">
          <section className="hero-player">
            <div className="hero-copy">
              <p className="overline">YOUR SPOTIFY PLAYLIST</p>
              <h1>Sailaab<br /><em>playlist.</em></h1>
              <p className="hero-description">The playlist you never asked for,<br />with songs for every kind of day.</p>
              <div className="hero-meta"><span>367 songs</span><span>24+ hours</span><span>public playlist</span></div>
            </div>
            <div className="record-stage" aria-label="Sailaab playlist artwork">
              <div className="record-shadow" /><div className="record"><div className="record-label" style={{ background: "#667286" }}>{playlistCover ? <img className="playlist-cover" src={playlistCover} alt="Sailaab playlist cover" /> : <><span>Sailaab</span><b>367</b></>}</div></div><div className="needle" />
              <div className="now-playing"><span className="eq"><i /><i /><i /></span><span>PLAYING FROM SPOTIFY</span></div>
            </div>
          </section>

          <section className="playlist-section" id="tracks">
            <div className="section-heading"><div><p className="overline">THE REAL PLAYLIST</p><h2>All 367 songs</h2></div><a className="spotify-link" href={playlistUrl} target="_blank" rel="noreferrer">Open full playlist ↗</a></div>
            <div className="playlist-frame">{playlistId && <iframe className="spotify-embed" title="Sailaab Spotify playlist" src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" />}</div>
            <p className="player-note">Click any song inside the Spotify player above to play that exact song. Spotify may ask you to sign in or open the Spotify app.</p>
          </section>

          <section className="connect-card" id="recent">
            <div><p className="overline">USE ANOTHER PLAYLIST</p><h2>Swap the playlist</h2><p>Paste another public Spotify playlist link to preview it here.</p></div>
            <div className="connect-form"><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://open.spotify.com/playlist/..." aria-label="Spotify playlist URL" /><a href={playlistId ? `https://open.spotify.com/playlist/${playlistId}` : playlistUrl} target="_blank" rel="noreferrer">Open playlist <span>↗</span></a></div>
          </section>
          <footer><span>Sailaab</span><span>curated with feeling</span><span>© 2026</span></footer>
        </div>
      </section>
    </main>
  );
}
