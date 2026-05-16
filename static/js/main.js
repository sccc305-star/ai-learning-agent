async function learnTopic() {
    const topic = document.getElementById('topicInput').value;
    
    if (!topic) {
        alert('Please enter a topic!');
        return;
    }

    // Loading show karo
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

        // Result show karo
        document.getElementById('loading').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').innerHTML = data.result;

    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert('Something went wrong! Please try again.');
    }
}

// Enter key se bhi search ho
document.getElementById('topicInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        learnTopic();
    }
});