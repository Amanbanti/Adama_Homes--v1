import express from "express";
import {
  addMessage
} from "../controlles/message.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/:chatId", verifyToken, addMessage);

export default router;
