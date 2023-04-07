import express from 'express';
import { body } from 'express-validator';


import { updatePasswordController, createUser, deleteProfile, resetPasswordRequestController, getProfile, updateProfile } from '../controllers/userController';
import { verifyJWT } from '../middleware/verifyJwt';

const router = express.Router();

router.post('/signup', 
  body('email').isEmail().normalizeEmail(),
  body('name').not().isEmpty().trim().escape(), 
  body('password').isLength({ min: 6 }),
  createUser);

router.post('/requestPasswordReset', resetPasswordRequestController);

router.post('/resetPassword/:token/:userId', updatePasswordController);

router.get('/profile', verifyJWT, getProfile);

router.post('/reset', resetPasswordRequestController);

router.put('/profile', verifyJWT, updateProfile);

router.delete('/profile', verifyJWT, deleteProfile);

export default router;
