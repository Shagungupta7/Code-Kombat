import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

const Lobby = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [difficulty, setDifficulty] = useState("Easy");
    const [roomCode, setRoomCode] = useState("");

    const handleCreateRoom = async () => {
        const code = Math.floor(100000 + Math.random()*900000).toString();
        localStorage.setItem("roomCode", code);
        const roomRef = doc(db, "Rooms", code);
        const roomData = {
            hostID: user.uid,
            hostNickname: user.displayName,
            Status: "waiting",
            createdAt: new Date(),
            players: {
                [user.uid] : {
                    nickname: user.displayName,
                    status: "host",
                    score: 0
                },
            },
            difficulty,
        };
        await setDoc(roomRef, roomData);
        navigate(`/room/${code}`);
    };

    const handleJoinRoom = async () => {
        if(roomCode.trim().length == 0){
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
                status: isHost ? "host" : "player"
            };
            await updateDoc(roomRef, { players });
            navigate(`/room/${roomCode}`);
        } else {
            alert("Room not found!");
        }
    };

    return (
        <div>
            <h2> Welcome, {user?.nickname || "Player"}!</h2>
            <div>
            {/* ✅ Difficulty selector */}
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="p-2 mb-4 rounded text-black"
                >
                    <option value="Easy">🟢 Easy</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Hard">🔴 Hard</option>
                </select>
                <button onClick={handleCreateRoom}>Create Room</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter a room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <button onClick={handleJoinRoom}> Join Room</button>
            </div>
        </div>
    );
};

export default Lobby;