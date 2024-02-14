import mongoose from "mongoose";
import config from "./config.js";

export const connectdb = (uri, callback) => {
    mongoose
        .connect(config.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to mongodb.');
        })
        .catch((error) => {
            console.log(error.reason);
        });
}