import express from 'express';
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(express.json());
// Correctly invoke cookieParser middleware
app.use(cookieParser());

// CORS configuration, ensuring your frontend can communicate with your backend
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Define your routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Start the server
app.listen(8800, () => {
    console.log('Server is running...');
});
