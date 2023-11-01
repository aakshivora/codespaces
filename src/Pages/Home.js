import React, {useState} from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a New Room');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Room Id & Username is required');
      return;
    }
    
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
      <div className='homePageWrapper'>
        <div className='formWrapper'>
          <img className='homePageLogo' src="/" alt="code-space logo" />
          <h4 className='mainLabel'>Paste the Room Invitation ID </h4>
          <div className='inputGroup'>
            <input 
              type='text'
              className='inputBox'
              placeholder='Room ID'
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />

            <input 
              type='text'
              className='inputBox'
              placeholder='User Name'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />

            <button className='btn jointBtn' onClick={joinRoom}> Join </button>
            
            <span className='createRoom'> If you don't have an Invite the &nbsp; 
            <a onClick={createNewRoom} href='/' className='createNewBtn'> New Room </a> 
            </span>

          </div>
        </div>
      </div>
  );
};

export default Home;