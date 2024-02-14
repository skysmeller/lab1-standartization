import express from 'express';
import multer from 'multer';
import {isAuth, isAdmin, savePhotoOnServer} from '../utils';
import Product from "../models/productModel";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './backend/uploads');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });
const uploadRouter = express.Router();

uploadRouter.post("/product/:id", isAuth, isAdmin,  (req, res) => {
    const upload = savePhotoOnServer('./frontend/pictures', req.params.id + '_product');
    upload(req, res, async (err) => {
        if(err){
            res.send({error: "Не вдалося зберігти фото"});
        }else{
            const product = await Product.findById(req.params.id);
            if(product){
                let ext = product.image.split('.')
                product.image = req.params.id + '_product.'+ext[1];
                await product.save();
            }
            res.send({photo: req.params.id + '_product'});
        }
    });
});
export default uploadRouter;