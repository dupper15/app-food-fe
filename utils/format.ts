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

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formatCode = (id: string): string => {
  if (!id) return "";
  const shortId = id.slice(-6).toUpperCase();
  return `VC-${shortId}`;
};

export const formatCodeOrder = (id: string): string => {
  if (!id) return "";
  const shortId = id.slice(-6).toUpperCase();
  return `OD-${shortId}`;
};
