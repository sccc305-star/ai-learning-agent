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
        displayInteractiveQuiz(data.result, topic);

        quizBtn.innerHTML = '📝 Take Quiz';
        quizBtn.disabled = false;

    } catch (error) {
        quizBtn.innerHTML = '📝 Take Quiz';
        quizBtn.disabled = false;
        alert('Something went wrong! Please try again.');
    }
}

function displayInteractiveQuiz(quizText, topic) {
    const lines = quizText.split('\n').filter(l => l.trim());
    let questions = [];
    let current = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.match(/^Q\d+:/)) {
            if (current) questions.push(current);
            current = { question: line.replace(/^Q\d+:\s*/, ''), options: [], answer: '' };
        } else if (line.match(/^[A-D]\)/)) {
            if (current) current.options.push(line);
        } else if (line.match(/^Answer:/)) {
            if (current) current.answer = line.replace('Answer:', '').trim();
        }
    });
    if (current) questions.push(current);

    let html = `<h3 style="color:#c2185b;margin-bottom:15px;">📝 Quiz: ${topic}</h3>`;
    html += `<div id="score-box" style="display:none;padding:15px;background:#e8f5e9;border-radius:10px;margin-bottom:15px;text-align:center;font-size:1.2rem;color:#2e7d32;font-weight:bold;"></div>`;
    
    questions.forEach((q, i) => {
        html += `<div class="quiz-question" id="q${i}">`;
        html += `<p style="font-weight:bold;margin-bottom:10px;color:#333;">${i+1}. ${q.question}</p>`;
        q.options.forEach(opt => {
            const letter = opt[0];
            html += `<button class="quiz-option" onclick="checkAnswer(this, '${letter}', '${q.answer}', 'q${i}')">${opt}</button>`;
        });
        html += `<div class="answer-feedback" id="feedback${i}"></div>`;
        html += `</div><br>`;
    });

    html += `<button onclick="submitQuiz(${questions.length})" class="copy-btn" style="margin-top:10px;">✅ Submit Quiz</button>`;

    document.getElementById('result').innerHTML = html;
    window.quizAnswers = questions.map(q => q.answer);
    window.userAnswers = new Array(questions.length).fill(null);
}

function checkAnswer(btn, selected, correct, qId) {
    const qDiv = document.getElementById(qId);
    const buttons = qDiv.querySelectorAll('.quiz-option');
    
    buttons.forEach(b => b.disabled = true);
    
    const qIndex = parseInt(qId.replace('q', ''));
    window.userAnswers[qIndex] = selected;

    if (selected === correct) {
        btn.style.background = '#4caf50';
        btn.style.color = 'white';
        document.getElementById('feedback' + qIndex).innerHTML = '✅ Correct!';
        document.getElementById('feedback' + qIndex).style.color = '#2e7d32';
    } else {
        btn.style.background = '#f44336';
        btn.style.color = 'white';
        document.getElementById('feedback' + qIndex).innerHTML = `❌ Wrong! Correct: ${correct}`;
        document.getElementById('feedback' + qIndex).style.color = '#c62828';
        
        buttons.forEach(b => {
            if (b.textContent[0] === correct) {
                b.style.background = '#4caf50';
                b.style.color = 'white';
            }
        });
    }
}

function submitQuiz(total) {
    const correct = window.userAnswers.filter((a, i) => a === window.quizAnswers[i]).length;
    const scoreBox = document.getElementById('score-box');
    scoreBox.style.display = 'block';
    
    if (correct === total) {
        scoreBox.innerHTML = `🏆 Perfect Score! ${correct}/${total} — Excellent!`;
        scoreBox.style.background = '#e8f5e9';
    } else if (correct >= total/2) {
        scoreBox.innerHTML = `👍 Good Job! ${correct}/${total} — Keep Learning!`;
        scoreBox.style.background = '#fff9c4';
    } else {
        scoreBox.innerHTML = `📚 ${correct}/${total} — Review the topic and try again!`;
        scoreBox.style.background = '#ffebee';
    }
    
    scoreBox.scrollIntoView({behavior: 'smooth'});
}