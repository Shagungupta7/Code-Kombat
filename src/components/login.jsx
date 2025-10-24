import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(!nickname.trim()){
            alert("Please enter a nickname");
            return;
        }
        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem("user", JSON.stringify({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid
            }));
            //got user info+nickname
            onLogin({email:user.email, nickname, uid: user.uid});
            navigate("/lobby");
        }catch(error){
            console.error("Login failed: ", error);
            alert("Login failed, try again!");
        }
    };

    return (
        <div style={{textAlign: "center", marginTop: "100px"}}>
            <h2> Enter a Nickname and login with Google</h2>
            <input 
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ padding: "8px", fontSize:"16px", marginRight: "10px"}} 
            />
            <button onClick={handleLogin} style={{ padding: "8px 16px"}}>
                Login with Google
            </button>
        </div>
    );
};

export default Login;