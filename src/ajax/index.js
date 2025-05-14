/**
 * Модуль для выполнения AJAX-запросов.
 * 
 * @module ajax
 */

/**
 * Выполняет GET-запрос.
 * @param {string} url - URL для запроса
 * @param {Function} successCallback - Функция обратного вызова при успехе
 * @param {Function=} errorCallback - Функция обратного вызова при ошибке (опционально)
 */
export const get = (url, successCallback, errorCallback) => {
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        successCallback && successCallback(xhr.responseText);
      } else {
        errorCallback && errorCallback(xhr.status, xhr.statusText);
      }
    }
  };
  
  xhr.open('GET', url, true);
  xhr.send();
};

/**
 * Выполняет POST-запрос.
 * @param {string} url - URL для запроса
 * @param {Object|string} data - Данные для отправки
 * @param {Function} successCallback - Функция обратного вызова при успехе
 * @param {Function=} errorCallback - Функция обратного вызова при ошибке (опционально)
 * @param {string=} contentType - Тип контента (опционально)
 */
export const post = (url, data, successCallback, errorCallback, contentType = 'application/json') => {
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        successCallback && successCallback(xhr.responseText);
      } else {
        errorCallback && errorCallback(xhr.status, xhr.statusText);
      }
    }
  };
  
  xhr.open('POST', url, true);
  
  if (contentType) {
    xhr.setRequestHeader('Content-Type', contentType);
  }
  
  // Преобразуем объект в JSON-строку, если это объект
  const dataToSend = typeof data === 'object' ? JSON.stringify(data) : data;
  
  xhr.send(dataToSend);
};

/**
 * Загружает JSON с указанного URL.
 * @param {string} url - URL для запроса
 * @param {Function} successCallback - Функция обратного вызова при успехе
 * @param {Function=} errorCallback - Функция обратного вызова при ошибке (опционально)
 */
export const getJSON = (url, successCallback, errorCallback) => {
  get(
    url,
    (responseText) => {
      try {
        const json = JSON.parse(responseText);
        successCallback && successCallback(json);
      } catch (e) {
        errorCallback && errorCallback('parse_error', 'Ошибка разбора JSON');
      }
    },
    errorCallback
  );
}; 