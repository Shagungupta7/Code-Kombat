import React, { useEffect, useState } from "react";
import { doc, updateDoc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

const Room = () => {
    const navigate = useNavigate();
    const {code} = useParams();
    const [roomData, setRoomData] = useState(null);
    const [players, setPlayers] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const TIMER_DURATION = {
        easy: 10 * 60,    // 10 minutes
        medium: 20 * 60,  // 20 minutes
        hard: 30 * 60,    // 30 minutes
    };
    console.log("Room data:", roomData);
    console.log("User:", user);


    useEffect(() => {
        const roomRef = doc(db, "Rooms", code);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.data();
                setPlayers(data.players || {});
                setRoomData(data);
            }
            else{
                console.log("Room not found!");
            }
        });

        return () => unsubscribe();
    }, [code]);

    useEffect(() => {
        if (roomData && roomData.gameStarted){
            navigate(`/game/${code}`)
        }
    }, [roomData, navigate, code]);

    const handleStartGame = async () => {
        const selectedDifficulty = roomData.difficulty;
        const problemsRef = collection(db, "NewProblems");
        const q = query(problemsRef, where("difficulty", "==", selectedDifficulty));
        const snapshot = await getDocs(q);
        const allProblems = snapshot.docs.map((doc) => doc.data());
        const randomProb = allProblems[Math.floor(Math.random() * allProblems.length)];
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
        <div style={{ textAlign: "center" }}>
            {!roomData ? (
                <p>Loading room...</p>
            ) : (
                <>
                    <h2>Room Code: {code}</h2>
                    <p>🎯 Difficulty: {roomData.difficulty?.toUpperCase()}</p>
                    <h3>Players in this room:</h3>
                    <ul>
                        {Object.values(players).map((p, i) => (
                            <li key={i}>{p.nickname} - {p.status}</li>
                        ))}
                    </ul>

                    {roomData.hostID === user.uid && !roomData.gameStarted && (
                        <button onClick={handleStartGame}>Start Game</button>
                    )}

                    {roomData.gameStarted && <p>🎮 Game in Progress...</p>}
                </>
            )}
        </div>
    );

};

export default Room;