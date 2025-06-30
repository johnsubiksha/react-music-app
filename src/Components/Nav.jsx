import React from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import "./Nav.css";
import { useContext } from "react";
import { musicContext } from "../App";

function Nav({ setSelectedPlayList }) {
  const {
    music,
    search,
    setSearch,
    setFilterItem,
    selectedPlayList,
    selectedPlayListSongs,
  } = useContext(musicContext);


  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFilterItem([]);
      return;
    }

   
    if (selectedPlayList === null) {

      const filtered = music.filter((song) =>
        song.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilterItem(filtered);
    }
    else {

      const filtered = selectedPlayListSongs.filter((song) =>
        song.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilterItem(filtered);
    }
  };

  return (
    <div className="head">
      <FaHome className="home_icon" onClick={() => setSelectedPlayList(null)} />
      <div className="search_bar">
        <FaSearch className="search_icon" />
        <input
          type="text"
          placeholder="Search songs"
          value={search}
          onChange={(e) => handleSearch(e)} // Ensure search is handled
        />
      </div>
    </div>
  );
}

export default Nav;
