document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.send-btn');
    const inputBox = document.querySelector('.input-box');
    const chatContainer = document.querySelector('.chat-container');

    // Gönder butonuna basıldığında veya Enter'a basıldığında çalışır
    sendBtn.addEventListener('click', sendMessage);
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const text = inputBox.value.trim();
        if (text === '') return;

        // Senin mesajını ekranda sağa yaslı ve siyah gösterelim
        const userMsg = document.createElement('div');
        userMsg.className = 'message';
        userMsg.style.backgroundColor = '#111111';
        userMsg.style.color = '#ffffff';
        userMsg.style.marginLeft = 'auto'; // Sağa yaslamak için
        userMsg.textContent = text;
        
        chatContainer.appendChild(userMsg);
        inputBox.value = ''; // Kutuyu temizle
        chatContainer.scrollTop = chatContainer.scrollHeight; // En alta kaydır

        // H&B'nin gecikmeli cevabı
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message assistant';
            botMsg.textContent = "Şu an sadece arayüzümü test ediyoruz, henüz beynim kodlanmadı ama yakında harika şeyler yapacağız! 🐾";
            chatContainer.appendChild(botMsg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 1000); // 1 saniye bekleyip cevap verir
    }
});
