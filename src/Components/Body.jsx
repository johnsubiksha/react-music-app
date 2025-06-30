import React, { useEffect } from 'react';
import { useContext } from 'react'
import { musicContext } from '../App'
import './Body.css'
import { BsFillPlayCircleFill } from "react-icons/bs";


const Body = () => {
  const { music, currentSong, settingCurrentSong } = useContext(musicContext);

  return (
    <div className='body'>
      <h2>To get you Started✨</h2><br></br>
      {music.length > 0 ? (
        <div className='music-body'>
          <ul>
            {music.map((song) => (
              <li key={song.id}>

                <img
                  src={`http://localhost:5000/${song.image}`}
                  alt={song.title}
                  onClick={() => settingCurrentSong(song.url, song)}
                />
                <BsFillPlayCircleFill className="play-button" onClick={() => settingCurrentSong(song.url, song)} />
                <h3>{song.title}</h3>
                <h2>{song.album}</h2>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No music available</p>
      )}
    </div>
  );
};

export default Body;
