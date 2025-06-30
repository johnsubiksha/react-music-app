import React, { useContext, useEffect, useState } from "react";
import { musicContext } from "../App";
import "./PlayList.css";
import axios from "axios";
import { TiDelete } from "react-icons/ti";
import { PiMusicNotesPlusBold } from "react-icons/pi";

const PlayList = () => {
  const {
    music,
    selectedPlayList,
    settingCurrentSong,
    setSelectedPlayListSongs,
    setMusic,
  } = useContext(musicContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (selectedPlayList) {
      const filteredMusic = music.filter(
        (song) =>
          Array.isArray(song.playLists) &&
          song.playLists.includes(String(selectedPlayList.id))
      );
      setSelectedPlayListSongs(filteredMusic);
    }
  }, [music, selectedPlayList, setSelectedPlayListSongs]);


  const filteredMusic = selectedPlayList
    ? music.filter(
      (song) =>
        Array.isArray(song.playLists) &&
        song.playLists.includes(String(selectedPlayList.id))
    )
    : [];

  
  const availableSongs = music.filter(
    (song) =>
      !Array.isArray(song.playLists) ||
      !song.playLists.includes(String(selectedPlayList?.id))
  );


  const handleAddToPlaylist = (songToAdd) => {
    const updatedMusic = music.map((song) => {
      if (song.id === songToAdd.id) {
        const currentPlayLists = Array.isArray(song.playLists) ? song.playLists : [];
        if (!currentPlayLists.includes(String(selectedPlayList.id))) {
          const updatedSong = {
            ...song,
            playLists: [...currentPlayLists, String(selectedPlayList.id)],
          };

          axios.patch(`http://localhost:5000/music/${song.id}`, {
            playLists: updatedSong.playLists,
          });

          return updatedSong;
        }
      }
      return song;
    });

    setMusic(updatedMusic);
    setShowSearch(false);
    setSearchInput("");
  };
  const handleRemoveFromPlaylist = (songToRemove) => {
    const playlistId = String(selectedPlayList.id);

    const updatedMusic = music.map((song) => {
      if (song.id === songToRemove.id) {
        const updatedPlayLists = (song.playLists || [])
          .map(String)
          .filter((id) => id !== playlistId);

        const updatedSong = { ...song, playLists: updatedPlayLists };

        axios.patch(`http://localhost:5000/music/${song.id}`, {
          playLists: updatedPlayLists,
        });

        return updatedSong;
      }
      return song;
    });

    setMusic(updatedMusic);
  };



  const filteredSearchResults = availableSongs.filter((song) =>
    song.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <h1 className="playlist-main-title">🎵 {selectedPlayList?.name}</h1>
        <h3 className="playlist-subtitle">Songs you'll enjoy</h3>
        <PiMusicNotesPlusBold className="add-music" onClick={() => setShowSearch(!showSearch)} />
      </div>

      {showSearch ? (
        <div className="search-box">
          <div className="box-head">
            <input
              type="text"
              placeholder="Search for songs to add..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <button
              className="cancel-button"
              onClick={() => {
                setShowSearch(false);
                setSearchInput("");
              }}
            >
              Cancel
            </button></div>

          <div className="search-results">
            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((song) => (
                <div
                  key={song.id}
                  className="search-result"
                  onClick={() => handleAddToPlaylist(song)}
                >
                  <img
                    src={`http://localhost:5000/${song.image}`}
                    alt={song.title}
                    className="song-image"
                  />
                  <span>{song.title}</span>

                </div>
              ))
            ) : (
              <p>No matching songs found.</p>
            )}
          </div>
        </div>
      ) : (filteredMusic.length > 0 ? (
        <table className="playlist-table">
          <thead>
            <tr>
              <th>#&nbsp;&nbsp;&nbsp;Title</th>
              <th>Album</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredMusic.map((song, index) => (
              <tr
                key={song.id}
                className="song-row"
                onClick={() => settingCurrentSong(song.url, song)}
              >
                <td>
                  <div className="song-info">
                    <span className="song-index">{index + 1}</span>
                    <img
                      src={`http://localhost:5000/${song.image}`}
                      alt={song.title}
                      className="song-image"
                    />
                    <span>{song.title}</span>
                  </div>
                </td>
                <td>{song.album}</td>
                <td>{song.duration}</td>
                <td>
                  <TiDelete className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromPlaylist(song);
                    }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-songs-message">No songs available in this playlist.</p>
      ))}
    </div>
  );
};

export default PlayList;
