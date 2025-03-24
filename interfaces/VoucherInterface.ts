export interface Voucher {
  id: string;
  code: string;
  name: string;
  quantity: number;
  restaurant_id: string;
  value: number;
  max: number;
  start_date: Date;
  expire_date: Date;
}
