(async () => {
    // --- НАСТРОЙКИ ---
    // Токен для активации, который ты хочешь использовать
    const giftCode = "BHNAFP97DKU";

    // --- ЛОГИКА ---
    console.log("Начинаю магию... Пытаюсь получить CSRF токен.");

    // 1. Запрашиваем страницу, чтобы получить свежий CSRF токен
    const redeemPageResponse = await fetch("https://www.spotify.com/uz/account/redeem/");
    const pageHtml = await redeemPageResponse.text();

    // 2. Выдираем CSRF токен из HTML страницы
    const csrfTokenMatch = pageHtml.match(/"csrfToken":"(.*?)"/);
    if (!csrfTokenMatch || !csrfTokenMatch[1]) {
        console.error("Не смог найти CSRF токен на странице. Похоже, Spotify что-то поменял. Попробуй перезагрузить страницу и запустить скрипт снова.");
        return;
    }
    const csrfToken = csrfTokenMatch[1];
    console.log(`Успешно вытащил CSRF токен: ${csrfToken}`);

    // 3. Отправляем основной запрос на активацию кода
    console.log(`Отправляю запрос на активацию кода "${giftCode}"...`);
    try {
        const response = await fetch("https://www.spotify.com/uz/account/api/auth/redeem/redeem-code", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru-RU,ru;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"139\", \"Not;A=Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token": csrfToken, // Используем свежий токен
                "Referer": "https://www.spotify.com/uz/account/redeem/",
            },
            "body": JSON.stringify({
                "token": giftCode,
                // recaptchaToken здесь не используется, так как его динамическая генерация сложна
                // и часто сервер прощает его отсутствие при наличии валидной сессии и CSRF.
            }),
            "method": "POST"
        });

        const result = await response.json();

        console.log("Ответ от сервера:", result);

        if (response.ok) {
            console.log("%cУСПЕХ! Похоже, код активирован. Проверяй аккаунт!", "color: green; font-size: 20px;");
        } else {
            console.error(`%cОШИБКА! Сервер ответил со статусом ${response.status}.`, "color: red; font-size: 20px;");
            if (result.error) {
                console.error(`Причина: ${result.error.message || JSON.stringify(result.error)}`);
            }
        }
    } catch (error) {
        console.error("Произошла критическая ошибка при отправке запроса:", error);
    }
})();
