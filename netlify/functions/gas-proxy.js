// Simple bridge to Google Sheets
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwX62NThWcjbr8cX2pAMcrBUe7ICuPGw6QAojeRIlV7MTHAKpHvkw4XqB-JV65Lelhc/exec"; // <-- Paste your Google Script URL here
  
  const response = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: event.body
  });
  
  return {
    statusCode: 200,
    body: await response.text()
  };
};