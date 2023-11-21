import { IOrder, deliveryStatus } from "../Models/types";
import Order from "../Models/orders.model";

type OrderUpdate = {
  productName?: string;
  productPrice?: number;
  productQuantity?: number;
  marketplace?: string;
  purchaseId: string;
  userEmail?: string;
  userDni?: string;
  deliveryStatus?: deliveryStatus;
  orderDate?: Date;
  deliveryDate?: Date;
};

exports.CreateOrder = async (order: IOrder) => {
  try {
    const newOrder = await Order.create(order);
    return { code: 200, payload: newOrder };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateOrder = async ({
  productName,
  productPrice,
  productQuantity,
  marketplace,
  purchaseId,
  userEmail,
  userDni,
  deliveryStatus,
  deliveryDate,
  orderDate,
}: OrderUpdate) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
        { purchaseId },
        {
            $set: {
            ...(productName && { productName }),
            ...(productPrice && { productPrice }),
            ...(productQuantity && { productQuantity }),
            ...(marketplace && { marketplace }),
            ...(userEmail && { userEmail }),
            ...(userDni && { userDni }),
            ...(deliveryStatus && { deliveryStatus }),
            ...(deliveryDate && { deliveryDate }),
            ...(orderDate && { orderDate }),
            },
        },
        { new: true }
        ).lean();
    
        if (!updatedOrder) {
        return { code: 404, message: "Order not found" };
        }
    
        return { code: 200, payload: updatedOrder };
    } catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
};

exports.getOrdersByUser = async (userEmail: string) => {
    try{
        const order = await Order.find({ userEmail }).lean();
        return { code: 200, payload: order };
    } catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
};


