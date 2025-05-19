export type CreateRestaurantData = {
  name: string;
  description: string;
  address: string;
  banner: File[];
  avatar: File;
  ownerId: string;
};
export type RestaurantData = {
  _id: string;
  name: string;
  total_reviews: number;
  total_orders: number;
  description: string;
  address: string;
  banners: string[];
  avatar: string;
  owner_id: {
    avatar: string;
    phone: string;
  };
  isDelete: boolean;
  status: string;
  rating: number;
  latitude: number;
  longitude: number;
};
