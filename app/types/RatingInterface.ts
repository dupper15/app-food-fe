export interface RatingInterface {
  _id: string;
  customer_id: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  order_id: string;
  image: string[];
  rating: number;
  replies_array: {
    _id: string;
    content: string;
    createdAt: string;
    images: string[];
  }[];
  content: string;
}
