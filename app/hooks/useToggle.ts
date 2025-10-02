import { useState, useCallback } from "react";

interface UseToggleOptions {
  initialValue?: boolean;
}

export const useToggle = (options: UseToggleOptions = {}) => {
  const { initialValue = false } = options;
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
};
