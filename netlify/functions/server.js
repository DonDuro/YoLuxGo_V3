const { app } = require('../../dist/index.js');

exports.handler = async (event, context) => {
  // Convert Netlify event to Express-compatible request
  const request = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body
  };

  return new Promise((resolve, reject) => {
    const response = {
      statusCode: 200,
      headers: {},
      body: ''
    };

    // Mock Express response object
    const res = {
      status: (code) => {
        response.statusCode = code;
        return res;
      },
      json: (data) => {
        response.headers['Content-Type'] = 'application/json';
        response.body = JSON.stringify(data);
        resolve(response);
      },
      send: (data) => {
        response.body = data;
        resolve(response);
      },
      setHeader: (name, value) => {
        response.headers[name] = value;
      }
    };

    try {
      app(request, res);
    } catch (error) {
      reject(error);
    }
  });
};