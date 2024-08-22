import express from 'express';
import postRoute from "./routes/post.route.js"
import authRoute from "./routes/auth.route.js"
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

dotenv.config();
const app= express();

app.use(express.json());
// app.use(cookieParser)

app.use("/api/posts" , postRoute);
app.use("/api/auth" , authRoute);


app.listen(8800, ()=>{
    console.log('Server is running...');
})