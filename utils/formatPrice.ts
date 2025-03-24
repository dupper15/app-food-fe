export function formatPrice(amount: number): string {
  if (isNaN(amount)) {
    console.warn("Invalid amount provided to formatPrice");
    return "0 ₫";
  }

  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

export function formatRatio(value: number): string {
  if (value < 0) {
    return "0%";
  }
  if (value < 1) {
    return `${value * 100}%`;
  }
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}
