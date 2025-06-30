import './App.css';
import Body from './Components/Body';
import Nav from './Components/Nav';
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import SideBar from './Components/SideBar';
import Footer from './Components/Footer';
import PlayList from './Components/PlayList';
import axios from 'axios';

export const musicContext = createContext();

function App() {
  const [music, setMusic] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [song, setSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlayList, setSelectedPlayList] = useState(null);
  const [search, setSearch] = useState('');
  const [filterItem, setFilterItem] = useState([]);
  const [selectedPlayListSongs , setSelectedPlayListSongs] = useState([]);

  const URL = 'http://localhost:5000/music';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [musicRes, playlistRes] = await Promise.all([
          fetch('http://localhost:5000/music'),
          fetch('http://localhost:5000/playlists')
        ]);

        if (!musicRes.ok || !playlistRes.ok) {
          throw new Error('Failed to load data');
        }

        const musicData = await musicRes.json();
        const playlistsData = await playlistRes.json();

        setMusic(musicData);
        setPlaylists(playlistsData); // ✅ Now playlists are objects: { id, name }
      } catch (err) {
        setError(err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRename = (oldPlaylist, newName) => {
    axios.patch(`http://localhost:5000/playlists/${oldPlaylist.id}`, {
      name: newName
    })
    .then(res => {
      setPlaylists(prev => prev.map(p => p.id === oldPlaylist.id ? res.data : p));
    })
    .catch(err => console.error(err));
  };

  const handlePlayListSelection = (playlist) => {
    setSelectedPlayList(playlist);
  };

  const settingCurrentSong = async(songUrl, songDetails) => {
    setCurrentSong(songUrl);
    setSong(songDetails);
    
  };

  const handleAddPlayList = (playListName) => {
    const newId = playlists.length > 0 ? Math.max(...playlists.map(p => +p.id)) + 1 : 1;

    axios.post('http://localhost:5000/playlists', {
      id: newId.toString(),
      name: playListName
      })
      .then(res => {
        setPlaylists(prev => [...prev, res.data]);
      })
      .catch(err => console.error(err));
    };

  const handleDeletePlaylist = async (playlistId) => {
  const idStr = String(playlistId);

  try {
   
    await axios.delete(`http://localhost:5000/playlists/${idStr}`);

    
    const updatedMusic = await Promise.all(
      music.map(async (song) => {
        const newPlayLists = (song.playLists || [])
          .map(String)
          .filter((id) => id !== idStr);

        if (newPlayLists.length !== (song.playLists || []).length) {
          const updated = { ...song, playLists: newPlayLists };
          await axios.patch(`http://localhost:5000/music/${song.id}`, {
            playLists: newPlayLists,
          });
          return updated;
        }

        return song;
      })
    );

    setMusic(updatedMusic);
    setPlaylists(playlists.filter((p) => p.id !== idStr));
    if (selectedPlayList?.id === idStr) {
      setSelectedPlayList(null);
    }
  } catch (err) {
    console.error("Error deleting playlist:", err);
  }
};


  const renderContent = () => {
    if (filterItem.length > 0) {
      return (
        <div className="search_results">
          <ul>
            {filterItem.map((song, index) => (
              <li
                key={index}
                onClick={() => settingCurrentSong(song.url, song)}
              >
                <img
                        src={`http://localhost:5000/${song.image}`}
                        alt={song.title}
                        className="song-image"
                      />
                {song.title}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedPlayList) {
      return <PlayList />;
    }

    return <Body />;
  };

  return (
    <div className='app'>
      <musicContext.Provider
        value={{
          music,
          currentSong,
          settingCurrentSong,
          song,
          selectedPlayList,
          search,
          setSearch,
          setFilterItem,
          setSelectedPlayListSongs,
          selectedPlayListSongs,
          setMusic,
        }}
      >
      <Nav setSelectedPlayList={handlePlayListSelection} />
      <SideBar
          playlists={playlists}
          setSelectedPlayList={handlePlayListSelection}
          onRename={handleRename}
          onAddPlayList={handleAddPlayList}
          onDeletePlaylist={handleDeletePlaylist}
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!(loading || error) && renderContent()}
      <Footer />
      </musicContext.Provider>
    </div>
  );
}

export default App;
