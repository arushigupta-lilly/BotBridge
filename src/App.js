import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Format agent responses to be more organized
const formatAgentResponse = (rawText) => {
  // Remove excessive asterisks and clean up markdown
  let formatted = rawText
    // Remove multiple consecutive asterisks
    .replace(/\*{3,}/g, '')
    // Convert **bold** to a marker we can style later
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Convert single *italic* to emphasis
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Convert markdown headers to HTML headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Convert #### and more to h4
    .replace(/^#{4,} (.+)$/gm, '<h4>$1</h4>')
    // Clean up bullet points - normalize different bullet styles
    .replace(/^\s*[\*\-\+•]\s+/gm, '• ')
    // Clean up numbered lists
    .replace(/^\s*(\d+)\.\s+/gm, '$1. ')
    // Ensure numbered items are on separate lines
.replace(/(\d+\.\s.*?)(?=\s*\d+\.\s|$)/g, '$1\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    // Format headings (lines ending with colon) - but not if already formatted
    .replace(/^([A-Z][^:\n<]*:)\s*$/gm, (match, text) => {
      if (text.includes('<')) return match; // Skip if already has HTML tags
      return `<h4>${text}</h4>`;
    })
    // Format subheadings (capitalize first letter after bullet or number)
    .replace(/(^• |^\d+\. )([a-z])/gm, (match, prefix, letter) => prefix + letter.toUpperCase())
    .trim();

  return formatted;
};

// Extract agent information from response
const extractAgentFromResponse = (responseText) => {
  // Look for pattern like [Agent Name] at the beginning
  const agentMatch = responseText.match(/^\[([^\]]+)\]/);
  
  if (agentMatch) {
    const agentName = agentMatch[1].trim().toLowerCase();
    const cleanText = responseText.replace(/^\[([^\]]+)\]\s*/, '').trim();
    
    // Determine agent type based on specific agent names
    let agentType = 'general';
    let agentIcon = '🤖';
    let displayName = agentMatch[1].trim();
    
    if (agentName.includes('medicine') || agentName.includes('medical')) {
      agentType = 'medicine';
      agentIcon = '💊';
      displayName = 'Medicine Bot';
    } else if (agentName.includes('compliance') || agentName.includes('quality')) {
      agentType = 'compliance';
      agentIcon = '📋';
      displayName = 'Compliance Bot';
    } else if (agentName.includes('regulation') || agentName.includes('regulatory') || agentName.includes('legal')) {
      agentType = 'regulation';
      agentIcon = '⚖️';
      displayName = 'Regulation Bot';
    } else if (agentName.includes('traveller') || agentName.includes('travel') || agentName.includes('trip')) {
      agentType = 'traveller';
      agentIcon = '✈️';
      displayName = 'Traveller Bot';
    }
    
    return {
      agent: {
        name: displayName,
        type: agentType,
        icon: agentIcon,
        id: agentType
      },
      text: cleanText
    };
  }
  
  // If no bracket found, return as general agent
  return {
    agent: {
      name: "Assistant",
      type: "general",
      icon: "🤖",
      id: "general"
    },
    text: responseText
  };
};

// Enhanced render formatted message with feedback buttons
const renderFormattedMessage = (text, showAgentHeader = true, messageData = {}) => {
  const { agent, text: cleanText } = extractAgentFromResponse(text);
  const formatted = formatAgentResponse(cleanText);
  
  // Split by double line breaks for paragraphs
  const sections = formatted.split('\n\n').filter(section => section.trim());
  
  const messageContent = sections.map((section, index) => {
    const trimmedSection = section.trim();
    
    // Check if it's a heading (h4 tags)
    if (trimmedSection.includes('<h4>') && trimmedSection.includes('</h4>')) {
      return (
        <div key={index} className="message-heading">
          <span dangerouslySetInnerHTML={{ __html: trimmedSection }} />
        </div>
      );
    }
    
    // Check if it's a bullet list
    if (trimmedSection.includes('•')) {
      const lines = trimmedSection.split('\n');
      const listItems = [];
      let currentItem = '';
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('•')) {
          if (currentItem) {
            listItems.push(currentItem);
          }
          currentItem = trimmedLine.substring(1).trim();
        } else if (trimmedLine && currentItem) {
          currentItem += ' ' + trimmedLine;
        }
      });
      
      if (currentItem) {
        listItems.push(currentItem);
      }
      
      return (
        <div key={index} className="message-list">
          {listItems.map((item, itemIndex) => (
            <div key={itemIndex} className="list-item">
              <span className="bullet">•</span>
              <span className="item-content" dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
      );
    }
    
    // Check if it's a numbered list
    if (/^\d+\.\s/.test(trimmedSection)) {
      const lines = trimmedSection.split('\n');
      const listItems = [];
      let currentItem = '';
      let currentNumber = '';
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        const numberMatch = trimmedLine.match(/^(\d+)\.\s(.+)/);
        
        if (numberMatch) {
          if (currentItem) {
            listItems.push({ number: currentNumber, content: currentItem });
          }
          currentNumber = numberMatch[1];
          currentItem = numberMatch[2];
        } else if (trimmedLine && currentItem) {
          currentItem += ' ' + trimmedLine;
        }
      });
      
      if (currentItem) {
        listItems.push({ number: currentNumber, content: currentItem });
      }
      
      return (
        <div key={index} className="message-numbered-list">
          {listItems.map((item, itemIndex) => (
            <div key={itemIndex} className="numbered-item">
              <span className="number">{item.number}.</span>
              <span className="item-content" dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
          ))}
        </div>
      );
    }
    
    // Regular paragraph with enhanced formatting
    return (
      <div key={index} className="message-paragraph">
        <span dangerouslySetInnerHTML={{ __html: trimmedSection }} />
      </div>
    );
  });

  // Function to handle feedback button clicks
  const handleFeedbackClick = (feedbackType) => {
    const message = feedbackType === 'like' 
      ? "Thanks for your positive feedback! 👍\n\nThis feature helps us improve the chatbot's responses. Your feedback is valuable in training our AI to provide better assistance."
      : "Thanks for your feedback! 👎\n\nWe're sorry this response wasn't helpful. Your feedback helps us improve the chatbot's responses and provide better assistance in the future.";
    
    alert(message);
  };

  // Show feedback buttons for all bot messages EXCEPT the initial greeting
  const isInitialGreeting = text === "Hello! How can I help you today?";
  const feedbackButtons = !isInitialGreeting && (
    <div className="feedback-buttons">
      <button 
        className="like-btn"
        onClick={() => handleFeedbackClick('like')}
      >
        👍 Like
      </button>
      <button 
        className="dislike-btn"
        onClick={() => handleFeedbackClick('dislike')}
      >
        👎 Dislike
      </button>
    </div>
  );

  // Return with agent header if requested
  if (showAgentHeader && agent.name !== "Assistant") {
    return (
      <div className="agent-message-container">
        <div className={`agent-header agent-${agent.type}`}>
          <span className="agent-icon">{agent.icon}</span>
          <span className="agent-name">{agent.name}</span>
          <span className="agent-badge">{agent.type}</span>
        </div>
        <div className="agent-message-content">
          {messageContent}
          {feedbackButtons}
        </div>
      </div>
    );
  }

  return (
    <div>
      {messageContent}
      {feedbackButtons}
    </div>
  );
};

// Add this function to check session validity
const isSessionValid = (userData) => {
  if (!userData || !userData.loginTime) return false;
  
  const now = new Date().getTime();
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (now - userData.loginTime) < sessionDuration;
};

//Functions and const for the app//
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
  const [typingStage, setTypingStage] = useState(1); // 1: first message, 2: second message
const typingStageTimeoutRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Voice features state
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  
  // USER STATE - Always start with no user
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage on app initialization
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Check if session is still valid
      if (isSessionValid(userData)) {
        return userData;
      } else {
        // Session expired, clear localStorage
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });
  const [showLogin, setShowLogin] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return !savedUser; // Only show login if no saved user
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [fontSize, setFontSize] = useState('1rem');
  
  // Login form states
  const [loginForm, setLoginForm] = useState({ 
    email: '', 
    password: '', 
    rememberMe: true // Add this
  });
  const [editProfileForm, setEditProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: null
  });
  const [authError, setAuthError] = useState('');

  // Add refs for auto-scrolling
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Update showLogin when user changes
  useEffect(() => {
    setShowLogin(!user);
  }, [user]);

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setShowSuggestions(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access for voice input.');
        }
      };
    }
    
    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + M to toggle microphone
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      
      // Ctrl/Cmd + Shift + V to toggle voice output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        setVoiceEnabled(prev => !prev);
      }
      
      // Ctrl/Cmd + R to repeat last bot message
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        repeatLastMessage();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isListening]);

  // Voice Recognition Functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Text-to-Speech Function
  const speakText = (text) => {
    if (synthRef.current && voiceEnabled && text) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.volume = speechVolume;
      utterance.lang = 'en-US';
      
      // Add event listeners
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Get available voices and prefer a natural sounding one
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Natural') || voice.name.includes('Neural'))
      ) || voices.find(voice => voice.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  // Repeat last bot message
  const repeatLastMessage = () => {
    const messages = chatMessages[activeChat] || [];
    const lastBotMessage = messages.slice().reverse().find(msg => msg.sender === 'bot');
    if (lastBotMessage) {
      speakText(lastBotMessage.text);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest User";
  const initials = user ? userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() : "GU";  // Lilly email domain validation
  const isValidLillyEmail = (email) => {
    const lillyDomains = [
      '@lilly.com',
      '@elililly.com'
    ];
    return lillyDomains.some(domain => email.toLowerCase().endsWith(domain));
  };

  // Authentication functions
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    
    // Validation
    if (!loginForm.email || !loginForm.password) {
      setAuthError('Please fill in all fields');
      return;
    }

    // Lilly email domain validation
    if (!isValidLillyEmail(loginForm.email)) {
      setAuthError('Access restricted to Eli Lilly and Company employees only. Please use your Lilly email address.');
      return;
    }

    // Password validation (minimum requirements)
    if (loginForm.password.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }

    // Extract user info from Lilly email
    const emailParts = loginForm.email.split('@')[0];
    const nameParts = emailParts.split('.');
    
    let firstName = 'Employee';
    let lastName = 'User';
    
    if (nameParts.length >= 2) {
      firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
    } else if (nameParts.length === 1) {
      firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
    }

    // In a real implementation, you would validate credentials against Lilly's Active Directory
    // For now, we'll simulate successful authentication for valid Lilly emails
    const userData = {
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      email: loginForm.email,
      avatar: null,
      joinDate: new Date().toLocaleDateString(),
      department: 'Eli Lilly and Company',
      isLillyEmployee: true,
      loginTime: new Date().getTime()
    };
    
    setUser(userData);
    
    // Only save to localStorage if "Remember me" is checked
    if (loginForm.rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    
    setShowLogin(false);
    setLoginForm({ email: '', password: '', rememberMe: true });
    setAuthError('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear from localStorage
    setShowLogin(true);
    setShowProfile(false);
    setAuthError('');
    
    // Reset chat data on logout
    setChats(["Chat 1"]);
    setActiveChat(0);
    setChatMessages({ 0: [{ text: "Hello! How can I help you today?", sender: "bot" }] });
    setHasStarted(false);
    setShowSuggestions(true);
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    
    // Check if user exists
    if (!user) {
      alert('User session not found. Please log in again.');
      setShowEditProfile(false);
      setShowLogin(true);
      return;
    }
    
    if (!editProfileForm.firstName || !editProfileForm.lastName || !editProfileForm.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate Lilly email when editing profile
    if (!isValidLillyEmail(editProfileForm.email)) {
      alert('Email must be a valid Lilly email address');
      return;
    }
    
    const updatedUser = {
      ...user,
      firstName: editProfileForm.firstName,
      lastName: editProfileForm.lastName,
      email: editProfileForm.email,
      avatar: editProfileForm.avatar || user.avatar
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditProfile(false);
    setShowProfile(true);
    setEditProfileForm({ firstName: '', lastName: '', email: '', avatar: null });
  };

  const openEditProfile = () => {
    // Check if user exists before accessing properties
    if (!user) {
      console.error('No user data available');
      return;
    }
    
    setEditProfileForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      avatar: user.avatar || null
    });
    setShowEditProfile(true);
    setShowProfile(false);
  };

  const handleAvatarUpload = (file, formType) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (formType === 'edit') {
          setEditProfileForm(prev => ({ ...prev, avatar: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
 };

//Suggetions for the bot//
// Replace getFourAgentSuggestions() with static suggestions
const [suggestions] = useState([
 "What is mounjaro?",
  "How should field-reps interact with HCPs?",
  "What are the latest FDA pharmaceutical regulations?",
  "What can I do in Indy if I like history?",
  "What are updated medicaid and medicare regulations?",
]);

//This function handle the send button and the connection with the backend and the timestamp of the message//
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
    setTypingStage(1);
    if (typingStageTimeoutRef.current) clearTimeout(typingStageTimeoutRef.current);
typingStageTimeoutRef.current = setTimeout(() => {
  setTypingStage(2);
}, 10000); 

//* This is where the bot's response is fetched from the backend *//
    try {
      const response = await fetch("http://localhost:5000/api/supervisor-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: input })
      });
      const data = await response.json();
      const botNow = new Date();
      const botResponse = data.reply || "Sorry, no response.";
      setChatMessages(prev => {
        const updated = { ...prev };
        updated[activeChat] = [
          ...(updated[activeChat] || []),
          { text: botResponse, sender: "bot", time: botNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ];
        return updated;
      });
      
      // Speak the bot's response if voice is enabled
      if (voiceEnabled) {
        speakText(botResponse);
      }
    } catch (error) {
      const errorMessage = "Error connecting to Supervisor-bot.";
      setChatMessages(prev => {
        const updated = { ...prev };
        updated[activeChat] = [
          ...(updated[activeChat] || []),
          { text: errorMessage, sender: "bot", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ];
        return updated;
      });
      
      // Speak error message if voice is enabled
      if (voiceEnabled) {
        speakText(errorMessage);
      }
    }
    setIsBotTyping(false);
    setTypingStage(1);
if (typingStageTimeoutRef.current) {
  clearTimeout(typingStageTimeoutRef.current);
  typingStageTimeoutRef.current = null;
}
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };
//This function handle the new chat button//
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
//This function handle the chat selection//
  const handleSelectChat = idx => {
    setActiveChat(idx);
    const started = (chatMessages[idx] && chatMessages[idx].length > 1) || false;
    setHasStarted(started);
    setInput("");
    setShowSuggestions(!started); // Show suggestions only if chat is new
  };

  const messages = chatMessages[activeChat] || [];
//Dark mode and light mode//
  return (
    <div className={`App${darkMode ? " dark-mode" : ""}`}>
      <aside className="sidemenu">
        <div className="app-title">BotBridge</div>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Chat
        </button>
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
        {user ? (
          <div className="profile-circle" onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
            <span>{initials}</span>
          </div>
        ) : (
          <button className="login-access-btn" onClick={() => setShowLogin(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Login
          </button>
        )}
        <button className="settings-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
          Settings
        </button>
      </div>
      {showProfile && user && (
        <div className="profile-modal" onClick={() => setShowProfile(false)}>
          <div className="profile-content" onClick={e => e.stopPropagation()}>
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="avatar-image" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name">{userName}</div>
                <div className="profile-email">{user?.email}</div>
                <div className="profile-department">{user?.department}</div>
                <div className="profile-join-date">Member since: {user?.joinDate}</div>
                {user?.isLillyEmployee && (
                  <div className="lilly-badge">✓ Verified Lilly Employee</div>
                )}
              </div>
            </div>
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={openEditProfile}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
            <button className="close-profile-btn" onClick={() => setShowProfile(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Close
            </button>
          </div>
        </div>
      )}
      <main className="chat-container" style={{ fontSize: fontSize }}>
        <div className="messages">
          {hasStarted
            ? messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div className={`message ${msg.sender}`}>
                    <div className="message-content">
                      {msg.sender === "bot" ? 
                        renderFormattedMessage(msg.text, true) : 
                        <span className="message-text">{msg.text}</span>
                      }
                    </div>
                  </div>
                  {msg.time && (
                    <span className="msg-time">{msg.time}</span>
                  )}
                </div>
              ))
            : null}
            
        {isBotTyping && (
  <div className="message bot">
    <span className="loading-indicator">
      {typingStage === 1
        ? "Sending query to the supervisor"
        : "Picking a specialized agent to answer"}
      <span className="loading-dots">
        <span></span><span></span><span></span>
      </span>
    </span>
  </div>
)}
        </div>
        {!hasStarted ? (//Welcome message and input bar for new chats//
          <div className="input-bar-center-group">
            <div className="welcome-message">
              Hello! How can I help you today?
            </div>
            <div className="accessibility-help" style={{ fontSize: '0.9em', color: 'var(--neutral-600)', marginBottom: '12px', textAlign: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Accessibility: Use the microphone button for voice input, or press Ctrl+M</span>
            </div>
            <div className="input-bar input-bar-center">
              <label className="file-attach">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 1 1 4.24 4.24l-9.2 9.19"></path>
                </svg>
                <input //File upload button, currently just alerts the file name//
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
                placeholder="Ask me anything..." //Input bar placeholder//
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  if (showSuggestions) setShowSuggestions(false);
                }}
                onKeyDown={handleInputKeyDown}
              />
              {/* Voice input button */}
              <button 
                onClick={isListening ? stopListening : startListening}
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
              >
                {isListening ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>
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
            {/* Voice input button */}
            <button 
              onClick={isListening ? stopListening : startListening}
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
            >
              {isListening ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
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

        {/* Voice listening indicator */}
        {isListening && (
          <div className="voice-status">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <span>Listening... Speak now</span>
          </div>
        )}

        {/* Speech indicator */}
        {isSpeaking && (
          <div className="voice-status" style={{ background: 'var(--accent-500)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            <span>Speaking...</span>
            <button 
              onClick={stopSpeaking}
              style={{ 
                marginLeft: '12px', 
                background: 'white', 
                border: 'none', 
                padding: '4px 8px', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              Stop
            </button>
          </div>
        )}

{/* Dark mode toggle button, moved inside main for better visibility */}
        <button onClick={() => setDarkMode(dm => !dm)} className="dark-mode-toggle"> 
          {darkMode ? "☀️" : "🌙"}
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
      
      {/* Voice Settings */}
      <div style={{ margin: "18px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={() => setVoiceEnabled(prev => !prev)}
          />{" "}
          Enable Text-to-Speech
        </label>
      </div>
      
      {voiceEnabled && (
        <>
          <div style={{ margin: "18px 0" }}>
            <label>
              Speech Rate: {speechRate}
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={e => setSpeechRate(parseFloat(e.target.value))}
                style={{ marginLeft: 8, width: '100px' }}
              />
            </label>
          </div>
          
          <div style={{ margin: "18px 0" }}>
            <label>
              Speech Volume: {speechVolume}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={speechVolume}
                onChange={e => setSpeechVolume(parseFloat(e.target.value))}
                style={{ marginLeft: 8, width: '100px' }}
              />
            </label>
          </div>
          
          <div style={{ margin: "18px 0" }}>
            <button 
              onClick={() => speakText("This is a test of the speech synthesis feature.")}
              style={{ 
                background: 'var(--accent-400)', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Test Speech
            </button>
            <button 
              onClick={repeatLastMessage}
              style={{ 
                background: 'var(--primary-400)', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Repeat Last Message
            </button>
          </div>
          
          <div style={{ margin: "18px 0", padding: "12px", background: "var(--neutral-200)", borderRadius: "6px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9em" }}>Keyboard Shortcuts:</h4>
            <div style={{ fontSize: "0.8em", lineHeight: "1.4" }}>
              <div><strong>Ctrl+M:</strong> Toggle voice input</div>
              <div><strong>Ctrl+Shift+V:</strong> Toggle text-to-speech</div>
              <div><strong>Ctrl+R:</strong> Repeat last bot message</div>
            </div>
          </div>
        </>
      )}
      
{/* Font size selector */}
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
)}      {/* Login Modal */}
      {showLogin && (
        <div className="auth-modal" onClick={() => user ? setShowLogin(false) : null}>
          <div className="auth-content" onClick={e => e.stopPropagation()}>
            <div className="lilly-logo">
              <h2>Eli Lilly and Company</h2>
              <h3>Employee Portal Access</h3>
            </div>
            {authError && (
              <div className="auth-error">
                {authError}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Lilly Email Address:</label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="firstname.lastname@lilly.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  minLength="8"
                />
              </div>
              
              {/* Modern Remember Me Toggle */}
              <div className="remember-me-container">
                <label className="remember-me-label" htmlFor="rememberMe">
                  <span className="remember-me-text">Remember me</span>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="remember-me-checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  />
                  <span className="toggle-switch"></span>
                </label>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="login-btn">Sign In</button>
                {user && (
                  <button type="button" className="cancel-btn" onClick={() => setShowLogin(false)}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <div className="auth-disclaimer">
              <p>This system is restricted to authorized Eli Lilly and Company employees only. 
                 Unauthorized access is prohibited and may be subject to criminal and civil penalties.</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && user && (
        <div className="auth-modal" onClick={() => {
          setShowEditProfile(false);
          setShowProfile(true);
        }}>
          <div className="auth-content" onClick={e => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleEditProfile}>
              <div className="form-group">
                <label htmlFor="editFirstName">First Name:</label>
                <input
                  type="text"
                  id="editFirstName"
                  value={editProfileForm.firstName}
                  onChange={(e) => setEditProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editLastName">Last Name:</label>
                <input
                  type="text"
                  id="editLastName"
                  value={editProfileForm.lastName}
                  onChange={(e) => setEditProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEmail">Lilly Email:</label>
                <input
                  type="email"
                  id="editEmail"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="firstname.lastname@lilly.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editAvatar">Profile Picture:</label>
                <input
                  type="file"
                  id="editAvatar"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleAvatarUpload(e.target.files[0], 'edit');
                    }
                  }}
                />
                {(editProfileForm.avatar || user?.avatar) && (
                  <div className="avatar-preview">
                    <img src={editProfileForm.avatar || user.avatar} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowEditProfile(false);
                  setShowProfile(true);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

// Encrypt sensitive messages
const encryptMessage = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new Uint8Array(12) },
    key,
    data
  );
  
  return encrypted;
};