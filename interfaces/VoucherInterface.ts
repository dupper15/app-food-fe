export interface VoucherData {
  _id: string;
  code: string;
  name: string;
  content: string;
  quantity: number;
  restaurant_id: string;
  value: number;
  min: number;
  max: number;
  start_date: string;
  expire_date: string;
}

export interface CreateVoucherDto {
  restaurant_id: string;
  name: string;
  content: string;
  quantity: number;
  value: number;
  max: number;
  min: number;
  start_date: string;
  expire_date: string;
}
