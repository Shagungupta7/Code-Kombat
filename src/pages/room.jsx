import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const TIMER_DURATION = {
    Easy: 10 * 60,
    Medium: 20 * 60,
    Hard: 30 * 60,
  };

  useEffect(() => {
    const roomRef = doc(db, "Rooms", code);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPlayers(data.players || {});
        setRoomData(data);
      } else {
        console.log("Room not found!");
      }
    });

    return () => unsubscribe();
  }, [code]);

  useEffect(() => {
    if (roomData && roomData.gameStarted) {
      navigate(`/game/${code}`);
    }
  }, [roomData, navigate, code]);

  const handleStartGame = async () => {
    const selectedDifficulty = roomData.difficulty;
    const problemsRef = collection(db, "Problems");
    const q = query(problemsRef, where("difficulty", "==", selectedDifficulty));
    const snapshot = await getDocs(q);
    const allProblems = snapshot.docs.map((doc) => doc.data());
    const randomProb =
      allProblems[Math.floor(Math.random() * allProblems.length)];
    const roomRef = doc(db, "Rooms", code);
    await updateDoc(roomRef, {
      gameStarted: true,
      startedAt: new Date(),
      currentProblem: randomProb,
      duration: TIMER_DURATION[selectedDifficulty],
    });
    alert("Game Started!");
  };

  return (
    <div className="room-container">
      <div className="room-card">
        {!roomData ? (
          <p className="loading-text">Loading room...</p>
        ) : (
          <>
            <h2 className="room-title">Room Code: {code}</h2>
            <p className="difficulty">
              🎯 Difficulty: {roomData.difficulty?.toUpperCase()}
            </p>
            <h3 className="players-title">Players</h3>
            <ul className="players-list">
              {Object.values(players).map((p, i) => (
                <li key={i}>
                  {p.nickname} —{" "}
                  <span className="player-status">{p.status}</span>
                </li>
              ))}
            </ul>

            {roomData.hostID === user.uid && !roomData.gameStarted && (
              <button className="btn-neon" onClick={handleStartGame}>
                Start Game
              </button>
            )}

            {roomData.gameStarted && (
              <p className="status-text">🎮 Game in Progress...</p>
            )}
          </>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

        .room-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          color: #fff;
          font-family: "Orbitron", sans-serif;
          overflow: hidden;
        }

        .room-card {
          background: rgba(0, 0, 0, 0.7);
          padding: 40px 60px;
          border-radius: 16px;
          border: 2px solid #0ff;
          box-shadow: 0 0 20px #0ff;
          text-align: center;
          min-width: 350px;
          z-index: 1;
        }

        .room-title {
          font-size: 2rem;
          color: #0ff;
          text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
          margin-bottom: 10px;
        }

        .difficulty {
          color: #0ff;
          opacity: 0.8;
          margin-bottom: 20px;
        }

        .players-title {
          color: #0ff;
          text-shadow: 0 0 5px #0ff;
          margin-bottom: 10px;
        }

        .players-list {
          list-style: none;
          padding: 0;
          margin-bottom: 20px;
        }

        .players-list li {
          margin: 6px 0;
          color: #fff;
          text-shadow: 0 0 5px #0ff;
        }

        .player-status {
          color: #0ff;
          font-weight: bold;
        }

        .btn-neon {
          padding: 12px 24px;
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
        .btn-neon:hover {
          box-shadow: 0 0 20px #0ff, 0 0 40px #0ff;
          transform: scale(1.05);
        }

        .status-text {
          color: #0ff;
          margin-top: 20px;
          text-shadow: 0 0 10px #0ff;
        }

        .loading-text {
          color: #0ff;
          text-shadow: 0 0 10px #0ff;
        }
      `}</style>
    </div>
  );
};

export default Room;
