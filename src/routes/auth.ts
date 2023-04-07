import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { loginUser, logout, refresh } from '../controllers/authController';

const router = express.Router();

router.post('/login', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  loginUser);

router.get('/refresh', refresh);

router.post('/logout', logout);

export default router;
