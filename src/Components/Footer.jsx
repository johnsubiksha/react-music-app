import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { musicContext } from '../App';
import './Footer.css';
import {
    BsFillPlayCircleFill,
    BsFillPauseCircleFill,
    BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";

const Footer = () => {
    const { music,currentSong,song,settingCurrentSong,selectedPlayList,selectedPlayListSongs } = useContext(musicContext); 
    const [playState, setPlayState] = useState(false); 
    const [currentTime, setCurrentTime] = useState(0); 
    const [duration, setDuration] = useState(0); 
    const audioRef = useRef(null);
    
    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (playState) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlayState(!playState);
    };

    // Update progress bar and duration dynamically
    const updateTime = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime || 0); // Update current time
        }
        
    };

    // Handle loaded metadata to set duration
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration || 0); // Set total duration
        }
    };

    // Manually change the progress bar (scrubbing)
    const handleProgressBarChange = (e) => {
        if (audioRef.current) {
            audioRef.current.currentTime = e.target.value; // Update audio time
            setCurrentTime(e.target.value); // Update state
        }
        if (playState) {
            audioRef.current.play(); // Ensure playback resumes after scrubbing
        }
        
    };

    // Automatically play the audio when a new song is selected
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.play();
            setPlayState(true);
        } else {
            setPlayState(false);
        }
    }, [currentSong]);

    // Attach event listeners to the audio element
    useEffect(() => {
        if (!audioRef.current) return; // Exit if ref is not set
        const audio = audioRef.current;
        
        const handleAudioEnd = () => {
            handleNextSong();
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleAudioEnd);
        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, [currentSong]);

    const handleNextSong = () => {
        if(selectedPlayList)
        {
            const currentIndex = selectedPlayListSongs.findIndex(item => item.url === currentSong);
            if (currentIndex === -1) return; // Exit if the song is not found in the music list
            console.log(currentIndex);
            const nextSong = selectedPlayListSongs[(currentIndex + 1) % selectedPlayListSongs.length]; // Loop to first song if at the end
            settingCurrentSong(nextSong.url, nextSong);
        }
        else{
            const currentIndex = music.findIndex(item => item.url === currentSong);
            if (currentIndex === -1) return; // Exit if the song is not found in the music list
            console.log(currentIndex);
            const nextSong = music[(currentIndex + 1) % music.length]; // Loop to first song if at the end
            settingCurrentSong(nextSong.url, nextSong);
        }
        
    };
    
    // Handle previous song
    const handlePrevSong = () => {
        if(selectedPlayList)
        {
            const currentIndex = selectedPlayListSongs.findIndex(item => item.url === currentSong);
            console.log(currentIndex);
            if (currentIndex === -1) return; // Exit if the song is not found in the music list
            
            const prevSong = selectedPlayListSongs[(currentIndex - 1 + selectedPlayListSongs.length) % selectedPlayListSongs.length]; // Loop to last song if at the start
            settingCurrentSong(prevSong.url, prevSong);
        }
        else{
            const currentIndex = music.findIndex(item => item.url === currentSong);
            console.log(currentIndex);
            if (currentIndex === -1) return; // Exit if the song is not found in the music list
            
            const prevSong = music[(currentIndex - 1 + music.length) % music.length]; // Loop to last song if at the start
            settingCurrentSong(prevSong.url, prevSong);
        }
        
    };

    // Handle shuffle functionality
    const handleShuffle = () => {
        if(selectedPlayList)
        {
            const randomSong = selectedPlayListSongs[Math.floor(Math.random() * selectedPlayListSongs.length)];
            settingCurrentSong(randomSong.url,randomSong);
        }
        else{
            const randomSong = music[Math.floor(Math.random() * music.length)];
            settingCurrentSong(randomSong.url,randomSong);
        }
        
    };

    const handleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setPlayState(true);
        }
    };

    return (
        <div className='footer'>
            <div className='songDetails'>
                {song && 
                <>
                    <img className='songImage' src={`http://localhost:5000/${song.image}`}/>
                    <h5>{song.title}</h5>
                </>}
            </div>
            
            <div className='player-container'>

                <div className='controls'>
                    <BsShuffle className='control-button' onClick={()=>{handleShuffle()}}/>
                    <CgPlayTrackPrev className='control-button' onClick={()=>{
                        console.log("Clicked");
                        handlePrevSong()}}/>
                    <div className='state' onClick={togglePlayPause}>
                        {playState ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
                    </div>
                    <CgPlayTrackNext className='control-button' onClick={()=>handleNextSong()}/>
                    <FiRepeat className='control-button' onClick={()=>handleRepeat()}/>
                </div>

                <div className='progress-bar-container'>
                    <div className='time'>{formatTime(currentTime)}</div>
                    <input
                        type='range'
                        min='0'
                        max={duration || 0}
                        value={currentTime || 0}
                        onChange={handleProgressBarChange}
                        step='0.1' // Add step for smooth scrubbing
                    />
                    <div className='time'>{formatTime(duration)}</div>
                </div>
            </div>


            {currentSong && (
                <audio ref={audioRef} src={`http://localhost:5000/${currentSong}`} autoPlay />
                
            )}
        </div>
    );
};


const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export default Footer;
