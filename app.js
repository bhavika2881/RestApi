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

 
  const fileDetectedType = mime.lookup(fileInfo.filename);
  fileInfo.fileType = fileDetectedType || 'unknown';

  res.json(fileInfo);
});

app.get('/files', async (req, res) => {
  try {
    const filesList = await fs.readdir(path.join(__dirname, 'uploads'));
    const fileInfomation = await Promise.all(filesList.map(async (filename) => {
      const filePath = path.join(__dirname, 'uploads', filename);
      const fileSizeStat = await fs.stat(filePath);
      const fileDetectedType = mime.lookup(filename); 
      return {
        filename: filename,
        size: fileSizeStat.size,
        path: filePath,
        fileType: fileDetectedType || 'unknown' 
      };
    }));
    res.json(fileInfomation);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch files.' });
  }
});


app.get('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const getFilePath = path.join(__dirname, 'uploads', filename);

  try {
    const fileSize = await fs.stat(getFilePath);
    const fileDetectedType = mime.lookup(filename); 
    res.json({
      filename: filename,
      size: fileSize.size,
      path: getFilePath,
      fileType: fileDetectedType || 'unknown' 
    });
  } catch (error) {
    res.status(404).json({ error: 'File not found.' });
  }
});


app.delete('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const fileToDeletedPath = path.join(__dirname, 'uploads', filename);

  try {
    await fs.unlink(fileToDeletedPath);
    res.json({ message: 'File deleted successfully.' });
  } catch (error) {
    res.status(404).json({ error: 'File not found.' });
  }
});

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});