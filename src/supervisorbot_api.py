"""travelbot_api.py

Flask API backend for the TravelBot application.
Receives user prompts from the frontend, sends them to the Cortex supervisor-bot model via the Lilly Light Client,
and returns the model's response.

Author: Daniella Melero
Date: 2025-06-18
"""

from flask import Flask, request, jsonify  # For building the API and handling requests/responses
from light_client import LIGHTClient       # Lilly's Light Client for Cortex API access
from flask_cors import CORS                # To enable CORS for frontend-backend communication

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize the Light Client and set the Cortex API base URL
client = LIGHTClient()
CORTEX_BASE = "https://api.cortex.lilly.com"

@app.route("/api/supervisor-bot", methods=["POST"])
def supervisor():
    """
    API endpoint to handle POST requests from the frontend.
    Expects JSON with a 'q' field containing the user's prompt.
    Sends the prompt to the Cortex supervisor-bot model and returns the response.
    """
    prompt = request.json.get("q")
    print("Prompt received:", prompt)
    try:
        # Send the prompt to the Cortex supervisor-bot model
        result = client.post(f"{CORTEX_BASE}/model/ask/supervisor-bot", data={"q": prompt})
        print("Cortex status:", result.status_code)
        print("Cortex response:", result.text)
        if result.status_code != 200:
            # If the model returns an error, forward it to the frontend
            return jsonify({"error": result.text}), result.status_code
        data = result.json()
        output = data.get('message', '')
        print("Output:", output)
        return jsonify({"reply": output})
    except Exception as e:
        # Handle unexpected errors gracefully
        print("Exception:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run the Flask app on port 5000
    app.run(port=5000)