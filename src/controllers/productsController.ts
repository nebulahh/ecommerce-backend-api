import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

// import { AllProducts } from '../middleware/allProducts';
import cloudinary from '../middleware/cloudinary';
import ProductModel from '../models/productModel';

export async function allProducts(req: Request, res: Response) {
  try {
    const product = await ProductModel.find().lean();
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    
  }
}


export async function orderHistory(req: Request, res: Response) {
  res.json('your order history');
}

export async function makeOrder(req: Request, res: Response) {

  let { customerEmail } = req.body;
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Mailgen',
      link: 'https://mailgen.js/',
    },
  });

  const feedback = {
    body :{
      name: 'Brahms',
      intro: 'Your bill is here',
      table: {
        data: [
          {
            item: 'Designer clothes',
            description: 'For programmers',
            price: '$10',
          },
          {
            item: 'Designer shoes',
            description: 'For programmers',
            price: '$15',
          },
        ],
      },
      outro: 'Looking forward to better days',
    },
  };

  const mail = mailGenerator.generate(feedback);

  const message = {
    from: process.env.GOOGLE_EMAIL,
    to: customerEmail,
    subject: 'Order Bill',
    html: mail,
  };

  const emailStatus = await transporter.sendMail(message);

  if (emailStatus) {
    res.status(201).json('your order email has been sent');

  }

}

export async function addProduct(req: Request, res: Response) {
  try {
    const { title, description, price } = req.body;
    let result = null;
    if (!req.file?.path || req.file?.path === undefined) {
      result = '';
    }
    result = await cloudinary.uploader.upload(req.file?.path);

    if ( !title || !description || !price) {
      res.status(400).json('A required field is missing');
      throw new Error('A field is missing');
    }
  
    const product = await ProductModel.create({
      image: result.secure_url, 
      cloudinaryId: result.public_id,
      title,
      description,
      price,
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    
  }
}

export function updateProduct(req: Request, res: Response) {
  res.json('update product');
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    let product = await ProductModel.findById({ _id: req.params.id }); 
    await cloudinary.uploader.destroy(product?.cloudinaryId); 

    // await ProductModel.remove({ _id: req.params.id }); 
    console.log('Deleted Post');
    res.status(204).json({
      message: 'Product deleted',
    });
  } catch (err) {
    console.error(err);
  }
}