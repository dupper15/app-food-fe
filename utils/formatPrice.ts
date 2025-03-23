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
