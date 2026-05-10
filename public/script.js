const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

let conversationHistory = [];

chatForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const userText = userInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    userInput.value = '';

    const thinkingId = appendMessage('bot', 'NusaBot lagi ngeracik jawaban...', true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userText,
                history: conversationHistory 
            })
        });

        const data = await response.json();

        conversationHistory.push({ role: "user", parts: [{ text: userText }] });
        conversationHistory.push({ role: "model", parts: [{ text: data.result }] });

        updateMessage(thinkingId, data.result);

    } catch (error) {
        updateMessage(thinkingId, "Waduh, koneksi ke dapur putus nih. Coba lagi yak! 😅");
    }
});

function appendMessage(sender, text, isThinking = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    const id = 'msg-' + Date.now();
    msgDiv.id = id;

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('msg-content');
    if (isThinking) contentDiv.classList.add('thinking');
    
    contentDiv.innerHTML = formatText(text); 
    
    msgDiv.appendChild(contentDiv);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return id;
}

function updateMessage(id, newText) {
    const msgDiv = document.getElementById(id);
    if (msgDiv) {
        const contentDiv = msgDiv.querySelector('.msg-content');
        contentDiv.classList.remove('thinking');
        contentDiv.innerHTML = formatText(newText);
    }
}

function formatText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\n/g, '<br>');
}