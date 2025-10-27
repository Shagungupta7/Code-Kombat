import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Particles from "react-tsparticles";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { STARTER_TEMPLATES } from "../components/templates";

const Game = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [codeEditor, setCodeEditor] = useState(STARTER_TEMPLATES["javascript"]);
  const [language, setLanguage] = useState(63);
  const [problem, setProblem] = useState(null);
  const [players, setPlayers] = useState({});
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(10);

  const languageOptions = [
    { id: 63, name: "JavaScript" },
    { id: 71, name: "Python" },
    { id: 62, name: "Java" },
    { id: 50, name: "C" },
    { id: 72, name: "C++" },
  ];

  // Firestore listener
  useEffect(() => {
    const roomRef = doc(db, "Rooms", code);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProblem(data.currentProblem);
        setPlayers(data.players || {});
        setStartTime(data.startedAt?.toDate());
        setDuration(data.duration || 0);
        setGameOver(data.gameOver || false);
        setWinner(data.winner || null);
      }
    });
    return () => unsubscribe();
  }, [code]);

  // Timer
  useEffect(() => {
    if (!startTime || !duration || gameOver) return;
    const interval = setInterval(() => {
      const remaining = duration - Math.floor((Date.now() - startTime.getTime()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        handleGameOver(null);
      } else setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, duration, gameOver]);

  // Game over handler
  const handleGameOver = async (winnerUID) => {
    setGameOver(true);
    setWinner(winnerUID || null);

    const roomRef = doc(db, "Rooms", code);
    await updateDoc(roomRef, {
      gameOver: true,
      winner: winnerUID || null,
    });

    // Show winner modal (in-window)
    setShowWinnerModal(true);
  };

  // Countdown redirect when modal is shown
  useEffect(() => {
    if (showWinnerModal) {
      const interval = setInterval(() => {
        setRedirectTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/lobby");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showWinnerModal, navigate]);

  // Run code
  const handleRunCode = async () => {
    if (!problem?.testCases?.length) return alert("No test cases!");
    setLoading(true);
    setTestResults([]);
    const user = JSON.parse(localStorage.getItem("user"));
    let results = [];
    let allPassed = true;

    try {
      for (const test of problem.testCases) {
        let formattedInput = String(test.input).replace(/^"(.*)"$/, "$1");
        if (problem.inputType === "int" || problem.inputType === "float") {
          formattedInput = Number(formattedInput).toString();
        }
        formattedInput += "\n";

        const res = await axios.request({
          method: "POST",
          url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          data: {
            language_id: parseInt(language),
            source_code: codeEditor,
            stdin: formattedInput,
          },
        });

        const output = res.data.stdout?.trim() || res.data.stderr?.trim() || "";
        const passed = output === test.expectedOutput;
        if (!passed) allPassed = false;
        results.push({ input: test.input, expected: test.expectedOutput, output, passed });
      }

      setTestResults(results);

      if (allPassed && user?.uid) {
        const roomRef = doc(db, "Rooms", code);
        await updateDoc(roomRef, { [`players.${user.uid}.score`]: (players[user.uid]?.score || 0) + 10 });
        await handleGameOver(user.uid);
      }
    } catch (err) {
      console.error(err);
      setTestResults([{ input: "-", expected: "-", output: "Error running code", passed: false }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const langId = parseInt(e.target.value);
    setLanguage(langId);
    const selectedLang = languageOptions.find((l) => l.id === langId)?.name.toLowerCase();
    setCodeEditor(STARTER_TEMPLATES[selectedLang] || "");
  };

  return (
    <div className="game-container">
      <Particles
        className="particles"
        options={{
          background: { color: { value: "#0a0a0a" } },
          fpsLimit: 60,
          particles: {
            color: { value: "#0ff" },
            links: { enable: true, color: "#0ff" },
            move: { enable: true, speed: 2 },
            number: { value: 40 },
            size: { value: 3 },
          },
        }}
      />

      {/* LEFT PANEL */}
      <div className="left-panel">
        <h1 className="title">⚔️ CODE KOMBAT</h1>
        {problem ? (
          <div className="problem-card">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            {problem.testCases?.length > 0 && (
              <pre>{`Example:\nInput: ${problem.testCases[0].input}\nOutput: ${problem.testCases[0].expectedOutput}`}</pre>
            )}
          </div>
        ) : (
          <p>Loading problem...</p>
        )}

        <div className="players-card">
          <h3>🏆 Players</h3>
          <ul>
            {Object.entries(players).map(([uid, p]) => (
              <li key={uid}>
                {p.nickname} — {p.score || 0} pts
              </li>
            ))}
          </ul>
        </div>
      </div>
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

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="timer">
          ⏳ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>

        <div className="editor-box">
          <Editor
            height="100%"
            theme="vs-dark"
            language={languageOptions.find((l) => l.id === language)?.name.toLowerCase() || "javascript"}
            value={codeEditor}
            onChange={setCodeEditor}
          />
        </div>

        <div className="run-controls">
          <label>Language: </label>
          <select value={language} onChange={handleLanguageChange}>
            {languageOptions.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <button className={`run-btn ${loading ? "running" : ""}`} onClick={handleRunCode} disabled={loading}>
            {loading ? "Running..." : "▶ Run Code"}
          </button>
        </div>

        <div className="results-box">
          <h3>🧪 Test Case Results</h3>
          {testResults.map((t, i) => (
            <div key={i} className={`test ${t.passed ? "pass" : "fail"}`}>
              <strong>Case {i + 1}</strong>
              <p>Input: {t.input}</p>
              <p>Expected: {t.expected}</p>
              <p>Output: {t.output}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && (
        <div className="winner-modal">
          {winner && <Confetti width={width} height={height} gravity={0.2} numberOfPieces={400} />}
          <div className="modal-content">
            <h2>
              {winner
                ? `🏆 ${players[winner]?.nickname} Wins the Battle! ⚔️`
                : "⏳ Time’s Up! No Winner This Round"}
            </h2>
            <p style={{ marginTop: "10px", color: "#0ff" }}>
              Redirecting to lobby in {redirectTimer} seconds...
            </p>
            <button onClick={() => navigate("/lobby")}>Go to Lobby</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

        .game-container {
          display: flex;
          height: 100vh;
          color: #fff;
          font-family: "Orbitron", sans-serif;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
          position: relative;
        }

        .particles {
          position: fixed; /* ensure full coverage */
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0; /* background layer */
        }

        .left-panel {
          width: 35%;
          padding: 20px;
          border-right: 2px solid #0ff;
          z-index: 1;
          overflow-y: auto;
        }

        .right-panel {
          width: 65%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }
        .left-panel,
        .right-panel {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .game-container > *:not(.particles) {
          position: relative;
          z-index: 2; /* ensure all other content is above */
        }
        .winner-modal {
          z-index: 999; /* stays above everything, including particles */
        }
        .timer {
          border: 2px solid #0ff;
          border-radius: 10px;
          text-align: center;
          padding: 8px;
          margin-bottom: 15px;
          font-size: 1.3rem;
          box-shadow: 0 0 10px #0ff;
        }

        .editor-box {
          flex: 1;
          border: 2px solid #0ff;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.6);
          box-shadow: 0 0 15px #0ff;
        }

        .run-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 12px 0;
        }

        select {
          background: transparent;
          color: #0ff;
          border: 2px solid #0ff;
          padding: 5px;
          border-radius: 6px;
        }

        .run-btn {
          background: transparent;
          border: 2px solid #0ff;
          color: #0ff;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          text-transform: uppercase;
          font-weight: bold;
          box-shadow: 0 0 10px #0ff;
          transition: all 0.3s;
        }

        .run-btn:hover {
          background: #0ff;
          color: #000;
          transform: scale(1.05);
        }

        .run-btn.running {
          background: #0ff3;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 10px #0ff;
          }
          50% {
            box-shadow: 0 0 25px #0ff;
          }
        }

        .results-box {
          margin-top: 10px;
          border: 2px solid #0ff;
          border-radius: 10px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 10px #0ff;
          overflow-y: auto;
          max-height: 180px;
        }

        .test.pass {
          background: rgba(0, 255, 0, 0.1);
          border-left: 4px solid #0f0;
          margin: 5px 0;
          padding: 5px;
        }

        .test.fail {
          background: rgba(255, 0, 0, 0.1);
          border-left: 4px solid #f00;
          margin: 5px 0;
          padding: 5px;
        }

        .winner-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(0, 255, 255, 0.15), rgba(0, 0, 0, 0.9));
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        animation: fadeIn 0.5s ease-in-out;
      }

      .modal-content {
        text-align: center;
        border: 2px solid #0ff;
        border-radius: 15px;
        padding: 40px;
        background: rgba(0, 0, 0, 0.8);
        box-shadow: 0 0 25px #0ff, 0 0 60px #00f inset;
        animation: popIn 0.4s ease-out;
      }

      .modal-content h2 {
        font-size: 1.8rem;
        text-shadow: 0 0 10px #0ff;
        margin-bottom: 10px;
      }

      .modal-content button {
        margin-top: 15px;
        background: #0ff;
        color: #000;
        font-weight: bold;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 0 10px #0ff;
        transition: 0.3s;
      }
      .modal-content button:hover {
        background: #00ffffaa;
        transform: scale(1.05);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes popIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      `}</style>
    </div>
  );
};

export default Game;
