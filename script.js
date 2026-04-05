document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.send-btn');
    const inputBox = document.querySelector('.input-box');
    const chatContainer = document.querySelector('.chat-container');

    // API Anahtarın buraya eklendi
    const API_KEY = 'AIzaSyBywifUfLoqVU5eAakr5cnzCNtqrCyNDhw'; 

    sendBtn.addEventListener('click', sendMessage);
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const text = inputBox.value.trim();
        if (text === '') return;

        // Senin mesajını ekrana ekle
        appendMessage(text, 'user');
        inputBox.value = '';

        // H&B düşünürken görünecek geçici mesaj
        const loadingMsg = appendMessage("H&B düşünüyor... 🐾", 'assistant');

        try {
            // Gemini Yapay Zeka API'sine bağlanıyoruz
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            
            // Yapay zekadan gelen cevabı ekrana yazdır
            if(data.candidates && data.candidates.length > 0) {
                const botReply = data.candidates[0].content.parts[0].text;
                loadingMsg.textContent = botReply;
            } else {
                loadingMsg.textContent = "Sanırım beynimde bir kısa devre oldu, tekrar dener misin?";
            }

        } catch (error) {
            loadingMsg.textContent = "İnternet bağlantımda bir sorun var sanırım! 🙀";
        }
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'message' : 'message assistant';
        
        if (sender === 'user') {
            msgDiv.style.backgroundColor = '#111111';
            msgDiv.style.color = '#ffffff';
            msgDiv.style.marginLeft = 'auto';
        }

        msgDiv.textContent = text;
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return msgDiv; 
    }
});
