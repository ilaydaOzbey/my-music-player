import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import {
  PauseSolid,
  PlayOutline,
  Previous32Regular,
  Next32Regular,
  PlaylistShuffleDuotone,
  InterfaceDelete2RemoveBoldAddButtonButtonsDelete
} from "./SvgIcons";

const allSongs = [
  { id: 0, title: "PRIDE", artist: "Kendrick Lamar", duration: "0:22", src: "music/pride-sample.mp3" },
  { id: 1, title: "Waiting Room", artist: "Phoebe Bridgers", duration: "1:53", src: "music/waiting-room-sample.mp3" },
  { id: 2, title: "White Ferrari", artist: "Frank Ocean", duration: "0:44", src: "music/white-ferrari-sample.mp3" },
  { id: 3, title: "Shape of My Heart", artist: "Sting", duration: "1:20", src: "music/shape-of-my-heart-sample.mp3" },
  { id: 4, title: "Once More To See You", artist: "Mitski", duration: "0:51", src: "music/once-more-to-see-you-sample.mp3" },
  { id: 5, title: "Back To The Old House", artist: "The Smiths", duration: "3:04", src: "music/back-to-the-old-house-sample.mp3" },
  { id: 6, title: "About You", artist: "The 1975", duration: "0:25", src: "music/about-you-sample.mp3" },
];

export default function MusicPlayer() {
  const [songs, setSongs] = useState([...allSongs]);
  const [currentSong, setCurrentSong] = useState(null);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const albumImgRef = useRef(null);

  const audio = audioRef.current;

  // Şarkıyı çal / devam et
  const playSong = (id) => {
    const song = songs.find((song) => song.id === id);

    if (currentSong?.id === song.id) {
      // Aynı şarkıysa kaldığı yerden devam et
      audio.play();
      albumImgRef.current.classList.add("spinning");
      return;
    }

    // Farklı şarkıya geçiş
    audio.src = song.src;
    audio.title = song.title;
    audio.currentTime = 0;
    setCurrentSong(song);
    setSongCurrentTime(0);
    albumImgRef.current.classList.add("spinning");
    audio.play();
  };

  const pauseSong = () => {
    setSongCurrentTime(audio.currentTime);
    albumImgRef.current.classList.remove("spinning");
    audio.pause();
  };

  const getCurrentSongIndex = () => songs.indexOf(currentSong);

  const playNextSong = () => {
    if (!currentSong) return playSong(songs[0].id);
    const nextIndex = getCurrentSongIndex() + 1;
    if (songs[nextIndex]) playSong(songs[nextIndex].id);
  };

  const playPreviousSong = () => {
    if (!currentSong) return;
    const prevIndex = getCurrentSongIndex() - 1;
    if (songs[prevIndex]) playSong(songs[prevIndex].id);
  };

  const shuffle = () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    setSongs(shuffled);
    pauseSong();
    setCurrentSong(null);
    setSongCurrentTime(0);
    setIsPlaying(false);
  };

  const deleteSong = (id) => {
    if (currentSong?.id === id) {
      pauseSong();
      setCurrentSong(null);
      setSongCurrentTime(0);
      setIsPlaying(false);
    }
    setSongs(songs.filter((s) => s.id !== id));
  };

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      const currentIndex = getCurrentSongIndex();
      const nextSongExists = songs[currentIndex + 1] !== undefined;
      if (nextSongExists) {
        playNextSong();
      } else {
        pauseSong();
        setCurrentSong(null);
        setSongCurrentTime(0);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, songs]);

  return (
    <div className="container">
      <div className="player">
        <div className="player-bar">
          <div className="parallel-lines"><div></div><div></div></div>
          <h1 className="fcc-title">KIWI</h1>
          <div className="parallel-lines"><div></div><div></div></div>
        </div>

        <div className="player-content">
          <div id="player-album-art">
            <img
              ref={albumImgRef}
              src="https://i.pinimg.com/736x/05/44/5b/05445b37bb11305bdd1e7d9f5e48fff7.jpg"
              alt="song cover art"
            />
          </div>

          <div className="player-display">
            <div className="player-display-song-artist">
              <p id="player-song-title">{currentSong?.title || ""}</p>
              <p id="player-song-artist">{currentSong?.artist || ""}</p>
            </div>

            <div className="player-buttons">
              <button onClick={playPreviousSong} aria-label="Previous">
                <Previous32Regular width="32" height="32" />
              </button>
              <button
                onClick={() => (isPlaying ? pauseSong() : playSong(currentSong?.id ?? songs[0].id))}
                className={isPlaying ? "playing" : ""}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <PauseSolid width="32" height="32" /> : <PlayOutline width="32" height="32" />}
              </button>
              <button onClick={playNextSong} aria-label="Next">
                <Next32Regular width="32" height="32" />
              </button>
              <button onClick={shuffle} aria-label="Shuffle">
                <PlaylistShuffleDuotone width="32" height="32" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="playlist">
        <div className="playlist-bar">
          <div className="parallel-lines"><div></div><div></div></div>
          <h2 className="playlist-title">Playlist</h2>
          <div className="parallel-lines"><div></div><div></div></div>
        </div>

        <ul id="playlist-songs">
          {songs.length > 0 ? (
            songs.map((song) => (
              <li
                key={song.id}
                className="playlist-song"
                aria-current={currentSong?.id === song.id ? "true" : "false"}
              >
                <button className="playlist-song-info" onClick={() => playSong(song.id)}>
                  <span className="playlist-song-title">{song.title}</span>
                  <span className="playlist-song-artist">{song.artist}</span>
                  <span className="playlist-song-duration">{song.duration}</span>
                </button>
                <button
                  onClick={() => deleteSong(song.id)}
                  className="playlist-song-delete"
                  aria-label={`Delete ${song.title}`}
                >
                  <InterfaceDelete2RemoveBoldAddButtonButtonsDelete width="20" height="20" />
                </button>
              </li>
            ))
          ) : (
            <button
              id="reset"
              aria-label="Reset playlist"
              onClick={() => {
                setSongs([...allSongs]);
                setCurrentSong(null);
                setSongCurrentTime(0);
                setIsPlaying(false);
              }}
            >
              Reset Playlist
            </button>
          )}
        </ul>
      </div>
    </div>
  );
}