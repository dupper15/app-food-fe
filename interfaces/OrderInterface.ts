export interface Order {
  _id: string;
  array_item: string[];
  customer_id: string;
  restaurant_id: string;
  voucher_id: string[];
  total_price: number;
  used_point: number;
  time_receive: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPendingRestaurant {
  _id: string;
  array_item: {
    _id: string;
    dish_id: {
      _id: string;
      name: string;
    };
    quantity: number;
    topping: {
      _id: string;
      name: string;
    }[];
  }[];
  customer_id: {
    _id: string;
    name: string;
    avatar: string;
  };
  total_price: number;
  note: string;
  createdAt: string;
}
