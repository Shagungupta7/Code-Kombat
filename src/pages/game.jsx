import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const Game = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [codeEditor, setCodeEditor] = useState("");
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

  const languageOptions = [
    { id: 63, name: "JavaScript" },
    { id: 71, name: "Python" },
    { id: 62, name: "Java" },
    { id: 50, name: "C" },
    { id: 72, name: "C++" },
  ];

  // Fetch data from Firestore
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

  const handleGameOver = async (winnerUID) => {
    setGameOver(true);
    const roomRef = doc(db, "Rooms", code);
    await updateDoc(roomRef, { gameOver: true, winner: winnerUID || null });
    setTimeout(async () => await deleteDoc(roomRef), 3000);
  };

  const handleRunCode = async () => {
    if (!problem?.testCases?.length) return alert("No test cases!");
    setLoading(true);
    setTestResults([]);
    const user = JSON.parse(localStorage.getItem("user"));
    let results = [];
    let allPassed = true;

    try {
      for (const test of problem.testCases) {
        const options = {
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
            stdin: test.input,
          },
        };

        const res = await axios.request(options);
        const output = res.data.stdout?.trim() || res.data.stderr?.trim() || "";
        const passed = output === test.expectedOutput;
        if (!passed) allPassed = false;
        results.push({ input: test.input, expected: test.expectedOutput, output, passed });
      }

      setTestResults(results);

      if (allPassed && user?.uid) {
        alert("✅ All test cases passed!");
        const roomRef = doc(db, "Rooms", code);
        await updateDoc(roomRef, { [`players.${user.uid}.score`]: increment(10) });
        await handleGameOver(user.uid);
      } else {
        alert("❌ Some test cases failed.");
      }
    } catch (err) {
      console.error(err);
      setTestResults([{ input: "-", expected: "-", output: "Error running code", passed: false }]);
    } finally {
      setLoading(false);
    }
  };

  if (gameOver) {
    const winnerPlayer = winner ? players[winner] : null;
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0b0f19] text-white font-josefin">
        <h1 className="text-4xl font-bold mb-4">🏁 Game Over!</h1>
        {winnerPlayer ? (
          <h2 className="text-2xl text-green-400">🎉 Winner: {winnerPlayer.nickname} 🏆</h2>
        ) : (
          <h2 className="text-2xl text-yellow-400">⏳ Time’s up! No winner</h2>
        )}
        <ul className="mt-4 space-y-2 text-lg">
          {Object.entries(players)
            .sort((a, b) => (b[1].score || 0) - (a[1].score || 0))
            .map(([uid, p]) => (
              <li key={uid}>
                {p.nickname} — 🏆 {p.score || 0}
              </li>
            ))}
        </ul>
        <button
          onClick={() => navigate("/lobby")}
          className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0f19] text-white font-josefin overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[35%] flex flex-col p-6 border-r border-gray-800 overflow-y-auto">
        <div className="bg-[#11172a] rounded-2xl shadow-lg p-5 mb-6">
          {problem ? (
            <>
              <h2 className="text-2xl font-bold mb-2 text-blue-400">{problem.title}</h2>
              <p className="text-sm leading-relaxed text-gray-300">{problem.description}</p>
              {problem.testCases?.length > 0 && (
                <pre className="bg-[#0e1423] p-3 rounded-lg mt-3 text-sm border border-gray-700">
                  {`Example:\nInput: ${problem.testCases[0].input}\nOutput: ${problem.testCases[0].expectedOutput}`}
                </pre>
              )}
            </>
          ) : (
            <p>Loading problem...</p>
          )}
        </div>

        <div className="bg-[#11172a] rounded-2xl shadow-lg p-5 mb-6">
          <h3 className="font-semibold mb-2 text-lg text-blue-400">🏆 Players</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(players).map(([uid, p]) => (
              <li key={uid}>
                {p.nickname} — {p.status} — 🏆 {p.score || 0}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#11172a] rounded-2xl shadow-lg p-4 text-center">
          <h4 className="text-yellow-400 text-xl font-mono">
            ⏳ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </h4>
          <div className="mt-3">
            <label className="mr-2 text-gray-300">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(parseInt(e.target.value))}
              className="bg-[#0e1423] border border-gray-700 text-white p-1 rounded"
            >
              {languageOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 bg-[#11172a] rounded-2xl shadow-lg overflow-hidden mb-4">
          <Editor
            height="100%"
            theme="vs-dark"
            language={
              languageOptions.find((l) => l.id === language)?.name.toLowerCase() || "javascript"
            }
            value={codeEditor}
            onChange={setCodeEditor}
          />
        </div>

        <div className="bg-[#11172a] rounded-2xl shadow-lg p-5 border border-gray-800 overflow-auto">
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="bg-blue-600 px-5 py-2 rounded mb-4 hover:bg-blue-700 transition"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
          <h3 className="font-semibold mb-2 text-lg text-blue-400">Test Case Results</h3>
          {testResults.length === 0 && (
            <p className="text-gray-400">Run the code to see results...</p>
          )}
          {testResults.map((t, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg mb-2 border ${
                t.passed
                  ? "bg-green-900/30 border-green-500/40 text-green-300"
                  : "bg-red-900/30 border-red-500/40 text-red-300"
              }`}
            >
              <strong>Test Case {i + 1}</strong>
              <p>Input: {t.input}</p>
              <p>Expected: {t.expected}</p>
              <p>Output: {t.output}</p>
              <p>Status: {t.passed ? "✅ Passed" : "❌ Failed"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
