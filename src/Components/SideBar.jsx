import React, { useState } from 'react';
import './SideBar.css';
import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function SideBar({ playlists, setSelectedPlayList, onRename, onAddPlayList, onDeletePlaylist }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [addPlayList, setAddPlayList] = useState(false);
  const [addingPlayListName, setAddingPlayListName] = useState('')

  const handleClick = (playlist) => {
    setSelectedPlayList(playlist);
  };

  const startEditing = (playlist) => {
    setEditingId(playlist.id);
    setNewName(playlist.name);
  };

  const handleRenameSubmit = (e, playlist) => {
    e.preventDefault();
    if (newName.trim() && newName !== playlist.name) {
      onRename(playlist, newName.trim());
    }
    setEditingId(null);
  };

  const startAddingPlayList = () => {
    setAddPlayList(true);
  }

  const handleAddPlayList = (e) => {
    e.preventDefault();
    const trimmedName = addingPlayListName.trim();
    if (trimmedName) {
      onAddPlayList(trimmedName);
      setAddingPlayListName('');
      setAddPlayList(false);
    }
  };


  return (
    <div className="sidebar">
      <div className='sidebar-head'>
        <h3>Playlists</h3>
        <FaPlus className='plus' onClick={startAddingPlayList} />
      </div>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id} className="playlist">
            {editingId === playlist.id ? (
              <form onSubmit={(e) => handleRenameSubmit(e, playlist)}>
                <input
                  className="rename-input"
                  type="text"
                  value={newName}
                  autoFocus
                  onBlur={() => setEditingId(null)}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </form>
            ) : (
              <>
                <button onClick={() => handleClick(playlist)}>
                  {playlist.name}
                </button>
                <CiEdit
                  className="rename"
                  onClick={() => startEditing(playlist)}
                />
                <MdDelete className="delete"
                  onClick={() => onDeletePlaylist(playlist.id)} />
              </>
            )}
          </li>
        ))}
      </ul>
      {addPlayList &&
        (<form onSubmit={handleAddPlayList}>
          <input
            className="rename-input"
            type="text"
            value={addingPlayListName}
            autoFocus
            onBlur={() => setAddPlayList(null)}
            onChange={(e) => setAddingPlayListName(e.target.value)}
          /></form>)}
    </div>
  );
}

export default SideBar;
