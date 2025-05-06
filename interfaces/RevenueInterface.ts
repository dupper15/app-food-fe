export interface MonthlyRevenueCardProps {
  mockMonthlyRevenue: number;
  rateMonth: number;
}

export interface MonthlyOrderCardProps {
  totalOrders: number;
}

export interface OrderStatusData {
  name: string;
  count: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface OrderRateChartProps {
  orderStatusData: OrderStatusData[];
  successOrder: number;
  failOrder: number;
  rateSuccess: number;
}

export interface Customer {
  _id: string;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
}

export interface LoyalCustomerListProps {
  topCustomers: Customer[];
}

export interface WeeklyRevenueItem {
  date: string;
  total: number;
  day: string;
}

export interface WeeklyRevenueChartProps {
  weeklyChartData: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
}
