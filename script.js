document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.send-btn');
    const inputBox = document.querySelector('.input-box');
    const chatContainer = document.querySelector('.chat-container');

    const API_KEY = 'AIzaSyBywifUfLoqVU5eAakr5cnzCNtqrCyNDhw'; 
    let activeModel = null; // H&B bulduğu modeli buraya kaydedecek

    sendBtn.addEventListener('click', sendMessage);
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Google'a sorup çalışan modeli bulan fonksiyon
    async function getValidModel() {
        if (activeModel) return activeModel; // Zaten bulduysa tekrar arama
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
            const data = await res.json();
            if (data.models) {
                // Sohbet edebilen (generateContent) ilk Gemini modelini bul
                const model = data.models.find(m => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'));
                if (model) {
                    activeModel = model.name;
                    return activeModel;
                }
            }
            return 'models/gemini-1.5-flash'; // Bulamazsa varsayılanı dene
        } catch(e) {
            return 'models/gemini-1.5-flash';
        }
    }

    async function sendMessage() {
        const text = inputBox.value.trim();
        if (text === '') return;

        appendMessage(text, 'user');
        inputBox.value = '';

        const loadingMsg = appendMessage("H&B beynini tarıyor ve düşünüyor... 🐾", 'assistant');

        try {
            const modelName = await getValidModel(); // Çalışan modeli al
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
            });

            const data = await response.json();
            
            if(data.candidates && data.candidates.length > 0) {
                loadingMsg.textContent = data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                loadingMsg.textContent = "Sistem Hatası (" + modelName + "): " + data.error.message;
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
