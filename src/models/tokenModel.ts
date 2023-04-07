const mongoose = require('mongoose');
const Schema = mongoose.Schema;


export interface TokenType {
  userId: unknown;
  token: string;
  createdAt: string;
}

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});
const tokenModel = mongoose.model('Token', tokenSchema);

export default tokenModel;