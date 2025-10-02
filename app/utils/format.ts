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
  return `#${shortId}`;
};

export const formatRelativeTime = (dateString: string) => {
  if (!dateString) return "Unknown time";

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};
