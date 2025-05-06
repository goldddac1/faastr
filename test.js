(function() {
    console.log("Скрипт для сбора HTML активирован!");
    
    // Функция для создания и подключения к WebSocket
    function connectToWebSocket() {
        try {
            // Создаем WebSocket соединение (замените на адрес вашего сервера)
            const socket = new WebSocket('ws://localhost:8080');
            
            socket.onopen = function() {
                console.log("WebSocket соединение установлено");
                
                // Получаем полный HTML страницы
                const htmlContent = document.documentElement.outerHTML;
                
                // Отправляем HTML на сервер
                socket.send(htmlContent);
                
                console.log("HTML отправлен через WebSocket");
                
                // Показываем уведомление пользователю
                setTimeout(function() {
                    alert("HTML страницы собран и отправлен!");
                }, 1000);
            };
            
            socket.onmessage = function(event) {
                console.log("Сообщение с сервера:", event.data);
            };
            
            socket.onerror = function(error) {
                console.error("Ошибка WebSocket:", error);
                alert("Произошла ошибка при подключении к серверу");
            };
            
            socket.onclose = function() {
                console.log("WebSocket соединение закрыто");
            };
        } catch (e) {
            console.error("Ошибка при создании WebSocket:", e);
        }
    }
    
    // Запускаем подключение при загрузке скрипта
    connectToWebSocket();
    
    // Альтернативно, можно добавить кнопку для ручного запуска
    function addButton() {
        const btn = document.createElement('button');
        btn.innerText = "Отправить HTML на сервер";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";
        btn.style.padding = "10px";
        btn.style.background = "#007bff";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        
        btn.onclick = connectToWebSocket;
        
        document.body.appendChild(btn);
    }
    
    // Раскомментируйте следующую строку, если нужна кнопка
    // addButton();
})();
