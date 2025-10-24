import React, { useState, useEffect } from "react";
import Login from "./components/login";
import Lobby from "./pages/lobby";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/room";
import Game from "./pages/game";
// import { seedProblems } from "./problems";

function App() {
    const [user, setUser] = useState(null);    
    // useEffect(() => {
    //     seedProblems();
    //     console.log("done");
    // }, []);
    return (
        <Routes>
            <Route path="/" element={<Login onLogin={setUser}/>} />
            <Route path="/lobby" element={<Lobby user={user}/>} />
            <Route path="/room/:code" element = {<Room/>}/>
            <Route path="/game/:code" element = { <Game />}/>
        </Routes>
    );
    
}

export default App;
