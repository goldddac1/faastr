(function() {
    console.log("🚀 Скрипт активирован: " + new Date().toISOString());
    
    // Функция для отправки HTML через WebSocket
    function sendHTMLToServer() {
        try {
            console.log("📡 Попытка соединения с WebSocket...");
            
            // IP-адрес вашего сервера (замените на реальный адрес)
            const serverAddress = "ws://localhost:8080";
            console.log("🔌 Адрес сервера: " + serverAddress);
            
            // Создаем WebSocket соединение
            const socket = new WebSocket(serverAddress);
            
            socket.onopen = function() {
                console.log("✅ WebSocket соединение установлено!");
                
                // Получаем HTML страницы
                const htmlContent = document.documentElement.outerHTML;
                console.log(`📦 Получен HTML, размер: ${htmlContent.length} байт`);
                
                // Отправляем данные
                socket.send(htmlContent);
                console.log("📤 HTML отправлен на сервер");
                
                alert("Соединение установлено! HTML отправлен на сервер.");
            };
            
            socket.onmessage = function(event) {
                console.log("📩 Сообщение получено: " + event.data);
                alert("Сообщение от сервера: " + event.data);
            };
            
            socket.onerror = function(error) {
                console.error("❌ Ошибка WebSocket:", error);
                alert("Ошибка соединения с сервером!");
            };
            
            socket.onclose = function(event) {
                console.log(`🔒 WebSocket закрыт: ${event.code} ${event.reason}`);
            };
        } catch (e) {
            console.error("❌ Критическая ошибка:", e);
            alert("Ошибка: " + e.message);
        }
    }
    
    // Добавляем видимую индикацию работы скрипта
    function addVisualIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = "⚙️ Скрипт загружен";
        indicator.style.position = "fixed";
        indicator.style.top = "10px";
        indicator.style.right = "10px";
        indicator.style.background = "rgba(0,0,0,0.7)";
        indicator.style.color = "white";
        indicator.style.padding = "5px 10px";
        indicator.style.borderRadius = "5px";
        indicator.style.zIndex = "9999";
        document.body.appendChild(indicator);
        
        // Добавляем кнопку для ручного подключения
        const button = document.createElement('button');
        button.textContent = "Подключиться к WebSocket";
        button.style.position = "fixed";
        button.style.top = "40px";
        button.style.right = "10px";
        button.style.background = "#007bff";
        button.style.color = "white";
        button.style.padding = "5px 10px";
        button.style.borderRadius = "5px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.zIndex = "9999";
        button.onclick = sendHTMLToServer;
        document.body.appendChild(button);
    }
    
    // Показываем индикатор
    addVisualIndicator();
    
    // Запускаем соединение с небольшой задержкой
    setTimeout(sendHTMLToServer, 1000);
    
    console.log("✨ Инициализация скрипта завершена");
})();
