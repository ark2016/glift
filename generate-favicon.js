const favicon = require('favicon');
const fs = require('fs');
const path = require('path');

// Директория для сохранения favicon
const publicDir = path.join(__dirname, 'public');

// Создаем директорию, если она не существует
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Создаем простую иконку с буквой "G" (для Glift)
favicon({
  text: 'G',           // буква G для Glift
  size: 16,            // размер 16x16 pixels
  fontsize: 14,        // размер шрифта
  bgcolor: '#DCB35C',  // цвет фона (деревянный цвет доски Го)
  color: '#000000',    // цвет текста (черный)
}, (err, bytes) => {
  if (err) {
    console.error('Ошибка при создании favicon:', err);
    return;
  }
  
  // Путь для сохранения иконки
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  // Записываем файл
  fs.writeFileSync(faviconPath, bytes);
  console.log(`Favicon успешно создан: ${faviconPath}`);
}); 