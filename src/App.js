import React, { useState } from 'react';
import './App.css';

function App() {
  const [chats, setChats] = useState(["Chat 1"]);
  const [activeChat, setActiveChat] = useState(0);
  const [chatMessages, setChatMessages] = useState({
    0: [{ text: "Hello! How can I help you today?", sender: "bot" }]
  });
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState('1rem');

  const userName = "Daniella Melero";
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const suggestions = [
    "What are the best ways to travel to Indianapolis?",
    "Can you recommend hotels in Indianapolis?",
    "What is the weather like in Indianapolis this week?",
    "Are there any must-see attractions in Indianapolis?",
    "How do I get from the airport to downtown Indianapolis?"
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    setShowSuggestions(false);
    const now = new Date();
    setChatMessages(prev => {
      const updated = { ...prev };
      updated[activeChat] = [
        ...(updated[activeChat] || []),
        { text: input, sender: "user", time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];
      return updated;
    });
    setInput("");
    setHasStarted(true);
    setIsBotTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/supervisor-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: input })
      });
      const data = await response.json();
      const botNow = new Date();
      setChatMessages(prev => {
        const updated = { ...prev };
        updated[activeChat] = [
          ...(updated[activeChat] || []),
          { text: data.reply || "Sorry, no response.", sender: "bot", time: botNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ];
        return updated;
      });
    } catch (error) {
      setChatMessages(prev => {
        const updated = { ...prev };
        updated[activeChat] = [
          ...(updated[activeChat] || []),
          { text: "Error connecting to Supervisor-bot.", sender: "bot", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ];
        return updated;
      });
    }
    setIsBotTyping(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleNewChat = () => {
    const newIndex = chats.length;
    setChats([...chats, `Chat ${newIndex + 1}`]);
    setChatMessages(prev => ({
      ...prev,
      [newIndex]: [{ text: "Hello! How can I help you today?", sender: "bot" }]
    }));
    setActiveChat(newIndex);
    setInput("");
    setHasStarted(false);
    setShowSuggestions(true); // <-- Always show suggestions on new chat
  };

  const handleSelectChat = idx => {
    setActiveChat(idx);
    const started = (chatMessages[idx] && chatMessages[idx].length > 1) || false;
    setHasStarted(started);
    setInput("");
    setShowSuggestions(!started); // Show suggestions only if chat is new
  };

  const messages = chatMessages[activeChat] || [];

  return (
    <div className={`App${darkMode ? " dark-mode" : ""}`}>
      <aside className="sidemenu">
        <div className="app-title">BotBridge</div>
        <button className="new-chat-btn" onClick={handleNewChat}>+ New Chat</button>
        <ul>
          {chats.map((chat, idx) => (
            <li
              key={idx}
              className={activeChat === idx ? "active-chat" : ""}
              onClick={() => handleSelectChat(idx)}
              style={{ cursor: "pointer" }}
            >
              {chat}
            </li>
          ))}
        </ul>
      </aside>
      <div className="top-right-controls">
        <div className="profile-circle" onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
          <span>{initials}</span>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
          ⚙️
        </button>
      </div>
      {showProfile && (
        <div className="profile-modal" onClick={() => setShowProfile(false)}>
          <div className="profile-content" onClick={e => e.stopPropagation()}>
            <div className="profile-avatar">{initials}</div>
            <div className="profile-name">{userName}</div>
            <button className="close-profile-btn" onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}
      <main className="chat-container" style={{ fontSize: fontSize }}>
        <div className="messages">
          {hasStarted
            ? messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div className={`message ${msg.sender}`}>
                    <span>{msg.text}</span>
                  </div>
                  {msg.time && (
                    <span className="msg-time">{msg.time}</span>
                  )}
                </div>
              ))
            : null}
          {isBotTyping && (
            <div className="message bot">
              <span className="typing-indicator">
                <span></span><span></span><span></span>
              </span>
            </div>
          )}
        </div>
        {!hasStarted ? (
          <div className="input-bar-center-group">
            <div className="welcome-message">
              Hello! How can I help you today?
            </div>
            <div className="input-bar input-bar-center">
              <label className="file-attach">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 1 1 4.24 4.24l-9.2 9.19"></path>
                </svg>
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={e => {
                    if (e.target.files.length > 0) {
                      alert(`Selected: ${e.target.files[0].name}`);
                    }
                  }}
                />
              </label>
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  if (showSuggestions) setShowSuggestions(false);
                }}
                onKeyDown={handleInputKeyDown}
              />
              <button onClick={handleSend} className="send-btn" aria-label="Send">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="input-bar">
            <label className="file-attach">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 1 1 4.24 4.24l-9.2 9.19"></path>
              </svg>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={e => {
                  if (e.target.files.length > 0) {
                    alert(`Selected: ${e.target.files[0].name}`);
                  }
                }}
              />
            </label>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => {
                setInput(e.target.value);
                if (showSuggestions) setShowSuggestions(false);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button onClick={handleSend} className="send-btn" aria-label="Send">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        )}
        {showSuggestions && (
          <div className="suggestions-bar">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="suggestion-btn"
                onClick={() => {
                  setInput(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <button onClick={() => setDarkMode(dm => !dm)} className="dark-mode-toggle">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </main>
      {showSettings && (
  <div className="settings-modal" onClick={() => setShowSettings(false)}>
    <div
      className="settings-content"
      style={{ fontSize }} // <-- Add this line
      onClick={e => e.stopPropagation()}
    >
      <h2>Settings</h2>
      <div style={{ margin: "18px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(dm => !dm)}
          />{" "}
          Dark Mode
        </label>
      </div>
      <div style={{ margin: "18px 0" }}>
        <label>
          Font Size:&nbsp;
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="0.9rem">Small</option>
            <option value="1rem">Normal</option>
            <option value="1.2rem">Large</option>
            <option value="1.4rem">Extra Large</option>
            <option value="1.7rem">Extra-Extra Large</option>
          </select>
        </label>
      </div>
      <button className="close-settings-btn" onClick={() => setShowSettings(false)}>Close</button>
    </div>
  </div>
)}
    </div>
  );
}

export default App;
