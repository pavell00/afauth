export class Order {
  id?: string;
  tableNo?: string = '1';
  OrderDate?: String;
  isDone?: boolean = false;
  sumOrder?: number = 0;
  discountOrder?: number = 0;
  check?: number = 1;
  guests?: number = 1;
  printTime?: string = '00:00';
  sumDiscount?: number = 0;
  sumService?: number = 0;
  sumToPay?: number = 0;
  waiter?: string = '';
  place?: string = 'Зал';
  printed?: string = '';
  user?: string = '';
  description?: string = ';'
}