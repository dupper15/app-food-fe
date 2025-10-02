import { useState, useCallback } from "react";

interface CartItem {
  dish_id: any;
  quantity: number;
  topping?: any[];
  [key: string]: any;
}

interface Restaurant {
  name: string;
  order_items: CartItem[];
  [key: string]: any;
}

export const useCartSelection = (cart: Restaurant[]) => {
  const [selectedDish, setSelectedDish] = useState<CartItem[]>([]);

  const toggleCheckbox = useCallback(
    (restaurantIndex: number, itemIndex: number) => {
      const selectedRestaurant = cart[restaurantIndex];
      const selectedItem = selectedRestaurant.order_items[itemIndex];

      if (selectedDish.length > 0) {
        const currentRestaurant = cart.find((res) =>
          res.order_items.some((item) => selectedDish.includes(item))
        );
        if (currentRestaurant && currentRestaurant !== selectedRestaurant) {
          setSelectedDish([selectedItem]);
          return;
        }
      }

      if (selectedDish.includes(selectedItem)) {
        setSelectedDish(selectedDish.filter((item) => item !== selectedItem));
      } else {
        setSelectedDish([...selectedDish, selectedItem]);
      }
    },
    [cart, selectedDish]
  );

  const toggleRestaurantCheckbox = useCallback(
    (restaurantIndex: number) => {
      const selectedRestaurant = cart[restaurantIndex];
      const restaurantItems = selectedRestaurant.order_items;

      if (selectedDish.length > 0) {
        const currentRestaurant = cart.find((res) =>
          res.order_items.some((item) => selectedDish.includes(item))
        );
        if (currentRestaurant && currentRestaurant !== selectedRestaurant) {
          setSelectedDish(restaurantItems);
          return;
        }
      }

      const isAllSelected = restaurantItems.every((item) =>
        selectedDish.includes(item)
      );

      if (isAllSelected) {
        setSelectedDish(
          selectedDish.filter((item) => !restaurantItems.includes(item))
        );
      } else {
        const newSelection = [...selectedDish];
        restaurantItems.forEach((item) => {
          if (!newSelection.includes(item)) {
            newSelection.push(item);
          }
        });
        setSelectedDish(newSelection);
      }
    },
    [cart, selectedDish]
  );

  const clearSelection = useCallback(() => {
    setSelectedDish([]);
  }, []);

  const isItemSelected = useCallback(
    (item: CartItem) => {
      return selectedDish.includes(item);
    },
    [selectedDish]
  );

  const isRestaurantSelected = useCallback(
    (restaurantItems: CartItem[]) => {
      return restaurantItems.every((item) => selectedDish.includes(item));
    },
    [selectedDish]
  );

  return {
    selectedDish,
    toggleCheckbox,
    toggleRestaurantCheckbox,
    clearSelection,
    isItemSelected,
    isRestaurantSelected,
    setSelectedDish,
  };
};
