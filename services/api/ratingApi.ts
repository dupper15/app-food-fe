import { create } from "react-test-renderer";
import axiosInstance from "./axiosInstance";

interface Rating {
  _id: string;
  order_id: string;
  customer_id: string;
  image?: string[];
  content: string;
  rating: number;
  replies_array?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface CreateRatingDto {
  order_id: string;
  customer_id: string;
  image?: string[];
  content: string;
  rating: number;
  replies_array?: string[];
}

export const ratingApi = {
  // ...existing code...

  /**
   * Fetch rating by order ID
   * @param orderId ID of the order
   * @returns Rating for the specific order if exists
   */
  fetchRatingByOrderId: async (orderId: string): Promise<Rating | null> => {
    try {
      const response = await axiosInstance.get(`rating/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching rating by order ID:", error);
      throw error;
    }
  },

  /**
   * Update an existing rating
   * @param ratingId ID of the rating to update
   * @param ratingData Updated rating data
   * @returns Updated rating object
   */
  updateRating: async (
    ratingId: string,
    ratingData: Partial<CreateRatingDto>
  ): Promise<Rating> => {
    try {
      const response = await axiosInstance.patch(
        `rating/update/${ratingId}`,
        ratingData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating rating:", error);
      throw error;
    }
  },

  createRating: async (data: CreateRatingDto): Promise<Rating> => {
    try {
      const response = await axiosInstance.post("rating/create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating rating:", error);
      throw error;
    }
  },

  fetchAverage: async (id: string): Promise<number> => {
    try {
      const response = await axiosInstance.get(`rating/average/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      throw error;
    }
  },
};

export default ratingApi;
