import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './server/db.js';
import {router} from './controller/user.controller.js';
import folderRouter from './controller/folder.controller.js';
import imageRouter from './controller/image.controller.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', router);
app.use('/api/folders', folderRouter);
app.use('/api/images', imageRouter);

connectDB();




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
