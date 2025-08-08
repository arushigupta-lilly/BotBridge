# 🤖 BotBridge Setup Guide

This guide will help you get BotBridge running locally. Follow the steps below to install dependencies, run the backend, and launch the frontend.

---

## 🛠 Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js & npm**  
  [Download from Node.js official site](https://nodejs.org/en)

- **Yarn (optional but recommended)**  
  You can install it globally with:  
  ```bash
  npm install -g yarn
  ```

- **Python**  
  [Download Python](https://www.python.org/downloads/)

- **Lilly's Light Client**  
  [Download the client](https://client-python.apps.lrl.lilly.com/)

---

## 🚀 Getting Started

### 1. Clone the GitHub Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
git checkout master
```

### 2. Install Dependencies

If you're using Yarn:

```bash
yarn install
```

Or with npm:

```bash
npm install
```

---

## 🧠 Running the Supervisor Bot Backend

1. Locate the file `supervisorbot_api.py` in the project directory.
2. Run it using Python:

```bash
python supervisorbot_api.py
```

3. After the bot starts, a link will appear in the terminal. Click the link and enter your authentication code when prompted.

---

## 🌐 Running the BotBridge Web App

Once authenticated:

1. Open a **new** terminal window.
2. Run the frontend app with:

```bash
yarn start
```

3. This will launch the BotBridge web interface in your browser on `http://localhost:3000`.

You can now send queries to the bot from your local environment!

---

## 📬 Support

If you encounter any issues, feel free to contact: **guptaarushi68@gmail.com**
