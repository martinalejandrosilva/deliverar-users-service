import {
  IDelivery,
  IDeliveryUpdate,
  IEvent,
  OrderUpdate,
} from "../../../Models/types";
const OrderService = require("../../OrderService");

export const robotsHandler = (data: string) => {
  try {
    const event = JSON.parse(data);
    const eventContent: IEvent<unknown> = JSON.parse(event.content);

    switch (eventContent.event_name) {
      case "delivery_update":
        const order = mapIDeliveryToUpdateOrder(eventContent.data as IDelivery);
        console.log("Order on Delivery Update", order);
        robotsHandleEvent(order);
        break;
      case "delivery_successful":
        const orderToUpdate = mapIDeliveryUpdateToUpdateOrder(
          eventContent.data as IDeliveryUpdate
        );
        console.log("Order on Delivery Success", orderToUpdate);
        robotsHandleEvent(orderToUpdate);
        break;
      default:
        console.log("default");
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

const robotsHandleEvent = (orderToUpdate: OrderUpdate) => {
  try {
    OrderService.UpdateOrder(orderToUpdate);
  } catch (error) {
    console.log(error);
  }
};

const mapIDeliveryToUpdateOrder = (delivery: IDelivery): OrderUpdate => {
  const order: OrderUpdate = {
    purchaseId: delivery.purchase_id,
    deliveryStatus: delivery.status,
  };
  return order;
};

const mapIDeliveryUpdateToUpdateOrder = (
  delivery: IDeliveryUpdate
): OrderUpdate => {
  const order: OrderUpdate = {
    purchaseId: delivery.purchase_id,
    deliveryStatus: delivery.status,
    deliveryDate: delivery.deliveryDate,
    orderDate: delivery.requestDate,
  };
  return order;
};
