export interface HistoryData {
  _id: string;
  order_id: string;
  customer_id: string;
  cost: number;
  sum_dishes: number;
}

export interface HistoryDetailData {
  _id: string;
  order_id: {
    array_item: {
      _id: string;
      dish_id: {
        _id: string;
        name: string;
        price: number;
      };
      quantity: number;
      topping: {
        _id: string;
        name: string;
        price: number;
      }[];
    }[];
    used_point: number;
    voucher_id: {
      _id: string;
      value: number;
    };
    note: string;
    status: string;
  };
  customer_id: {
    _id: string;
    name: string;
    avatar: string;
  };
  reason: string;
  cost: number;
  sum_dishes: number;
  createdAt: string;
}
