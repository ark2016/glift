/**
 * Ajax/XHR и fetch утилиты.
 * @module ajax/ajax
 */

/**
 * Выполняет HTTP GET запрос по указанному URL используя fetch API.
 * 
 * @param {string} url URL для запроса
 * @param {function(string)} successCallback Функция обратного вызова при успешном запросе
 * @param {function(number, string)=} opt_failureCallback Опциональная функция обратного вызова при ошибке
 */
export function get(url, successCallback, opt_failureCallback) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      successCallback(data);
    })
    .catch(error => {
      if (opt_failureCallback) {
        const status = error.response?.status || 0;
        const text = error.message || `Error fetching ${url}`;
        opt_failureCallback(status, text);
      } else {
        console.error(`Error retrieving ${url}: ${error.message}`);
      }
    });
}

/**
 * Promise-версия GET запроса.
 * 
 * @param {string} url URL для запроса
 * @return {!Promise<string>} Promise, который резолвится с текстом ответа
 */
export function getPromise(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    });
}

/**
 * Выполняет HTTP POST запрос по указанному URL.
 * 
 * @param {string} url URL для запроса
 * @param {Object} data JSON-данные для отправки
 * @return {!Promise<string>} Promise, который резолвится с текстом ответа
 */
export function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  });
}
