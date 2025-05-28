const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

app.post('/info', (req, res) => {
  const videoURL = req.body.url;
  if (!videoURL) return res.status(400).send('No URL');

  exec(`./yt-dlp --dump-json "${videoURL}"`, (err, stdout) => {
    if (err) return res.status(500).send("Error fetching info");
    try {
      const info = JSON.parse(stdout);
      res.json({ title: info.title, thumbnail: info.thumbnail });
    } catch (e) {
      res.status(500).send("Parse error");
    }
  });
});

app.post('/download', (req, res) => {
  const videoURL = req.body.url;
  const format = req.body.format;
  let output = '';
  let command = '';

  if (!videoURL) return res.status(400).send('No URL provided');

  if (format === 'mp3') {
    output = 'audio.mp3';
    command = `./yt-dlp -x --audio-format mp3 -o "${output}" "${videoURL}"`;
  } else {
    output = 'video.mp4';
    command = `./yt-dlp -f "bestvideo[height<=${format}]+bestaudio" -o "${output}" "${videoURL}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Download failed');
    }
    res.download(path.join(__dirname, output), () => fs.unlinkSync(output));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on http://localhost:" + PORT));