import IOrder from 'interfaces/models/order';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';


import apiService, { ApiService } from './api';

export class OrderService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IOrder>> {
    return this.apiService.get('/order', params);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/order/${id}`);
  }

  public save(model: Partial<IOrder>): Observable<IOrder> {

    //ensures that the required properties are numeric
    const {value, quantity, ...rest } =model;
    const modelParse = {...rest, value: Number(value), quantity: Number(quantity)};

    return this.apiService.post('/order', modelParse);
  }
}

const orderService = new OrderService(apiService);

export default orderService;
