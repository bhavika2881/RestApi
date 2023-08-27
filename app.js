const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types'); 

const app = express();
const port = 5500;


app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });
const cors = require('cors');
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileInfo = {
    originalName: req.file.originalname,
    size: req.file.size,
    destination: req.file.destination,
    filename: req.file.filename,
    path: req.file.path,
  };

 
  const detectedType = mime.lookup(fileInfo.filename);
  fileInfo.fileType = detectedType || 'unknown';

  res.json(fileInfo);
});

app.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, 'uploads'));
    const fileInfos = await Promise.all(files.map(async (filename) => {
      const filePath = path.join(__dirname, 'uploads', filename);
      const fileStat = await fs.stat(filePath);
      const detectedType = mime.lookup(filename); 
      return {
        filename: filename,
        size: fileStat.size,
        path: filePath,
        fileType: detectedType || 'unknown' 
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
    const detectedType = mime.lookup(filename); 
    res.json({
      filename: filename,
      size: fileStat.size,
      path: filePath,
      fileType: detectedType || 'unknown' 
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