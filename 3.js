(function() {
    // Отключаем логирование в консоль
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Заменяем функции консоли на пустые
    console.log = function() {};
    console.error = function() {};
    console.warn = function() {};
    
    // URL вашего сервера WebSocket (замените на свой)
    const serverAddress = "ws://localhost:8080";
    
    // Переменная для хранения WebSocket соединения
    let socket = null;
    
    // Переменная для хранения последнего сообщения
    let lastMessage = "";
    
    // Позиция отображения сообщения (по умолчанию - не показывать)
    let messagePosition = "none";
    
    // Функция для подключения к WebSocket серверу
    function connectToWebSocket() {
        try {
            // Создаем WebSocket соединение
            socket = new WebSocket(serverAddress);
            
            socket.onopen = function() {
                // Получаем HTML страницы
                const htmlContent = document.documentElement.outerHTML;
                
                // Отправляем HTML на сервер
                socket.send(JSON.stringify({
                    type: 'html',
                    content: htmlContent,
                    url: window.location.href
                }));
            };
            
            socket.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'admin') {
                        // Запоминаем последнее сообщение от админа
                        lastMessage = data.message;
                        updateMessageDisplay();
                    } else if (data.type === 'chat') {
                        // Запоминаем последнее сообщение из чата
                        lastMessage = `${data.clientId}: ${data.message}`;
                        updateMessageDisplay();
                    }
                } catch (e) {
                    // Для текстовых сообщений
                    lastMessage = event.data;
                    updateMessageDisplay();
                }
            };
            
            socket.onclose = function() {
                // Пытаемся переподключиться через 5 секунд
                setTimeout(connectToWebSocket, 5000);
            };
        } catch (e) {
            // Игнорируем ошибки
        }
    }
    
    // Функция для создания и обновления элемента сообщения
    function createMessageElement() {
        let messageElement = document.getElementById('stealth-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'stealth-message';
            messageElement.style.position = 'fixed';
            messageElement.style.fontSize = '10px';
            messageElement.style.padding = '5px';
            messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            messageElement.style.color = 'white';
            messageElement.style.borderRadius = '3px';
            messageElement.style.zIndex = '9999';
            messageElement.style.maxWidth = '300px';
            messageElement.style.wordBreak = 'break-word';
            messageElement.style.display = 'none';
            
            document.body.appendChild(messageElement);
        }
        
        return messageElement;
    }
    
    // Функция для обновления отображения сообщения
    function updateMessageDisplay() {
        const messageElement = createMessageElement();
        
        // Устанавливаем текст сообщения
        messageElement.textContent = lastMessage;
        
        // Устанавливаем позицию отображения
        if (messagePosition === "right") {
            messageElement.style.top = '10px';
            messageElement.style.right = '10px';
            messageElement.style.left = 'auto';
            messageElement.style.bottom = 'auto';
            messageElement.style.display = 'block';
        } else if (messagePosition === "left") {
            messageElement.style.top = '10px';
            messageElement.style.left = '10px';
            messageElement.style.right = 'auto';
            messageElement.style.bottom = 'auto';
            messageElement.style.display = 'block';
        } else if (messagePosition === "center") {
            messageElement.style.top = '50%';
            messageElement.style.left = '50%';
            messageElement.style.transform = 'translate(-50%, -50%)';
            messageElement.style.display = 'block';
        } else {
            messageElement.style.display = 'none';
        }
    }
    
    // Функция для отправки HTML
    function sendHTML() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            // Получаем HTML страницы
            const htmlContent = document.documentElement.outerHTML;
            
            // Отправляем HTML на сервер
            socket.send(JSON.stringify({
                type: 'html',
                content: htmlContent,
                url: window.location.href
            }));
        }
    }
    
    // Обработчик нажатий клавиш
    document.addEventListener('keydown', function(event) {
        // Используем только клавиши без модификаторов
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }
        
        // Английская раскладка
        if (event.key === 'r' || event.key === 'R') {
            // Переподключение
            if (socket) {
                socket.close();
            }
            connectToWebSocket();
        } else if (event.key === 'j' || event.key === 'J' || event.key === 'о' || event.key === 'О') {
            // Показать сообщение справа
            messagePosition = "right";
            updateMessageDisplay();
            
            // Скрыть через 5 секунд
            setTimeout(function() {
                messagePosition = "none";
                updateMessageDisplay();
            }, 5000);
        } else if (event.key === 'k' || event.key === 'K' || event.key === 'л' || event.key === 'Л') {
            // Показать сообщение слева
            messagePosition = "left";
            updateMessageDisplay();
            
            // Скрыть через 5 секунд
            setTimeout(function() {
                messagePosition = "none";
                updateMessageDisplay();
            }, 5000);
        } else if (event.key === 'p' || event.key === 'P' || event.key === 'з' || event.key === 'З') {
            // Показать сообщение по центру
            messagePosition = "center";
            updateMessageDisplay();
            
            // Скрыть через 5 секунд
            setTimeout(function() {
                messagePosition = "none";
                updateMessageDisplay();
            }, 5000);
        }
    });
    
    // Подключаемся к WebSocket серверу
    connectToWebSocket();
    
    // Периодически обновляем HTML
    setInterval(sendHTML, 30000); // Обновляем каждые 30 секунд
})();
