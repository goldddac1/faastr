(function() {
    console.log("🚀 Скрипт для захвата HTML активирован!");
    
    // Создаем уникальный ID для клиента
    const clientId = Date.now();
    
    // URL вашего сервера WebSocket (замените на свой)
    const serverAddress = "ws://localhost:8080";
    
    // Переменная для хранения WebSocket соединения
    let socket = null;
    
    // Функция для подключения к WebSocket серверу
    function connectToWebSocket() {
        try {
            console.log("📡 Попытка соединения с WebSocket...");
            
            // Создаем WebSocket соединение
            socket = new WebSocket(serverAddress);
            
            socket.onopen = function() {
                console.log("✅ WebSocket соединение установлено!");
                updateStatus('🟢 Подключено');
                
                // Получаем HTML страницы
                const htmlContent = document.documentElement.outerHTML;
                
                // Отправляем HTML на сервер
                socket.send(JSON.stringify({
                    type: 'html',
                    content: htmlContent,
                    url: window.location.href
                }));
                
                console.log("📤 HTML отправлен на сервер");
            };
            
            socket.onmessage = function(event) {
                console.log("📩 Сообщение получено:", event.data);
                
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'system') {
                        console.log("Системное сообщение:", data.message);
                        updateStatus('✅ ' + data.message);
                        setTimeout(() => {
                            updateStatus('🟢 Подключено');
                        }, 3000);
                    } else if (data.type === 'admin') {
                        console.log("Сообщение от админа:", data.message);
                        showNotification("Сообщение от админа", data.message);
                        
                        // Добавляем сообщение в чат
                        addChatMessage('Админ', data.message);
                    } else if (data.type === 'chat') {
                        console.log("Сообщение в чате от " + data.clientId + ":", data.message);
                        
                        // Добавляем сообщение в чат
                        addChatMessage('Клиент #' + data.clientId, data.message);
                    }
                } catch (e) {
                    console.log("Текстовое сообщение:", event.data);
                    updateStatus('✉️ ' + event.data);
                }
            };
            
            socket.onerror = function(error) {
                console.error("❌ Ошибка WebSocket:", error);
                updateStatus('🔴 Ошибка соединения');
            };
            
            socket.onclose = function(event) {
                console.log(`🔒 WebSocket закрыт: ${event.code} ${event.reason}`);
                updateStatus('🔴 Отключено');
                
                // Пытаемся переподключиться через 5 секунд
                setTimeout(connectToWebSocket, 5000);
            };
            
            return true;
        } catch (e) {
            console.error("❌ Критическая ошибка:", e);
            updateStatus('🔴 Ошибка: ' + e.message);
            return false;
        }
    }
    
    // Функция для отображения уведомления
    function showNotification(title, message) {
        // Проверяем поддержку уведомлений браузером
        if (!("Notification" in window)) {
            alert(`${title}: ${message}`);
            return;
        }
        
        // Запрашиваем разрешение на показ уведомлений
        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                } else {
                    alert(`${title}: ${message}`);
                }
            });
        } else {
            alert(`${title}: ${message}`);
        }
    }
    
    // Функция для обновления статуса соединения
    function updateStatus(statusText) {
        const statusElement = document.getElementById('ws-status');
        if (statusElement) {
            statusElement.textContent = statusText;
        }
    }
    
    // Функция для добавления сообщения в чат
    function addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <strong>${sender}:</strong> ${message}
            <small class="chat-time">${new Date().toLocaleTimeString()}</small>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Функция для отправки сообщения в чат
    function sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput || !socket || socket.readyState !== WebSocket.OPEN) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Отправляем сообщение на сервер
        socket.send(JSON.stringify({
            type: 'chat',
            content: message
        }));
        
        // Очищаем поле ввода
        chatInput.value = '';
        
        // Добавляем сообщение в чат
        addChatMessage('Вы', message);
    }
    
    // Функция для создания панели управления
    function createControlPanel() {
        // Создаем контейнер для панели
        const panel = document.createElement('div');
        panel.id = 'html-control-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        panel.style.width = '300px';
        panel.style.fontFamily = 'Arial, sans-serif';
        
        // Создаем заголовок
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';
        header.style.borderBottom = '1px solid #444';
        header.style.paddingBottom = '5px';
        
        const title = document.createElement('div');
        title.textContent = '🕵️‍♂️ HTML Монитор';
        title.style.fontWeight = 'bold';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '−';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Создаем содержимое панели
        const content = document.createElement('div');
        content.id = 'panel-content';
        
        // Статус соединения
        const status = document.createElement('div');
        status.id = 'ws-status';
        status.textContent = '⏳ Подключение...';
        status.style.marginBottom = '10px';
        status.style.padding = '5px';
        status.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        status.style.borderRadius = '3px';
        
        // Кнопки управления
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '5px';
        buttonsContainer.style.marginBottom = '10px';
        
        const sendHtmlButton = document.createElement('button');
        sendHtmlButton.textContent = '📤 Отправить HTML';
        sendHtmlButton.style.flex = '1';
        sendHtmlButton.style.padding = '5px';
        sendHtmlButton.style.border = 'none';
        sendHtmlButton.style.borderRadius = '3px';
        sendHtmlButton.style.backgroundColor = '#007bff';
        sendHtmlButton.style.color = 'white';
        sendHtmlButton.style.cursor = 'pointer';
        
        const reconnectButton = document.createElement('button');
        reconnectButton.textContent = '🔄 Переподключиться';
        reconnectButton.style.flex = '1';
        reconnectButton.style.padding = '5px';
        reconnectButton.style.border = 'none';
        reconnectButton.style.borderRadius = '3px';
        reconnectButton.style.backgroundColor = '#28a745';
        reconnectButton.style.color = 'white';
        reconnectButton.style.cursor = 'pointer';
        
        buttonsContainer.appendChild(sendHtmlButton);
        buttonsContainer.appendChild(reconnectButton);
        
        // Чат
        const chatContainer = document.createElement('div');
        chatContainer.style.marginTop = '10px';
        
        const chatHeader = document.createElement('div');
        chatHeader.textContent = '💬 Чат';
        chatHeader.style.fontWeight = 'bold';
        chatHeader.style.marginBottom = '5px';
        
        const chatMessages = document.createElement('div');
        chatMessages.id = 'chat-messages';
        chatMessages.style.height = '150px';
        chatMessages.style.overflowY = 'auto';
        chatMessages.style.marginBottom = '5px';
        chatMessages.style.padding = '5px';
        chatMessages.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        chatMessages.style.borderRadius = '3px';
        
        const chatInputContainer = document.createElement('div');
        chatInputContainer.style.display = 'flex';
        chatInputContainer.style.gap = '5px';
        
        const chatInput = document.createElement('input');
        chatInput.id = 'chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Введите сообщение...';
        chatInput.style.flex = '1';
        chatInput.style.padding = '5px';
        chatInput.style.border = 'none';
        chatInput.style.borderRadius = '3px';
        
        const sendChatButton = document.createElement('button');
        sendChatButton.textContent = '▶️';
        sendChatButton.style.padding = '5px 10px';
        sendChatButton.style.border = 'none';
        sendChatButton.style.borderRadius = '3px';
        sendChatButton.style.backgroundColor = '#007bff';
        sendChatButton.style.color = 'white';
        sendChatButton.style.cursor = 'pointer';
        
        chatInputContainer.appendChild(chatInput);
        chatInputContainer.appendChild(sendChatButton);
        
        chatContainer.appendChild(chatHeader);
        chatContainer.appendChild(chatMessages);
        chatContainer.appendChild(chatInputContainer);
        
        // Добавляем элементы в содержимое
        content.appendChild(status);
        content.appendChild(buttonsContainer);
        content.appendChild(chatContainer);
        
        // Добавляем заголовок и содержимое в панель
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Добавляем панель в документ
        document.body.appendChild(panel);
        
        // Обработчики событий
        closeButton.onclick = function() {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                closeButton.textContent = '−';
            } else {
                content.style.display = 'none';
                closeButton.textContent = '+';
            }
        };
        
        sendHtmlButton.onclick = function() {
            if (socket && socket.readyState === WebSocket.OPEN) {
                // Получаем HTML страницы
                const htmlContent = document.documentElement.outerHTML;
                
                // Отправляем HTML на сервер
                socket.send(JSON.stringify({
                    type: 'html',
                    content: htmlContent,
                    url: window.location.href
                }));
                
                console.log("📤 HTML отправлен на сервер");
                updateStatus('📤 Отправка HTML...');
            } else {
                updateStatus('🔴 Не подключено');
                connectToWebSocket();
            }
        };
        
        reconnectButton.onclick = function() {
            if (socket) {
                socket.close();
            }
            updateStatus('🔄 Переподключение...');
            connectToWebSocket();
        };
        
        sendChatButton.onclick = sendChatMessage;
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
        
        // Стили для сообщений в чате
        const style = document.createElement('style');
        style.textContent = `
            #chat-messages .chat-message {
                margin-bottom: 5px;
                padding: 5px;
                border-radius: 3px;
                background-color: rgba(255, 255, 255, 0.1);
                word-break: break-word;
            }
            #chat-messages .chat-time {
                float: right;
                font-size: 0.8em;
                color: #aaa;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Создаем панель управления
    createControlPanel();
    
    // Подключаемся к WebSocket серверу
    connectToWebSocket();
    
    // Периодически обновляем HTML
    setInterval(function() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            // Получаем HTML страницы
            const htmlContent = document.documentElement.outerHTML;
            
            // Отправляем HTML на сервер
            socket.send(JSON.stringify({
                type: 'html',
                content: htmlContent,
                url: window.location.href
            }));
            
            console.log("📤 HTML автоматически обновлен");
        }
    }, 30000); // Обновляем каждые 30 секунд
    
    console.log("✨ Инициализация скрипта завершена");
})();
