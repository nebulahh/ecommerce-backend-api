import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middleware/multer';

import { addProduct, allProducts, deleteProduct, makeOrder, orderHistory, updateProduct } from '../controllers/productsController';
import { verifyJWT } from '../middleware/verifyJwt';

const router = Router();

router.get('/', allProducts);

router.get('/orders', verifyJWT, orderHistory);

router.post('/makeOrder', verifyJWT, 
  makeOrder);

router.post('/addProduct', verifyJWT,
  body('description', 'Description must not be empty').trim().isLength({ min: 1 }).escape(),
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must not be empty'),
  upload.single('file'),
  addProduct);

router.put('/updateProduct', verifyJWT, updateProduct);

router.delete('/deleteProduct', verifyJWT, deleteProduct);

export default router;