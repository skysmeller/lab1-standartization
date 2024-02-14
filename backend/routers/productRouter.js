import express from 'express';
import {isAuth, isAdmin} from '../utils.js';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.post(
    '/',
    isAuth,
    isAdmin,
    async (req, res) => {
        let namePhoto = 'default_img.jpg';
        if (req.body.image !== ''){
            namePhoto = req.body.image
        }
        const product = await Product({
            name: req.body.name,
            price: req.body.price,
            image: namePhoto,
            brand: req.body.brand,
            category: req.body.category,
            countInStock: req.body.countInStock,
        });
        const createProduct = await product.save();
        if (createProduct) {
            res.send({message: 'Продукт створений', product: createProduct});
        } else {
            res.status(500).send({message: 'Помилка створення продукту'});
        }
    }
);

productRouter.get("/", async (req, res) => {
    const products = await Product.find({})
    if (products) {
        res.send(products);
    } else {
        res.status(200).send({message: 'Product Not Found!'});
    }
});

productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.send(product);
    } else {
        res.status(200).send({message: 'Product Not Found!'});
    }
})
productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.price = req.body.price;
            if(req.body.image !== ''){
                product.image = req.body.image;
            }
            product.brand = req.body.brand;
            product.category = req.body.category;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            const updatedProduct = await product.save();
            if (updatedProduct) {
                res.send({message: 'Продукт оновлено', product: updatedProduct});
            } else {
                res.status(500).send({message: 'Помилка в оновленні продукту!'});
            }
        } else {
            res.status(404).send({message: 'Продукт не знайдено!'});
        }
    }
);
productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            const deletedProduct = await product.remove();
            res.send({message: 'Продукт видалено', product: deletedProduct});
        } else {
            res.status(404).send({message: 'Product Not Found'});
        }
    }
);
export default productRouter;