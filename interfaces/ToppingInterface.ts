export interface Topping {
  _id: string;
  name: string;
  price: number;
}
export interface ToppingCreate {
  restaurant_id: string;
  name: string;
  price: number;
}
