export interface Order {
  userId: string;
  totalPrice: number;
  orderDate: string;
  orderId: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  name?: string; // Optional fields
  phone?: string;
  email?: string;
  items: OrderItem[];
}

interface OrderItem {
  coverImage: string;
  quantity: number;
  title: string;
}
