import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import lensRouter from './routes/lensRoute.js';

// App Config

const app = express();
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();


// middleware

app.use(express.json());
app.use(cors({
  origin: '*', // In production, replace '*' with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token'] 
}));

//api endpoints

app.use('/api/user',userRouter);
app.use('/api/product',productRouter)
app.use('/api/lenstype',lensRouter)

app.get('/',(req,res)=>{
res.send("API WORKING")
})

app.listen(port,()=> console.log(`Server started on PORT: ${port}`));

