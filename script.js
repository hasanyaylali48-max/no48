document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.send-btn');
    const inputBox = document.querySelector('.input-box');
    const chatContainer = document.querySelector('.chat-container');
    const setupPanel = document.getElementById('setup-panel');
    const apiInput = document.getElementById('api-input');
    const saveKeyBtn = document.getElementById('save-key-btn');

    // Telefonun hafızasından anahtarı kontrol et
    let API_KEY = localStorage.getItem('hb_api_key');

    // Eğer anahtar yoksa giriş panelini göster
    if (!API_KEY) {
        setupPanel.style.display = 'block';
    }

    // Anahtarı kaydetme işlemi
    saveKeyBtn.addEventListener('click', () => {
        const val = apiInput.value.trim();
        if (val.startsWith('AIza')) {
            localStorage.setItem('hb_api_key', val);
            API_KEY = val;
            setupPanel.style.display = 'none';
            appendMessage("Anahtar başarıyla telefonuna kaydedildi! Artık tamamen hazırım Hasan. 🐾", 'assistant');
        } else {
            alert("Lütfen geçerli bir API anahtarı gir!");
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    inputBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const text = inputBox.value.trim();
        if (text === '' || !API_KEY) return;

        appendMessage(text, 'user');
        inputBox.value = '';

        const loadingMsg = appendMessage("H&B düşünüyor... 🐾", 'assistant');

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: "Senin adın H&B. Sen Hasan'ın özel kişisel asistanısın. Samimi, esprili, havalı ve zeki bir dost gibi cevaplar ver. 🐾" }]
                    },
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            
            if(data.candidates && data.candidates.length > 0) {
                loadingMsg.textContent = data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                loadingMsg.textContent = "Sistem Hatası: Anahtar geçersiz olabilir. Lütfen ayarları kontrol et.";
                localStorage.removeItem('hb_api_key'); // Hatalıysa sil ki tekrar sorsun
                setTimeout(() => { location.reload(); }, 2000);
            } else {
                loadingMsg.textContent = "Beynimde bir kısa devre oldu, tekrar dener misin?";
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
