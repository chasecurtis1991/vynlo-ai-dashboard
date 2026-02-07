#!/usr/bin/env node

/**
 * Telegram Notification Script
 * Sends feature update notifications to Chase
 */

const https = require('https');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.telegram_bot_token;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.telegram_chat_id;

function sendNotification(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('📝 Notification (not sent - missing env vars):');
    console.log(message);
    return;
  }

  const data = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
  });

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const req = https.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Telegram notification sent');
      } else {
        console.error('❌ Telegram error:', body);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Telegram request failed:', err.message);
  });

  req.write(data);
  req.end();
}

// CLI mode
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node notify-telegram.js "Your message here"');
    console.log('Or set TELEGRAM_MESSAGE env var');
    process.exit(1);
  }

  const message = args.join(' ');
  sendNotification(message);
}

module.exports = { sendNotification };
