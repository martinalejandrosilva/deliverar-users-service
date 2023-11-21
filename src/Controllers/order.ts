import { Get, Route, Security, Tags } from "tsoa";
import { IOrder } from "../Models/types";
const OrderService = require("../Services/OrderService");

@Route("api/order")
@Tags("Order")
export default class OrderController {
  /**
   * Get all orders for a user.
   * @param email The user email.
   * @returns The user orders.
   */
  @Get("/:email")
  @Security("BearerAuth")
  public async getOrders(email: string): Promise<IOrder[]> {
    try {
      const orders = await OrderService.getOrdersByUser(email);
      return orders;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
