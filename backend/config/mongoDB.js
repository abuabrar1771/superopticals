import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        // This will log exactly which database you are hitting
        console.log(`DB Connected to: ${mongoose.connection.name}`); 
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`);
   
}
export default connectDB;