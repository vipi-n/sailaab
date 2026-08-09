"use client";

import { useMemo, useState } from "react";

type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  color: string;
};

const tracks: Track[] = [
  { id: 1, title: "Sweet Disposition", artist: "The Temper Trap", album: "Conditions", duration: "3:54", color: "#d9a33d" },
  { id: 2, title: "Sunset Lover", artist: "Petit Biscuit", album: "Presence", duration: "3:58", color: "#d6674e" },
  { id: 3, title: "Space Song", artist: "Beach House", album: "Depression Cherry", duration: "5:20", color: "#5962a6" },
  { id: 4, title: "Tadow", artist: "Masego, FKJ", album: "Lady Lady", duration: "5:04", color: "#277b68" },
  { id: 5, title: "Borderline", artist: "Tame Impala", album: "The Slow Rush", duration: "3:58", color: "#a84f9c" },
  { id: 6, title: "Nights", artist: "Frank Ocean", album: "Blonde", duration: "5:07", color: "#6b5542" },
  { id: 7, title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", duration: "3:36", color: "#be4545" },
  { id: 8, title: "Innerbloom", artist: "RÜFÜS DU SOL", album: "Bloom", duration: "9:38", color: "#446a8d" },
];

function extractPlaylistId(value: string) {
  const match = value.match(/playlist[/:]([a-zA-Z0-9]+)|^([a-zA-Z0-9]{22})$/);
  return match?.[1] ?? match?.[2] ?? "";
}

export function JobDashboard() {
  const [activeId, setActiveId] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("https://open.spotify.com/playlist/3sv1rMIHxhoBKEUt0HLKTX");
  const [showEmbed, setShowEmbed] = useState(true);
  const active = tracks.find((track) => track.id === activeId) ?? tracks[0];
  const filtered = useMemo(() => tracks.filter((track) =>
    `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(query.toLowerCase()),
  ), [query]);
  const playlistId = extractPlaylistId(playlistUrl);

  function selectTrack(track: Track) {
    setActiveId(track.id);
    setPlaying(true);
    setShowEmbed(true);
  }

  return (
    <main className="music-app">
      <aside className="sidebar">
        <a className="music-brand" href="#top"><span>✳</span> mixtape.fm</a>
        <div className="side-label">YOUR LIBRARY</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="side-active" href="#tracks"><span>⌁</span> Playlist</a>
          <a href="#recent"><span>◷</span> Recently played</a>
          <a href="#liked"><span>♡</span> Liked songs</a>
        </nav>
        <div className="side-label playlist-label">PLAYLISTS <button type="button" aria-label="Add playlist">+</button></div>
        <div className="playlist-list">
          <a className="playlist-current" href="#top"><i style={{ background: "linear-gradient(135deg,#667286,#202735)" }} /> Sailaab <small>367</small></a>
          <a href="#top"><i style={{ background: "linear-gradient(135deg,#729d92,#d0a876)" }} /> sunday morning <small>31</small></a>
          <a href="#top"><i style={{ background: "linear-gradient(135deg,#bf6a8b,#563968)" }} /> soft launch <small>18</small></a>
        </div>
        <div className="sidebar-footer"><span className="live-dot" /> made for headphones</div>
      </aside>

      <section className="main-column" id="top">
        <header className="topbar">
          <div className="crumb"><span>MY PLAYLIST</span><b>/</b> Sailaab</div>
          <div className="top-actions"><button className="icon-button" type="button" aria-label="Search">⌕</button><button className="avatar" type="button" aria-label="Profile">V</button></div>
        </header>
        <div className="content-wrap">
          <section className="hero-player">
            <div className="hero-copy">
              <p className="overline">A PERSONAL SOUNDTRACK</p>
              <h1>Sailaab<br /><em>playlist.</em></h1>
              <p className="hero-description">The playlist you never asked for,<br />with songs for every kind of day.</p>
              <div className="hero-meta"><span>367 songs</span><span>24+ hours</span><span>public playlist</span></div>
            </div>
            <div className="record-stage" aria-label={`Now playing ${active.title}`}>
              <div className="record-shadow" />
              <div className="record"><div className="record-label" style={{ background: active.color }}><span>mixtape</span><b>{String(active.id).padStart(2, "0")}</b></div></div>
              <div className="needle" />
              <div className="now-playing"><span className="eq"><i /><i /><i /></span><span>NOW PLAYING</span></div>
            </div>
          </section>

          <section className="controls" aria-label="Player controls">
            <button className="shuffle" type="button" aria-label="Shuffle">⤨</button>
            <button className="skip" type="button" aria-label="Previous">◀◀</button>
            <button className="play-button" type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => { setPlaying(!playing); setShowEmbed(true); }}>{playing ? "Ⅱ" : "▶"}</button>
            <button className="skip" type="button" aria-label="Next" onClick={() => selectTrack(tracks[activeId % tracks.length])}>▶▶</button>
            <button className="shuffle" type="button" aria-label="Repeat">↻</button>
            <div className="progress"><span className="progress-time">{playing ? "0:18" : "0:00"}</span><div className="progress-track"><i style={{ width: playing ? "18%" : "0%" }} /></div><span>3:54</span></div>
          </section>

          <section className="track-section" id="tracks">
            <div className="section-heading"><div><p className="overline">A FEW FAVORITES</p><h2>Featured tracks <sup>{tracks.length}</sup></h2></div><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search picks" aria-label="Search featured tracks" /></label></div>
            <div className="track-table"><div className="table-head"><span>#</span><span>title</span><span>album</span><span>length</span></div>
              {filtered.map((track) => <button className={`track-row ${activeId === track.id ? "is-active" : ""}`} key={track.id} onClick={() => selectTrack(track)} type="button"><span className="track-number">{activeId === track.id && playing ? <span className="eq"><i /><i /><i /></span> : String(track.id).padStart(2, "0")}</span><span className="track-title"><i style={{ background: track.color }} /><b>{track.title}</b><small>{track.artist}</small></span><span className="track-album">{track.album}</span><span className="track-duration">{track.duration}</span><span className="row-play">▶</span></button>)}
            </div>
          </section>

          <section className="connect-card" id="recent">
            <div><p className="overline">THE FULL PLAYLIST</p><h2>Play Sailaab on Spotify</h2><p>Browse all 367 songs and keep the full playlist playing in the Spotify player.</p></div>
            <div className="connect-form"><input value={playlistUrl} onChange={(event) => setPlaylistUrl(event.target.value)} placeholder="https://open.spotify.com/playlist/..." aria-label="Spotify playlist URL" /><button type="button" onClick={() => setShowEmbed(true)} disabled={!playlistId}>Load playlist <span>↗</span></button></div>
            {showEmbed && playlistId && <iframe className="spotify-embed" title="Spotify playlist" src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />}
          </section>
          <footer><span>mixtape.fm</span><span>curated with feeling</span><span>© 2026</span></footer>
        </div>
      </section>
    </main>
  );
}
