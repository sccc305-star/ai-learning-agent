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

        Target audience: Someone with basic knowledge.
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

        Target audience: Experienced learner who wants deep knowledge.
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
@app.route('/quiz', methods=['POST'])
def quiz():
    data = request.get_json()
    topic = data['topic']

    prompt = f"""
    Create a quiz for topic: {topic}
    
    Give exactly 3 multiple choice questions.
    Format each question like this:
    
    Q1: Question here?
    A) Option 1
    B) Option 2
    C) Option 3
    D) Option 4
    Answer: A
    
    Q2: Question here?
    A) Option 1
    B) Option 2
    C) Option 3
    D) Option 4
    Answer: B
    
    Q3: Question here?
    A) Option 1
    B) Option 2
    C) Option 3
    D) Option 4
    Answer: C
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

    return jsonify({'result': 'Service busy, please try again!'})
if __name__ == '__main__':
    app.run(debug=True)