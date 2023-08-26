const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 5500;

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original name of the file
  },
});

const upload = multer({ storage });
const cors = require('cors');
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileInfo = {
    originalName: req.file.originalname,
    size: req.file.size,
    destination: req.file.destination,
    filename: req.file.filename,
    path: req.file.path
  };

  res.json(fileInfo);
});

app.get('/files', async (req, res) => {
  try {
    console.log("Request received for /files"); 
    const files = await fs.readdir(path.join(__dirname, 'uploads'));
    const fileInfos = await Promise.all(files.map(async (filename) => {
      const filePath = path.join(__dirname, 'uploads', filename);
      const fileStat = await fs.stat(filePath);
      return {
        filename: filename,
        size: fileStat.size,
        path: filePath
      };
    }));
    res.json(fileInfos);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch files.' });
  }
});

app.get('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  try {
    const fileStat = await fs.stat(filePath);
    res.json({
      filename: filename,
      size: fileStat.size,
      path: filePath
    });
  } catch (error) {
    res.status(404).json({ error: 'File not found.' });
  }
});

app.delete('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  try {
    await fs.unlink(filePath);
    res.json({ message: 'File deleted successfully.' });
  } catch (error) {
    res.status(404).json({ error: 'File not found.' });
  }
});

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});