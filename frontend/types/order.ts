export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "upi" | "card";

export interface ShippingAddress {
  full_name: string;
  phone:     string;
  address:   string;
  city:      string;
  state:     string;
  pincode:   string;
}

export interface OrderItem {
  id:          number;
  product_id:  number | null;
  title:       string;
  image_url:   string | null;
  brand:       string | null;
  unit_price:  number;
  quantity:    number;
  total_price: number;
}

export interface Order {
  id:               number;
  order_number:     string;
  status:           OrderStatus;
  subtotal:         number;
  total_discount:   number;
  delivery_charge:  number;
  grand_total:      number;
  shipping_address: string;   // JSON string — parse with parseShippingAddress()
  payment_method:   string;
  items:            OrderItem[];
  created_at:       string;
  updated_at:       string | null;
}

export interface OrderListResponse {
  orders: Order[];
  total:  number;
}

export interface PlaceOrderPayload {
  shipping_address: ShippingAddress;
  payment_method:   PaymentMethod;
}