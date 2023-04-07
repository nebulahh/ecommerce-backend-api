import mongoose from 'mongoose';
import { UserDocument } from './userModel';

export interface ProductInput {
  user: UserDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }, 
  quantity: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
},
);

const OrderModel = mongoose.model<ProductDocument>('Order', OrderSchema);

export default OrderModel;