import React, { useState, useEffect } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Home = ({ onLogin, onSignUp }) => {
  const [nickname, setNickname] = useState("");
  const [showNickname, setShowNickname] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        localStorage.setItem("user", JSON.stringify(userData));
        onLogin(userData);
        navigate("/lobby");
      } else {
        alert("No account found. Please SignUp first!");
      }
    } catch (error) {
      console.error("Login failed: ", error);
      alert("Login failed, try again!");
    }
  };

  const handleSignUp = async () => {
    if (!nickname.trim()) return alert("Please enter a nickname");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "Users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        nickname: nickname,
        uid: user.uid,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          nickname,
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        })
      );
      onSignUp({ email: user.email, nickname, uid: user.uid });
      navigate("/lobby");
    } catch (error) {
      console.error("Signup failed: ", error);
      alert("Signup failed, try again!");
    }
  };

  return (
    <div className="home-container">
      {/* Particles Background */}
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
            size: { value: 1 },
          },
        }}
      />

      <div className="card">
        <h1 className="title">CODE KOMBAT</h1>
        <p className="subtitle">Battle with code. Win the glory.</p>

        <div className="buttons">
          <button className="btn-neon" onClick={handleLogin}>
            Login with Google
          </button>
          <button className="btn-neon" onClick={() => setShowNickname(true)}>
            Sign Up
          </button>
        </div>

        {showNickname && (
          <div className="signup-form">
            <input
              className="neon-input"
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button className="btn-neon" onClick={handleSignUp}>
              Confirm
            </button>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

        .home-container {
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

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .card {
          position: relative;
          z-index: 1;
          background: rgba(0, 0, 0, 0.7);
          padding: 50px;
          border-radius: 16px;
          border: 2px solid #0ff;
          box-shadow: 0 0 20px #0ff;
          text-align: center;
          min-width: 350px;
        }

        .title {
          font-size: 3rem;
          color: #0ff;
          text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
          animation: flicker 1.5s infinite;
        }

        .subtitle {
          margin: 10px 0 30px;
          color: #0ff;
          opacity: 0.7;
        }

        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 22%, 24%, 55% {
            opacity: 0.4;
          }
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
        .btn-neon:hover {
          box-shadow: 0 0 20px #0ff, 0 0 40px #0ff;
          transform: scale(1.05);
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

        .signup-form {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
