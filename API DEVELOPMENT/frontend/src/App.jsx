import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
// import { saveAs } from "file-saver";
import { MoonLoader } from "react-spinners";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logoUrl from "/university-logo.png";

function App() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const API_URL = "https://ml-powered-spam-detection-for-corporate.onrender.com";

  const renderChart = useCallback((historyData) => {
    const ctx = document.getElementById("analyticsChart");
    if (window.myChart) window.myChart.destroy();

    const spamCount = historyData.filter((r) => r.is_spam).length;
    const hamCount = historyData.length - spamCount;

    window.myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Spam", "Ham"],
        datasets: [{
          data: [spamCount, hamCount],
          backgroundColor: ["#ff6384", "#36a2eb"],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Classification Distribution (Last 10 Analyses)",
            color: darkMode ? "#fff" : "#000",
            font: { size: 16 }
          },
          legend: { 
            labels: { 
              color: darkMode ? "#fff" : "#000",
              font: { size: 14 } 
            } 
          }
        }
      }
    });
  }, [darkMode]);


  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("classificationHistory")) || [];
    setHistory(savedHistory);
    renderChart(savedHistory);
  }, [renderChart]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const classifyEmail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/classify_email`, {
        email_text: emailText,
      });

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

  const generatePDFReport = async () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
  
    // Convert image URL to base64
    const toBase64 = async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
  
    const base64Logo = await toBase64(logoUrl);
  
    // Header
    doc.addImage(base64Logo, "PNG", 10, 10, 30, 30);
    doc.setFontSize(18);
    doc.text("Zetech University", 50, 20);
    doc.setFontSize(14);
    doc.text("Email Spam Detection System", 50, 28);
    doc.text(`Report Generated: ${date}`, 10, 45);

    // Chart
    const chartImage = document.getElementById("analyticsChart").toDataURL();
    doc.addImage(chartImage, "PNG", 10, 60, 90, 90);

    // History Table
    doc.autoTable({
      startY: 150,
      head: [['Date/Time', 'Classification', 'Spam %', 'Ham %']],
      body: history.map(entry => [
        new Date(entry.timestamp).toLocaleString(),
        entry.classification.toUpperCase(),
        `${(entry.spam_probability * 100).toFixed(1)}%`,
        `${(100 - entry.spam_probability * 100).toFixed(1)}%`
      ]),
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save("spam-detection-report.pdf");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} flex flex-col items-center p-4`}>
      {/* Header */}
      <header className={`w-full ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md mb-8`}>
        <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between space-y-6">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={logoUrl} alt="University Logo" className="h-full md:h-16 mr-4" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Zetech University</h1>
            <h2 className="text-md md:text-xl text-blue-500">Email Spam Detection System</h2>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-6">
        {/* Input Section */}
        <section className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 md:p-6 rounded-lg shadow-md`}>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Analyze Email Content</h3>
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste email content here..."
            className={`w-full p-3 md:p-4 rounded-lg resize-none h-40 focus:ring-2 ${
              darkMode ? "bg-gray-700 text-white focus:ring-blue-500" : "border focus:ring-blue-400"
            }`}
          />
          <button
            onClick={classifyEmail}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 mt-4 rounded-lg transition-all flex justify-center items-center"
          >
            {loading ? (
              <MoonLoader color="#fff" size={24} />
            ) : (
              "Analyze for Spam"
            )}
          </button>
        </section>

        {/* Results Section */}
        {result && (
          <section className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 md:p-6 rounded-lg shadow-md`}>
            <h3 className="text-lg md:text-xl font-semibold mb-4">Analysis Results</h3>
            <div className={`p-4 rounded-lg ${result.is_spam ? "bg-red-500/20" : "bg-green-500/20"}`}>
              <h4 className="text-md md:text-lg font-semibold mb-2">
                Classification:{" "}
                <span className={result.is_spam ? "text-red-600" : "text-green-600"}>
                  {result.classification.toUpperCase()}
                </span>
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1 text-sm md:text-base">
                    <span>Spam Confidence</span>
                    <span>{(result.spam_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-300 rounded-full">
                    <div
                      className="h-2 rounded-full bg-red-600"
                      style={{ inlineSize: `${result.spam_probability * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm md:text-base">
                    <span>Ham Confidence</span>
                    <span>{(100 - result.spam_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-300 rounded-full">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ inlineSize: `${100 - result.spam_probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Analytics Section */}
        <section className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 md:p-6 rounded-lg shadow-md`}>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Analytics Overview</h3>
          <div className="relative">
            <canvas id="analyticsChart" className="w-full"></canvas>
          </div>
          <div className={`mt-4 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {history.length > 0 && (
              <p>
                Out of {history.length} recent analyses,{" "}
                {history.filter(r => r.is_spam).length} were spam and{" "}
                {history.filter(r => !r.is_spam).length} were legitimate
              </p>
            )}
          </div>
        </section>

        {/* History Section */}
        <section className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 md:p-6 rounded-lg shadow-md`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h3 className="text-lg md:text-xl font-semibold">Analysis History</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={generatePDFReport}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Generate PDF
              </button>
              {/* <button
                onClick={exportCSV}
                className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
              >
                Export CSV
              </button> */}
            </div>
          </div>
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  darkMode ? "bg-gray-700 hover:bg-gray-600" : "border hover:bg-gray-50"
                } transition-colors`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex-1">
                    <span className={`font-semibold ${entry.is_spam ? "text-red-600" : "text-green-600"}`}>
                      {entry.classification.toUpperCase()}
                    </span>
                    <span className={`block md:inline-block text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} md:ml-2`}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="text-red-600">Spam:</span> {(entry.spam_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600">Ham:</span> {(100 - entry.spam_probability * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


