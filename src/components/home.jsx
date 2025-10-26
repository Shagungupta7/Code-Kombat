import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


const Home = ({ onLogin, onSignUp }) => {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();
    const [showNickname, setShowNickname] = useState(false);

    const handleLogin = async () => {
        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = doc(db, "Users", user.uid);
            const userSnap = await getDoc(userRef);

            if(userSnap.exists()){
                const userData = userSnap.data();
                localStorage.setItem("user", JSON.stringify(userData));
                onLogin(userData);
                navigate("/lobby");
            }else{
                alert("No account found. Please SignUp first!");
            }
        }catch(error){
            console.error("Login failed: ", error);
            alert("Login failed, try again!");
        }
    };
    const handleSignUp = async () => {
        if(!nickname.trim()){
            alert("Please enter a nickname");
            return;
        }
        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = doc(db, "Users", user.uid);
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                nickname: nickname,
                uid: user.uid,
            });
            localStorage.setItem("user", JSON.stringify({
                nickname: nickname,
                displayName: user.displayName,
                email: user.email,
                uid: user.uid
            }));
            //got user info+nickname
            onSignUp({email:user.email, nickname, uid: user.uid});
            navigate("/lobby");
        }catch(error){
            console.error("Login failed: ", error);
            alert("Login failed, try again!");
        }
    }

    return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome to Code Kombat</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
        onClick={() => {
            handleLogin();
            setShowNickname(false);
        }}
        style={{ padding: "10px 20px", marginRight: "10px" }}
        >
        Login with Google
        </button>
        <button
        onClick={() => setShowNickname(true)}
        style={{ padding: "10px 20px", marginLeft: "10px" }}
        >
        Sign Up with Google
        </button>
      </div>
      {showNickname && (
        <div style={{ marginTop: "20px" }}>
            <input
            type="text"
            placeholder="Enter nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ padding: "8px", fontSize: "16px", marginRight: "10px" }}
            />
            <button onClick={handleSignUp} style={{ padding: "8px 16px" }}>
            Confirm Sign Up
            </button>
        </div>
        )}
    </div>
  );
};

export default Home;