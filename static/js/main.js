async function learnTopic() {
    const topic = document.getElementById('topicInput').value;
    
    if (!topic) {
        alert('Please enter a topic!');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';

    try {
        const response = await fetch('/learn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic: topic })
        });

        const data = await response.json();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').innerHTML = formatResult(data.result);

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

function setTopic(topic) {
    document.getElementById('topicInput').value = topic;
    learnTopic();
}

document.getElementById('topicInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        learnTopic();
    }
});