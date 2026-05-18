from flask import Flask, render_template, request, jsonify
import requests
import json
import os

app = Flask(__name__)

OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/learn', methods=['POST'])
def learn():
    data = request.get_json()
    topic = data['topic']

    prompt = f"""
    Topic: {topic}

    Please provide:
    1. Simple explanation (3-4 lines)
    2. 3 Key points to learn
    3. 2 Real life examples
    4. 1 Practice question

    Keep it beginner friendly.
    """

    models = [
        "deepseek/deepseek-v4-flash:free",
        "arcee-ai/arcee-trinity-7b-thinking:free",
        "nousresearch/hermes-3-llama-3.1-405b:free",
        "nvidia/nemotron-3-nano-omni:free",
        "baidu/qianfan-cobuddy:free"
    ]

    for model in models:
        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                data=json.dumps({
                    "model": model,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                })
            )
            result = response.json()
            if 'choices' in result:
                answer = result['choices'][0]['message']['content']
                return jsonify({'result': answer})
        except:
            continue

    return jsonify({'result': 'Service busy, please try again in a moment!'})

if __name__ == '__main__':
    app.run(debug=True)