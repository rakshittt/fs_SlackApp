const { App } = require('@slack/bolt');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const upload = multer({ dest: "./uploads" });

require('dotenv').config();
// Slack App Initialization
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app is running!');
})();


// // File Upload API (Works with Slack Upload Button)
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const { user_id } = req.body;
//     const file = req.file;
//     const filePath = path.join("./uploads", file.filename);

//     // Save metadata to PostgreSQL
//     const result = await db.query(
//       `INSERT INTO files (file_name, file_path, uploaded_by) VALUES ($1, $2, $3) RETURNING *`,
//       [file.originalname, filePath, user_id]
//     );

//     res.json({ success: true, message: "✅ File uploaded securely!", file_id: result.rows[0].id });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ success: false, message: "Upload failed" });
//   }
// });

// // Slack Command: Upload File
// slackApp.command('/secure-share', async ({ command, ack, respond }) => {
//   await ack();
//   await respond({
//     text: "📂 Upload a file securely:",
//     attachments: [
//       { text: "Click below to upload.", actions: [{ type: "button", text: "Upload", url: `http://localhost:3000/upload` }] }
//     ]
//   });
// });

// // Slack Command: List Secure Files
// slackApp.command('/secure-files', async ({ command, ack, respond }) => {
//   await ack();
//   const result = await db.query(`SELECT * FROM files WHERE expiry_date > NOW()`);
//   if (result.rows.length === 0) {
//     return respond("No active shared files.");
//   }

//   const filesList = result.rows.map(f => `📁 *${f.file_name}* - <http://localhost:3000/download/${f.id}|Download>`).join("\n");
//   await respond({ text: `🔒 Secure Files:\n${filesList}` });
// });

// // API for File Download
// app.get('/download/:fileId', async (req, res) => {
//   const fileId = req.params.fileId;
//   const result = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId]);
//   if (result.rows.length === 0) {
//     return res.status(404).send("File not found.");
//   }
//   res.download(result.rows[0].file_path, result.rows[0].file_name);
// });

// // Slack Command: Revoke File Access
// slackApp.command('/secure-admin revoke', async ({ command, ack, respond }) => {
//   await ack();
//   const fileId = command.text;

//   const result = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId]);
//   if (result.rows.length === 0) {
//     return respond("❌ File not found.");
//   }

//   fs.unlinkSync(result.rows[0].file_path); // Delete file locally
//   await db.query(`DELETE FROM files WHERE id = $1`, [fileId]);

//   await respond(`🚨 File *${result.rows[0].file_name}* access revoked!`);
// });

// // Start Express & Slack App
// (async () => {
//   await slackApp.start(3000);
//   console.log('✅ Secure Slack File Sharing App Running on Port 3000');
// })();