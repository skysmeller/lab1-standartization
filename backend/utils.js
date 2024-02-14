import jwt from 'jsonwebtoken';
import config from './config';
import path from "path";

export const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        config.JWT_SECRET
    );
};
export const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        res.status(401).send({ message: 'Token is not supplied' });
    } else {
        const token = bearerToken.slice(7, bearerToken.length);
        jwt.verify(token, config.JWT_SECRET, (err, data) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                req.user = data;
                next();
            }
        });
    }
};
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Token is not valid for admin user' });
    }
};
export const savePhotoOnServer = (distanation, name) => {
    const multer = require('multer');
    const store = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, distanation);
        },
        filename(req, file, cb) {
            cb(null, name + path.extname(file.originalname));
        },
    });
    return multer({storage: store, limits: {fileSize: 4200000}, fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }}).single('file');
}
const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|jfif|bmp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extName){
        return cb(null, true);
    }else{
        cb('Помилка! Повині бути тількі фотографії!');
    }

}