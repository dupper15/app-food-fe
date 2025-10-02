import { useState, useCallback } from "react";

interface UseQuantityOptions {
  initialValue?: number;
  min?: number;
  max?: number;
}

export const useQuantity = (options: UseQuantityOptions = {}) => {
  const { initialValue = 1, min = 1, max = 99 } = options;
  const [quantity, setQuantity] = useState(initialValue);

  const increment = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, min));
  }, [min]);

  const updateQuantity = useCallback(
    (value: number) => {
      const newValue = Math.max(min, Math.min(max, value));
      setQuantity(newValue);
    },
    [min, max]
  );

  const reset = useCallback(() => {
    setQuantity(initialValue);
  }, [initialValue]);

  return {
    quantity,
    increment,
    decrement,
    updateQuantity,
    reset,
    setQuantity,
    canIncrement: quantity < max,
    canDecrement: quantity > min,
  };
};
