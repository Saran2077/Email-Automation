import express from "express";
import AuthHandler from "./handler.js";

const router = express.Router();
const handler = new AuthHandler();

router.post('/login', handler.login);
router.post('/register', handler.register);

export default router;