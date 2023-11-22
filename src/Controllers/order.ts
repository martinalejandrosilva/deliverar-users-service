import { Get, Route, Security, Tags } from "tsoa";
import { IOrder } from "../Models/types";
const OrderService = require("../Services/OrderService");

@Route("api/order")
@Tags("Order")
export default class OrderController {
  /**
   * Get all orders for given user.
   * @param email The user email.
   * @returns The user orders.
   */
  @Get("/:email")
  public async getOrders(email: string): Promise<IOrder[]> {
    try {
      const orders = await OrderService.getOrdersByUser(email);
      return orders;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * Get all orders for given Supplier.
   * @param cuit The supplier CUIT.
   * @returns The supplier order.
   */
  @Get("/supplier/:cuit")
  public async getOrdersSupplierCuit(cuit: string): Promise<IOrder[]> {
    try {
      const orders = await OrderService.getOrdersBySupplier(cuit);
      return orders;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
