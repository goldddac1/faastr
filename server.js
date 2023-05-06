const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

// Инициализация Firebase Admin SDK
const serviceAccount = require('./public/Acc.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Сервирование статических файлов из папки public
app.use(express.static('public'));

// Подключение маршрутизатора
const moviesRouter = require('./public/routes/movies');
app.use('/', moviesRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
