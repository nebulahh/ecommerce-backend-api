import express from 'express';

const router = express.Router();

import allProducts from './products';
import auth from './auth';
import user from './user';

router.use('/', allProducts);
router.use('/auth', auth);
router.use('/user', user);


export default router;
