import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  path: {
    type: String,
    default: '/'
  }
}, { timestamps: true });


folderSchema.index({ user: 1, parent: 1, name: 1 }, { unique: true });
export const Folder = mongoose.model('Folder', folderSchema);
