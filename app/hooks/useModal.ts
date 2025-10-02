import { useState, useCallback } from "react";

interface UseModalOptions {
  initialVisible?: boolean;
}

export const useModal = (options: UseModalOptions = {}) => {
  const { initialVisible = false } = options;
  const [visible, setVisible] = useState(initialVisible);
  const [data, setData] = useState(null);

  const show = useCallback((modalData?: any) => {
    setData(modalData || null);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    data,
    show,
    hide,
    toggle,
    setData,
  };
};
