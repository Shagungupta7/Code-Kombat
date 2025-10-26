import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const Game = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [codeEditor, setCodeEditor] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState(null);
  const [players, setPlayers] = useState({});
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const roomRef = doc(db, "Rooms", code);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProblem(data.currentProblem);
        setPlayers(data.players || {});
        setStartTime(data.startedAt?.toDate());
        setDuration(data.duration);
        setGameOver(data.gameOver || false);
        setWinner(data.winner || null);
      }
    });
    return () => unsubscribe();
  }, [code]);

  // 🕒 Countdown Timer
  useEffect(() => {
    if (!startTime || !duration || gameOver) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime.getTime()) / 1000);
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        handleGameOver(null); // ⏳ no winner, time ran out
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, gameOver]);

  // 🏁 End Game
  const handleGameOver = async (winnerUID) => {
    try{
      setGameOver(true);
      const roomRef = doc(db, "Rooms", code);
      await updateDoc(roomRef, {
        gameOver: true,
        winner: winnerUID || null,
      });

      setTimeout(async () => {
        await deleteDoc(roomRef);
        console.log("room Deleted");
      }, 3000);
    }catch(error){
      console.error("Error ending game:", error);
    }
  };

  useEffect(() => {
    if (gameOver) {
      const timeout = setTimeout(() => {
        navigate("/lobby");
      }, 4000); // a small delay for the "Game Over" screen
      return () => clearTimeout(timeout);
    }
  }, [gameOver, navigate]);
  // 🧠 Run Code & Check Answer
  const handleRunCode = async () => {
    if (gameOver) return alert("⏳ Game is over!");
    if (!problem) return alert("No problem loaded yet!");
    if (!problem.testCases || problem.testCases.length === 0) 
      return alert("No test cases found for this problem!");

    setLoading(true);
    setTestResults([]);
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      let allPassed = true;
      const results = []; // ✅ declare results here

      for (let i = 0; i < problem.testCases.length; i++) {
        const test = problem.testCases[i];
        const options = {
          method: "POST",
          url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          data: {
            language_id: 63,
            source_code: codeEditor,
            stdin: test.input,
          },
        };

        const response = await axios.request(options);
        const output = response.data.stdout?.trim() || response.data.stderr?.trim() || "";
        const passed = output === test.expectedOutput;

        if (!passed) allPassed = false;

        results.push({
          index: i + 1,
          input: test.input,
          expected: test.expectedOutput,
          output,
          passed,
        });
      }

      setTestResults(results); // ✅ update UI once after all test cases

      if (allPassed) {
        alert("✅ All Test Cases Passed!");
        if (user?.uid) {
          const roomRef = doc(db, "Rooms", code);
          await updateDoc(roomRef, {
            [`players.${user.uid}.score`]: increment(10),
          });
          await handleGameOver(user.uid); // end game instantly
        }
      } else {
        alert("❌ Some Test Cases Failed. Check the results below!");
      }

    } catch (error) {
      console.error(error);
      setTestResults([{ index: "-", input: "-", expected: "-", output: "Error executing code!", passed: false }]);
    } finally {
      setLoading(false);
    }
  };


  // 🧾 Game Over Screen
  if (gameOver) {
    const winnerPlayer = winner ? players[winner] : null;
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">🏁 Game Over!</h1>

        {winnerPlayer ? (
          <h2 className="text-2xl mb-2 text-green-400">
            🎉 Winner: {winnerPlayer.nickname} 🏆
          </h2>
        ) : (
          <h2 className="text-2xl mb-2 text-yellow-400">
            ⏳ Time’s up! No winner this round.
          </h2>
        )}

        <h3 className="text-xl mt-4 mb-2">Final Leaderboard</h3>
        <ul className="space-y-2 text-lg">
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
          className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="game-container flex flex-col h-screen bg-gray-900 text-white">
      {/* Problem */}
      <div className="problem-section p-4 border-b border-gray-700">
        {problem ? (
          <>
            <h2 className="text-xl font-bold">🔹 {problem.title}</h2>
            <p className="mt-2">{problem.description}</p>
            <pre className="bg-gray-800 p-2 rounded-md mt-2 text-sm">
              {`Input: ${problem.testCases[0].input}\nOutput: ${problem.testCases[0].expectedOutput}`}
            </pre>
          </>
        ) : (
          <p>Loading problem...</p>
        )}
      </div>

      {/* Players */}
      <div className="players-section p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2">🏆 Players:</h3>
        <ul className="space-y-1">
          {Object.entries(players).map(([uid, p]) => (
            <li key={uid}>
              {p.nickname} — {p.status} — 🏆 {p.score || 0}
            </li>
          ))}
        </ul>
      </div>

      {/* Timer */}
      <div className="text-2xl font-mono text-yellow-400 text-center my-2">
        ⏳ {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>

      {/* Editor */}
      <div className="editor-section flex flex-1">
        <Editor
          height="70vh"
          width="70%"
          theme="vs-dark"
          language={language}
          value={codeEditor}
          onChange={(value) => setCodeEditor(value)}
        />

        <div className="output-section w-1/3 p-4 bg-gray-800 border-l border-gray-700 overflow-auto">
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded mb-4 hover:bg-blue-700"
          >
            {loading ? "Running..." : "Run Code"}
          </button>
          <h3 className="text-lg font-semibold mb-2">Output:</h3>
          <div className="space-y-2">
            {testResults.length === 0 && <p className="text-gray-400">Run the code to see results...</p>}
            {testResults.map((t) => (
              <div
                key={t.index}
                className={`p-2 rounded-md ${
                  t.passed ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"
                }`}
              >
                <strong>Test Case {t.index}</strong>
                <p>Input: {t.input}</p>
                <p>Expected: {t.expected}</p>
                <p>Output: {t.output}</p>
                <p>Status: {t.passed ? "✅ Passed" : "❌ Failed"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
