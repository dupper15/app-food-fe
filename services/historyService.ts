import { fetchUserHistory } from "./api/historyApi";
import { fetchOrderById } from "./api/orderApi";
import { fetchOrderItems } from "./api/orderItemApi";
import { fetchDishById } from "./api/dishApi";
import { fetchToppings } from "./api/toppingApi";
import { fetchVouchers } from "./api/voucherApi";
import { getRestaurantDetail } from "./api/restaurantApi";

// Define a comprehensive type for our combined data
export interface CompleteHistoryItem {
  historyItem: {
    _id: string;
    order_id: string;
    cost: number;
    sum_dishes: number;
    createdAt: string;
  };
  order: {
    _id: string;
    status: string;
    time_receive: number;
    total_price: number;
    restaurant_id: string;
    createdAt: string;
  };
  restaurant: {
    _id: string;
    name: string;
    address: string;
  };
  orderItems: Array<{
    _id: string;
    quantity: number;
    dish: {
      _id: string;
      name: string;
      image: string;
      price: number;
    };
    toppings: Array<{
      _id: string;
      name: string;
      price: number;
    }>;
  }>;
  vouchers: Array<{
    _id: string;
    value: number;
  }>;
}

// Helper function to ensure a value is a number
const ensureNumber = (value: any): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  return 0;
};

export const fetchCompleteHistory = async (
  userId: string
): Promise<CompleteHistoryItem[]> => {
  try {
    // Step 1: Fetch user's history
    const historyItems = await fetchUserHistory(userId);

    // Step 2: For each history item, fetch the order details
    const completeHistoryPromises = historyItems.map(async (historyItem) => {
      try {
        // Fetch order details
        const order = await fetchOrderById(historyItem.order_id);

        const restaurant = await getRestaurantDetail(order.restaurant_id);
        // Fetch order items - handle both string and array cases
        const orderItems = await fetchOrderItems(order.array_item);

        // For each order item, fetch dish and toppings
        const orderItemsWithDetails = await Promise.all(
          orderItems.map(async (item) => {
            try {
              // Fetch dish details
              const dish = await fetchDishById(item.dish_id);

              // Fetch topping details
              const toppings =
                item.topping && item.topping.length > 0
                  ? await fetchToppings(item.topping)
                  : [];

              return {
                _id: item._id,
                quantity: item.quantity,
                dish: {
                  _id: dish._id,
                  name: dish.name,
                  image: dish.image,
                  // Ensure price is a number
                  price: ensureNumber(dish.price),
                },
                toppings: toppings.map((topping) => ({
                  _id: topping._id,
                  name: topping.name,
                  // Ensure price is a number
                  price: ensureNumber(topping.price),
                })),
              };
            } catch (error) {
              console.error(`Error processing order item ${item._id}:`, error);
              // Return a partial item with available data
              return {
                _id: item._id,
                quantity: item.quantity,
                dish: {
                  _id: item.dish_id,
                  name: "Unknown Dish",
                  image: "",
                  price: 0,
                },
                toppings: [],
              };
            }
          })
        );

        // Fetch voucher details - handle null case
        const vouchers = order.voucher_id
          ? await fetchVouchers(
              Array.isArray(order.voucher_id)
                ? order.voucher_id
                : [order.voucher_id]
            )
          : [];

        // Combine all data
        return {
          historyItem: {
            _id: historyItem._id,
            order_id: historyItem.order_id,
            cost: ensureNumber(historyItem.cost),
            sum_dishes: ensureNumber(historyItem.sum_dishes),
            createdAt: historyItem.createdAt,
          },
          order: {
            _id: order._id,
            status: order.status,
            time_receive: ensureNumber(order.time_receive),
            total_price: ensureNumber(order.total_price),
            restaurant_id: order.restaurant_id,
            createdAt: order.createdAt,
          },
          orderItems: orderItemsWithDetails,
          restaurant: {
            _id: restaurant._id,
            name: restaurant.name,
            address: restaurant.address,
          },
          vouchers: vouchers.map((voucher) => ({
            _id: voucher._id,
            value: ensureNumber(voucher.value),
          })),
        };
      } catch (error) {
        console.error(
          `Error processing history item ${historyItem._id}:`,
          error
        );
        // Return a partial history item with available data
        return {
          historyItem: {
            _id: historyItem._id,
            order_id: historyItem.order_id,
            cost: ensureNumber(historyItem.cost),
            sum_dishes: ensureNumber(historyItem.sum_dishes),
            createdAt: historyItem.createdAt,
          },
          order: {
            _id: historyItem.order_id,
            status: "unknown",
            time_receive: 0,
            total_price: ensureNumber(historyItem.cost),
            restaurant_id: "",
            createdAt: historyItem.createdAt,
          },
          orderItems: [],
          restaurant: {
            _id: "unknown",
            name: "Unknown Restaurant",
            address: "Unknown Address",
          },
          vouchers: [],
        };
      }
    });

    return Promise.all(completeHistoryPromises);
  } catch (error) {
    console.error("Error fetching complete history:", error);
    throw error;
  }
};
