import express from 'express';
import cors from 'cors';
import {connectdb} from "./connectdb";
import userRouter from "./routers/userRouter";
import bodyParser from 'body-parser'
import orderRouter from "./routers/orderRouter";
import productRouter from "./routers/productRouter";
import uploadRouter from "./routers/uploadRouter";
import path from "path";
import categoryRouter from "./routers/categoryRouter";

const app = express();
connectdb();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter)
app.use('/api/uploads', uploadRouter);
app.use('/api/category', categoryRouter);
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/index.html'));
});


app.listen(5000, () => {
    console.log('serve at http://localhost:5000')
});
