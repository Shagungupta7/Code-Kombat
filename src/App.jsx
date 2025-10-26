import React, { useState, useEffect } from "react";
import Lobby from "./pages/lobby";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/room";
import Game from "./pages/game";
import Home from "./components/home";
// import { seedProblems } from "./problems";

function App() {
    const [user, setUser] = useState(null);    
    // useEffect(() => {
    //     seedProblems();
    //     console.log("done");
    // }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

  const handleSignUp = (userData) => {
        setUser(userData);
    };
    return (
        <Routes>
            <Route path="/" element={<Home onLogin={handleLogin} onSignUp={handleSignUp}/>} />
            <Route path="/lobby" element={<Lobby user={user}/>} />
            <Route path="/room/:code" element = {<Room/>}/>
            <Route path="/game/:code" element = { <Game />} />
        </Routes>
    );
    
}

export default App;
