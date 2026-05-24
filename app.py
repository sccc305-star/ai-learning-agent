from flask import Flask, render_template, request, jsonify
import requests
import json
import os

app = Flask(__name__)

OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')

def ask_ai(prompt):
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }),
            timeout=30
        )
        result = response.json()
        if 'choices' in result:
            return result['choices'][0]['message']['content']
    except:
        pass
    return "Service busy, please try again!"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/learn', methods=['POST'])
def learn():
    data = request.get_json()
    topic = data['topic']
    level = data.get('level', 'Basic')

    if level == 'Basic':
        prompt = f"""
        Topic: {topic}
        Level: Beginner
        Please provide:
        1. Simple explanation (3-4 lines) in very easy words
        2. 3 Key points to learn
        3. 2 Real life examples
        4. 1 Simple practice question
        Keep it very simple for beginners.
        """
    elif level == 'Medium':
        prompt = f"""
        Topic: {topic}
        Level: Intermediate
        Please provide:
        1. Detailed explanation (5-6 lines)
        2. 5 Key concepts to understand
        3. 3 Real world use cases
        4. 2 Practice questions with hints
        5. Common mistakes to avoid
        """
    else:
        prompt = f"""
        Topic: {topic}
        Level: Advanced/Deep
        Please provide:
        1. In-depth technical explanation
        2. 7 Advanced concepts
        3. 3 Complex real world examples
        4. 3 Challenging practice questions
        5. Best practices and optimization tips
        6. Related advanced topics to explore
        """

    result = ask_ai(prompt)
    return jsonify({'result': result})

@app.route('/quiz', methods=['POST'])
def quiz():
    data = request.get_json()
    topic = data['topic']

    prompt = f"""
    Create a quiz for topic: {topic}
    Give exactly 3 multiple choice questions.
    Format:
    Q1: Question?
    A) Option 1
    B) Option 2
    C) Option 3
    D) Option 4
    Answer: A
    """

    result = ask_ai(prompt)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)