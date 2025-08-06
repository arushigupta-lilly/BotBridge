# BotBridge

BotBridge is an intelligent multi-agent chatbot platform designed specifically for Eli Lilly and Company employees. It provides access to specialized AI agents for medicine information, compliance guidance, web search capabilities, and travel assistance through a unified, user-friendly interface.

## 🌟 Features

### Multi-Agent System
- **Medicine Bot** 💊 - Medical information and drug-related queries
- **Compliance Bot** 📋 - Regulatory compliance and quality assurance guidance
- **WebSearch & Scrape Bot** 🌐 - Real-time web search and regulation scraping
- **Traveller Bot** 🔎 - Travel guidance and trip assistance
- **Supervisor System** - Intelligent routing to the most appropriate agent

### Enhanced User Experience
- **Voice Integration** 🎤 - Speech-to-text input and text-to-speech output
- **Multi-Chat Support** - Manage multiple conversations simultaneously
- **Real-time Responses** - Live typing indicators and response formatting
- **Accessibility Features** - Keyboard shortcuts and assistive technology support
- **Dark/Light Mode** - Customizable interface themes
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### Security & Authentication
- **Lilly Employee Authentication** - Secure login with Lilly email verification
- **Session Management** - Secure user sessions with auto-expiration
- **Profile Management** - User profile customization and avatar support
- **Data Encryption** - Client-side message encryption for sensitive information

### Interactive Features
- **Smart Suggestions** - Context-aware conversation starters
- **Message Feedback** - Like/dislike system for response quality
- **File Attachments** - Support for document uploads (planned)
- **Message Formatting** - Rich text rendering with markdown support

## 🏗️ Architecture

```
Frontend (React)     Backend (Flask)      AI Platform
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   BotBridge     │  │ supervisorbot   │  │ Cortex API      │
│   Web App       │──│ API Server      │──│ (Lilly Light    │
│                 │  │ (Port 5000)     │  │ Client)         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **Lilly Light Client** access
- **Valid Lilly email** address for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BotBridge
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   pip install flask flask-cors light_client
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   python src/supervisorbot_api.py
   ```
   The Flask API will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm start
   ```
   The React app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🔧 Configuration

### Environment Variables

The application uses the following environment configurations:

- **CORTEX_BASE_URL**: `https://api.cortex.lilly.com` (Lilly's AI platform)
- **SESSION_TIMEOUT**: 24 hours (user session duration)
- **SUPPORTED_DOMAINS**: `@lilly.com`, `@elililly.com`

### Voice Features Setup

The application automatically detects browser support for:
- **Speech Recognition**: Chrome, Edge, Safari (latest versions)
- **Speech Synthesis**: All modern browsers

## 📖 Usage Guide

### Authentication
1. Access the application at the deployed URL
2. Click "Login" in the top-right corner
3. Enter your Lilly email address and password
4. System validates against approved Lilly domains

### Basic Chat Operations
- **New Chat**: Click the "+" button in the sidebar
- **Voice Input**: Click the microphone icon or press `Ctrl+M`
- **Send Message**: Type and press Enter or click the send button
- **Switch Chats**: Click on chat names in the sidebar

### Keyboard Shortcuts
- `Ctrl+M`: Toggle voice input
- `Ctrl+Shift+V`: Toggle text-to-speech
- `Ctrl+R`: Repeat last bot message
- `Enter`: Send message

### Agent Interaction
The system automatically routes queries to specialized agents based on content:
- Medicine-related questions → Medicine Bot
- Compliance queries → Compliance Bot
- Web search needs → WebSearch & Scrape Bot
- Travel inquiries → Traveller Bot

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For continuous testing:
```bash
npm test -- --watch
```

## 🛠️ Development

### Project Structure
```
BotBridge/
├── public/                 # Static assets
├── src/
│   ├── App.js             # Main React component
│   ├── App.css            # Application styles
│   ├── supervisorbot_api.py # Flask backend API
│   └── ...                # Additional React files
├── package.json           # Node.js dependencies
└── README.md             # This file
```

### Key Dependencies

**Frontend:**
- React 19.1.0
- React Testing Library
- Web Vitals

**Backend:**
- Flask (Python web framework)
- Flask-CORS (Cross-origin requests)
- Light Client (Lilly's Cortex API client)

### Code Style
- ESLint configuration for React
- Consistent formatting with Prettier
- Component-based architecture
- Responsive CSS design

## 🔒 Security Features

- **Domain Restriction**: Only Lilly email addresses accepted
- **Session Management**: Automatic logout after 24 hours
- **CORS Protection**: Configured for internal network access
- **Input Validation**: Sanitized user inputs and API calls
- **Client-side Encryption**: Sensitive messages encrypted before storage

## 🌐 Browser Support

- **Chrome/Chromium** (recommended for voice features)
- **Microsoft Edge**
- **Safari** (limited voice support)
- **Firefox** (no voice recognition support)

## 📱 Accessibility

BotBridge is designed with accessibility in mind:
- Screen reader compatible
- Keyboard navigation support
- High contrast mode available
- Adjustable font sizes
- Voice interaction capabilities
- Clear focus indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to Eli Lilly and Company. Unauthorized access, use, or distribution is prohibited.

## 👥 Support

For technical support or questions:
- **Internal Support**: Contact the IT Service Desk
- **Development Team**: [BU developers names please]
- **Documentation**: Internal Confluence pages

## 🔄 Version History

- **v0.1.0** - Initial release with multi-agent support
- **Current** - Enhanced voice features and accessibility improvements

---

**⚠️ Important Notice**: This application is restricted to authorized Eli Lilly and Company employees only. Unauthorized access is prohibited and may be subject to criminal and civil penalties.
