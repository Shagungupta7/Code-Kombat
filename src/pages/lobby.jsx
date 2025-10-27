import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import Particles from "react-tsparticles";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

const Lobby = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [difficulty, setDifficulty] = useState("Easy");
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("roomCode", code);
    const roomRef = doc(db, "Rooms", code);
    const roomData = {
      hostID: user.uid,
      hostNickname: user.displayName,
      Status: "waiting",
      createdAt: new Date(),
      players: {
        [user.uid]: {
          nickname: user.displayName,
          status: "host",
          score: 0,
        },
      },
      difficulty,
    };
    await setDoc(roomRef, roomData);
    navigate(`/room/${code}`);
  };

  const handleJoinRoom = async () => {
    if (roomCode.trim().length === 0) {
      alert("Enter a valid room code!!");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("roomCode", roomCode);
    const roomRef = doc(db, "Rooms", roomCode);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      const players = roomData.players || {};
      const isHost = roomData.hostID === user.uid;
      players[user.uid] = {
        nickname: user.displayName,
        status: isHost ? "host" : "player",
      };
      await updateDoc(roomRef, { players });
      navigate(`/room/${roomCode}`);
    } else {
      alert("Room not found!");
    }
  };

  return (
    <div className="lobby-container">
    <Particles
            className="particles"
            options={{
              background: { color: { value: "#0a0a0a" } },
              fpsLimit: 60,
              interactivity: {
                events: { onHover: { enable: true, mode: "repulse" } },
              },
              particles: {
                color: { value: "#0ff" },
                links: { enable: true, color: "#0ff", distance: 150 },
                move: { enable: true, speed: 2 },
                number: { value: 50 },
                size: { value: 3 },
              },
            }}
          />
      <div className="lobby-card">
        <h2 className="title">Welcome, {user?.nickname || "Player"}!</h2>

        <div className="section">
          <h3 className="subtitle">🎮 Create Room</h3>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="neon-select"
          >
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>
          <button className="btn-neon" onClick={handleCreateRoom}>
            Create Room
          </button>
        </div>

        <div className="section">
          <h3 className="subtitle">🔗 Join Room</h3>
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="neon-input"
          />
          <button className="btn-neon" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

        .lobby-container {
          position: relative;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          font-family: "Orbitron", sans-serif;
          color: #fff;
          overflow: hidden;
        }

        .lobby-card {
          background: rgba(0, 0, 0, 0.7);
          padding: 40px 60px;
          border-radius: 16px;
          border: 2px solid #0ff;
          box-shadow: 0 0 20px #0ff;
          text-align: center;
          min-width: 350px;
          z-index: 1;
        }

        .title {
          font-size: 2.2rem;
          color: #0ff;
          text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
          margin-bottom: 20px;
        }

        .subtitle {
          color: #0ff;
          text-shadow: 0 0 10px #0ff;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .section {
          margin: 25px 0;
        }

        .neon-select {
          padding: 10px 12px;
          border: 2px solid #0ff;
          border-radius: 8px;
          background: transparent;
          color: #fff;
          font-family: "Orbitron", sans-serif;
          font-weight: bold;
          box-shadow: 0 0 10px #0ff;
          margin-right: 10px;
          cursor: pointer;
        }

        .neon-select:focus {
          outline: none;
          box-shadow: 0 0 20px #0ff;
        }

        .neon-input {
          padding: 10px 12px;
          margin: 10px 0;
          width: 80%;
          border: 2px solid #0ff;
          border-radius: 6px;
          background: transparent;
          color: #fff;
          font-weight: bold;
          outline: none;
          box-shadow: 0 0 5px #0ff;
        }

        .neon-input:focus {
          box-shadow: 0 0 15px #0ff;
        }

        .btn-neon {
          padding: 12px 24px;
          margin: 10px;
          color: #fff;
          background: #1f1f1f;
          border: 2px solid #0ff;
          border-radius: 8px;
          text-transform: uppercase;
          font-weight: bold;
          box-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
          transition: 0.3s;
          cursor: pointer;
        }
        .particles {
          position: fixed; /* ensure full coverage */
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0; /* background layer */
        }
        .btn-neon:hover {
          box-shadow: 0 0 20px #0ff, 0 0 40px #0ff;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Lobby;
