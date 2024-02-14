import express from 'express';
import {isAdmin, isAuth} from '../utils.js';
import Order from '../models/orderModels.js';
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const orderRouter = express.Router();

orderRouter.get(
    '/summary',
    isAuth,
    isAdmin,
    async (req, res) => {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);
        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: { $sum: 1 },
                },
            },
        ]);
        const dailyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' },
                },
            },
        ]);
        const productCategories = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.send({ users, orders, dailyOrders, productCategories });
    }
);

orderRouter.get(
    '/',
    isAuth,
    isAdmin,
    async (req, res) => {
        const orders = await Order.find({}).populate('user');
        res.send(orders);
    }
);

orderRouter.get(
    '/mine',
    isAuth,
    async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    }
);

orderRouter.get(
    '/:id',
    isAuth,
    async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    }
);

orderRouter.post(
    '/',
    isAuth,
    async (req, res) => {
        const order = new Order({
            orderItems: req.body.orderItems,
            user: req.user._id,
            shipping: req.body.shipping,
            payment: req.body.payment,
            itemsPrice: req.body.itemsPrice,
            taxtPrice: req.body.taxtPrice,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    }
);

orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            const deletedOrder = await order.remove();
            res.send({ message: 'Order Deleted', product: deletedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    }
);


orderRouter.put(
    '/:id/pay',
    isAuth,
    async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            const updatedOrder = await order.save();
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found.' });
        }
    }
);

orderRouter.put(
    '/:id/deliver',
    isAuth,
    async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.send({ message: 'Order Delivered', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found.' });
        }
    }
);

export default orderRouter;