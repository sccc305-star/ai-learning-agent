let currentLevel = 'Basic';

function setLevel(level, btn) {
    currentLevel = level;
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setTopic(topic) {
    document.getElementById('topicInput').value = topic;
    learnTopic();
}

async function learnTopic() {
    const topic = document.getElementById('topicInput').value;

    if (!topic) {
        alert('Please enter a topic!');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';

    try {
        const response = await fetch('/learn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic, level: currentLevel })
        });

        const data = await response.json();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('resultContainer').style.display = 'block';
        document.getElementById('result').innerHTML = formatResult(data.result);

        // Follow-up questions
        showFollowup(topic);

    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert('Something went wrong! Please try again.');
    }
}

function formatResult(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function copyResult() {
    const result = document.getElementById('result').innerText;
    navigator.clipboard.writeText(result);
    
    const btn = document.querySelector('.copy-btn');
    btn.innerHTML = '✅ Copied!';
    setTimeout(() => { btn.innerHTML = '📋 Copy'; }, 2000);
}

function showFollowup(topic) {
    const questions = [
        `${topic} advanced concepts`,
        `${topic} projects for beginners`,
        `${topic} interview questions`,
        `${topic} best practices`,
        `${topic} vs alternatives`
    ];

    const container = document.getElementById('followupQuestions');
    container.innerHTML = '';
    questions.forEach(q => {
        const span = document.createElement('span');
        span.textContent = q;
        span.onclick = () => {
            document.getElementById('topicInput').value = q;
            learnTopic();
        };
        container.appendChild(span);
    });
}

document.getElementById('topicInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') learnTopic();
});
async function generateQuiz() {
    const topic = document.getElementById('topicInput').value;
    
    if (!topic) {
        alert('Please enter a topic first!');
        return;
    }

    const quizBtn = document.querySelector('.quiz-btn');
    quizBtn.innerHTML = '⏳ Generating...';
    quizBtn.disabled = true;

    try {
        const response = await fetch('/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });

        const data = await response.json();

        // Show quiz in result box
        document.getElementById('result').innerHTML = 
            '<h3 style="color:#c2185b;margin-bottom:15px;">📝 Quiz: ' + topic + '</h3>' + 
            formatResult(data.result);

        quizBtn.innerHTML = '📝 Take Quiz';
        quizBtn.disabled = false;

    } catch (error) {
        quizBtn.innerHTML = '📝 Take Quiz';
        quizBtn.disabled = false;
        alert('Something went wrong! Please try again.');
    }
}