const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    console.log("Received request:", event.body);
    
    const response = await fetch('https://script.google.com/macros/library/d/11sa-ghjtGxUE9vhZLa7JxFatdbJKnUdF5muBGgSoixK79ZDHoGDx5UML/41', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body
    });

    const text = await response.text();
    console.log("Google Script response:", text);
    
    return {
      statusCode: 200,
      body: text,
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
