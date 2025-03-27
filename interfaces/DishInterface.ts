export interface CreatDishData {
  name: string;
  introduce: string;
  time: number;
  price: number;
  image: File;
  topping: string[];
  restaurant_id: string;
  category_id: string;
}

export interface DishData {
  _id: string;
  name: string;
  image: string;
  introduce: string;
  restaurant_id: string;
  price: string;
  time: string;
  topping: string[];
  category_id: string;
  bestSeller: boolean;
}
