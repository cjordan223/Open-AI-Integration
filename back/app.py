import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import logging


app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept", "Origin"],
        "supports_credentials": True
    }
})


# retrieve token to set up the client

token = os.environ.get("OPEN_AI_KEY")
endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o"

client = OpenAI(
    base_url=endpoint,
    api_key=token
)

logging.basicConfig(level=logging.DEBUG)


@app.route("/")
def index():
    return render_template("front/public/index.html")


@app.route("/query", methods=["POST"])
def query():
    data = request.get_json()
    user_query = data.get("query") if data else None
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Updated to match the documentation's format
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant"},
                {"role": "user", "content": user_query},
            ],
            model=model_name,
            temperature=1.0,
            top_p=1.0,
            max_tokens=1000,
        )

        logging.debug(f"OpenAI response: {response}")
        answer = response.choices[0].message.content
        return jsonify({"answer": answer})
    except Exception as e:
        logging.error(f"Error calling OpenAI API: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
