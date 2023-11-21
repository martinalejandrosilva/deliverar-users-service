import mongoose, { Schema } from "mongoose";
import { IOrder } from "./types";

const orderSchema = new Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    marketplace: { type: String, required: true },
    purchaseId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userDni: { type: String, required: true },
    deliveryStatus: { type: String, required: false },
    orderDate: { type: Date, default: Date.now },
    deliveryDate : { type: Date, required: false },
    });

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
