import {  ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import IOrder from 'modules/database/interfaces/order';
import { Order } from 'modules/database/models/order';
import { OrderRepository } from '../repositories/order';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
  ) {}


  public async save(model: IOrder): Promise<Order> {
    if (model.id) return this.update(model);
    return this.create(model);
  }


  public async remove(orderId: number): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('not-found');
    }
    return this.orderRepository.remove(orderId);
  }



  private async create(model: IOrder): Promise<Order> {
    const isDescriptionAvailable = await this.orderRepository.isDescriptionAvailable(model.description);
    if (!isDescriptionAvailable) throw new ConflictException('description-unavailable');
        const order = await this.orderRepository.insert(model);
    return order;
  }




  private async update( model: IOrder): Promise<Order> {
    const isDescriptionAvailable = await this.orderRepository.isDescriptionAvailable(model.description, model.id);
    if (!isDescriptionAvailable) throw new ConflictException('description-unavailable');
    const order = await this.orderRepository.findById(model.id);
    if (!order) throw new NotFoundException('not-found');
    return this.orderRepository.update({ ...order, ...model });
  }
}


