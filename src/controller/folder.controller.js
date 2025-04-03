// import express from 'express';x
import { Folder } from '../model/folder.model.js';
import  auth from '../middleware/user.middleware.js';
import mongoose from 'mongoose';
import { Router } from 'express';
const router = Router();

router.post('/createFolder', auth, async (req, res) => {
  try {
  

    const { name, parent } = req.body;
    const parentId = parent && mongoose.Types.ObjectId.isValid(parent) ? new mongoose.Types.ObjectId(parent) : null;
    const folder = new Folder({
      name,
      user: req.user.userId,
      parent: parentId
    });
    
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' ,error: error.message});
  }
});


router.get('/userFolder', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.userId });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    });
    
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    const subfolders = await Folder.find({ 
      parent: req.params.id, 
      user: req.user.userId 
    });
    
    res.json({ folder, subfolders });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
