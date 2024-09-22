export interface OrderInterface {
  orderId: string;
  userId: string;
  orderDate: string;
  shippingAddress: string;
  totalPrice: number;
  paymentStatus: string;
  items: OrderItemInterface[];
}

export interface OrderItemInterface {
  title: string;
  author: any;
  coverImage: string;
  quantity: number;
  price: number;
}
