import express from "express";
import {isAdmin, isAuth} from "../utils";
import Category from "../models/categoryModel";


const categoryRouter = express.Router();

categoryRouter.post(
    '/',
    isAuth,
    isAdmin,
    async (req, res) => {
        let namePhoto = 'default_img.jpg';
        if (req.body.image !== ''){
            namePhoto = req.body.image
        }
        const product = await Category({
            nameCategory: req.body.nameCategory,
        });
        const createCategory = await product.save();
        if (createCategory) {
            res.send({message: 'Категорія створена', product: createCategory});
        } else {
            res.status(500).send({message: 'Помилка створення категорії'});
        }
    }
);
categoryRouter.get("/", isAuth, isAdmin, async (req, res) => {
    const categories = await Category.find({})
    if (categories) {
        res.send(categories);
    } else {
        res.status(200).send({message: 'Немає категорії!'});
    }
});
categoryRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    async (req, res) => {
        const category = await Category.findById(req.params.id);
        if (category) {
            const deletedCategory = await category.remove();
            res.send({message: 'Категорію видалено', category: deletedCategory});
        } else {
            res.status(404).send({message: 'Продукта немає'});
        }
    }
);
export default categoryRouter;