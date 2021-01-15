export class Order {
  id?: string;
  TableNo?: string = '1';
  OrderDate?: String;
  isDone?: boolean = false;
  sumOrder?: number = 0;
  discountOrder?: number = 0;
  check?: string = '';
  guests?: number = 1;
  printTime: string = '00:00';
  sumDiscount: number = 0;
  sumService: number = 0;
  sumToPay: number = 0;
}