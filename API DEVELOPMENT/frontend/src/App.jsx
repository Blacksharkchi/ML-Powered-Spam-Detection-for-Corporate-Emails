import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { saveAs } from "file-saver";
import { MoonLoader } from "react-spinners";

function App() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("classificationHistory")) || [];
    setHistory(savedHistory);
    renderChart(savedHistory);
  }, []);

  const classifyEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/classify_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: emailText }),
      });

      const data = await response.json();
      const newHistory = [{ ...data, timestamp: new Date() }, ...history.slice(0, 9)];

      setResult(data);
      setHistory(newHistory);
      localStorage.setItem("classificationHistory", JSON.stringify(newHistory));
      renderChart(newHistory);
    } catch (error) {
      console.error("Classification failed:", error);
    }
    setLoading(false);
  };

  const renderChart = (historyData) => {
    const ctx = document.getElementById("analyticsChart");
    if (window.myChart) window.myChart.destroy();

    const spamCount = historyData.filter((r) => r.is_spam).length;
    const hamCount = historyData.length - spamCount;

    window.myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Spam", "Ham"],
        datasets: [
          {
            data: [spamCount, hamCount],
            backgroundColor: ["#ff6384", "#36a2eb"],
          },
        ],
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold mb-4">📩 Email Spam Detector</h1>

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Paste email content here..."
          className="w-full bg-gray-700 p-3 rounded-lg text-white resize-none h-32 focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={classifyEmail}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded-lg transition-all"
        >
          {loading ? <MoonLoader color="#fff" size={20} /> : "Check for Spam"}
        </button>
      </div>

      {result && (
        <div
          className={`mt-6 w-full max-w-md p-4 rounded-lg text-center ${
            result.is_spam ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <h2 className="text-xl font-semibold">Classification: {result.classification.toUpperCase()}</h2>
          <p className="text-lg">Confidence: {(result.spam_probability * 100).toFixed(1)}%</p>
        </div>
      )}

      <div className="mt-6 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">📊 Recent Classifications</h2>
        <canvas id="analyticsChart" className="w-full mt-4"></canvas>
      </div>

      <div className="mt-6 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">🗂 History</h2>
        <div className="mt-3 space-y-2">
          {history.map((entry, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                entry.is_spam ? "bg-red-600" : "bg-green-600"
              }`}
            >
              <span className="font-semibold">{entry.classification}</span> -{" "}
              {Math.round(entry.spam_probability * 100)}%
              <span className="block text-sm text-gray-300">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          const csv = history
            .map(
              (entry) =>
                `${entry.timestamp},${entry.classification},${entry.spam_probability}`
            )
            .join("\n");

          const blob = new Blob([csv], { type: "text/csv" });
          saveAs(blob, "classification-history.csv");
        }}
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-all"
      >
        📥 Export History
      </button>
    </div>
  );
}

export default App;
