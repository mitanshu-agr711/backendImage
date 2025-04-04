import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Image } from '../model/image.model.js';
import auth from '../middleware/user.middleware.js';
import express from 'express';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.post('/upImage', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, folderId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const image = new Image({
      name,
      filename: req.file.filename,
      path: req.file.path,
      folder: folderId,
      user: req.user.userId
    });

    await image.save();

    res.status(201).json({ message: 'Image uploaded successfully!', image });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const images = await Image.find({
      name: { $regex: query, $options: 'i' },
      user: req.user.userId
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'No images found with this name' });
    }

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.get('/:folderId', auth, async (req, res) => {
  try {
    const images = await Image.find({
      folder: req.params.folderId,
      user: req.user.userId
    });

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;
