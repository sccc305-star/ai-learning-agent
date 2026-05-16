from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

OPENROUTER_API_KEY = "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"

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
    
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps({
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        })
    )
    
    result = response.json()
    
    if 'choices' in result:
        answer = result['choices'][0]['message']['content']
    else:
        answer = str(result)
    
    return jsonify({'result': answer})

if __name__ == '__main__':
    app.run(debug=True)