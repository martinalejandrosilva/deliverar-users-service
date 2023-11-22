import { IEvent, INewPurchase, IOrder } from "../../../Models/types";
const OrderService = require("../../OrderService");

export const marketplaceHandler = (data: string) => {
  try {
    const event = JSON.parse(data);
    const eventContent: IEvent<unknown> = JSON.parse(event.content);

    switch (eventContent.event_name) {
      case "new_purchase":
        console.log("New Purchase", eventContent.data);
        marketplaceHandleNewUserCreate(eventContent.data as INewPurchase);
        break;
      default:
        console.log("default");
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

const marketplaceHandleNewUserCreate = (purchase: INewPurchase) => {
  try {
    const order = mapPurchaseToOrder(purchase);
    OrderService.CreateOrder(order);
  } catch (error) {
    console.log(error);
  }
};

const mapPurchaseToOrder = (purchase: INewPurchase) => {
  const order: IOrder = {
    productName: purchase.product_name,
    productPrice: purchase.product_price,
    productQuantity: purchase.product_amount,
    marketplace: purchase.product_marketplace,
    cuit: formatCUIT(purchase.product_marketplace_cuit),
    purchaseId: purchase.purchase_id,
    userEmail: purchase.user_info.email,
    userDni: purchase.user_info.document,
  };
  return order;
};

function formatCUIT(cuit: string): string {
  if (cuit.length !== 11) {
    throw new Error("Invalid CUIT length");
  }

  if (cuit.includes("-")) {
    return cuit;
  } else {
    return cuit.replace(/(?<=...)(?=...)/g, "-");
  }
}
