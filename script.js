document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.send-btn');
    const inputBox = document.querySelector('.input-box');
    const chatContainer = document.querySelector('.chat-container');

    // YENİ API ANAHTARIN BURAYA EKLENDİ
    const API_KEY = 'AIzaSyAORRPdeXV_Ie5VjVFdwgJyPxLU9J47pWA'; 

    sendBtn.addEventListener('click', sendMessage);
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const text = inputBox.value.trim();
        if (text === '') return;

        appendMessage(text, 'user');
        inputBox.value = '';

        const loadingMsg = appendMessage("H&B düşünüyor... 🐾", 'assistant');

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: "Senin adın H&B. Sen yaratıcının özel kişisel asistanısın. Robot gibi veya sözlük gibi değil, samimi, esprili, havalı ve zeki bir dost gibi cevaplar ver. Uzun ve sıkıcı açıklamalardan kaçın, kısa ve net ol. Logondaki kedi ve köpeği temsilen bazen 🐾, 🐱 veya 🐶 emojilerini kullan." }]
                    },
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            
            if(data.candidates && data.candidates.length > 0) {
                loadingMsg.textContent = data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                loadingMsg.textContent = "Sistem Hatası: " + data.error.message;
            } else {
                loadingMsg.textContent = "Sanırım beynimde bir kısa devre oldu.";
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
