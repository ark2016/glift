goog.provide('glift.ajax');

/**
 * Ajax/XHR and fetch utilities.
 * @namespace
 */
glift.ajax = {
  /**
   * Performs an HTTP GET request to the specified URL using fetch API.
   * 
   * @param {string} url URL to request
   * @param {function(string)} successCallback Callback for successful request
   * @param {function(number, string)=} opt_failureCallback Optional failure callback
   */
  get(url, successCallback, opt_failureCallback) {
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
  },

  /**
   * Promise-based version of the GET request.
   * 
   * @param {string} url URL to request
   * @return {!Promise<string>} Promise that resolves with the response text
   */
  getPromise(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      });
  },

  /**
   * Performs an HTTP POST request to the specified URL.
   * 
   * @param {string} url URL to request
   * @param {Object} data JSON data to send
   * @return {!Promise<string>} Promise that resolves with the response text
   */
  post(url, data) {
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
};
