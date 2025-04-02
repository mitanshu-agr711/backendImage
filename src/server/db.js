import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB=async()=>{
    try {
      const connectionInstant=  await mongoose.connect(`${process.env.MONGODB_URL}`)
       console.log(`MONGO_DB successfully connected `);
    } catch (error) {
        console.log("Mongo db connection FAILED",error);
        throw Error(error.message);
    }
}

export default connectDB;