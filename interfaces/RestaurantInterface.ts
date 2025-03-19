export type CreateRestaurantData = {
  name: string;
  description: string;
  address: string;
  banner: File[];
  avatar: File;
  ownerId: string;
};
