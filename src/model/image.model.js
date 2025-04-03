import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
    
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  
  }
}, { timestamps: true });


imageSchema.index({ name: 'text' });
imageSchema.index({ user: 1, folder: 1 });

export const Image = mongoose.model('Image', imageSchema);
