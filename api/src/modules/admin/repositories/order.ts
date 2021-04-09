import { Injectable } from '@nestjs/common';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import  IOrder from 'modules/database/interfaces/order';
import { Order } from 'modules/database/models/order';
import { Page, Transaction } from 'objection';

@Injectable()
export class OrderRepository {
  public async list(params: IPaginationParams, transaction?: Transaction): Promise<Page<Order>> {
    let query = Order.query(transaction)
      .select('*')
      .page(params.page, params.pageSize)
      .orderBy('id', params.orderDirection);
      

    if (params.term) {
      query = query.where(query => {
        return query
          .where('description', 'ilike', `%${params.term}%`)
          .orWhere('value', 'ilike', `%${params.term}%`)
          .orWhere('quantity', 'ilike', `%${params.term}%`);
      });
    }

    return query;
  }

  public async count(transaction?: Transaction): Promise<Number> {
    const result: any = await Order.query(transaction)
      .count('id as count')
      .first();

    return Number(result.count);
  }

  public async isDescriptionAvailable(description: string, skipDescriptionId?: number, transaction?: Transaction): Promise<boolean> {
    let query = Order.query(transaction)
      .count('id as count')
      .where({ description })
      .first();

    if (skipDescriptionId) {
      query = query.where('id', '!=', skipDescriptionId);
    }

    const result: any = await query;
    return Number(result.count) === 0;
  }

  public async findById(id: number, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction)
      .where({ id })
      .first();
  }

  public async findByOrder(order: string, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction)
      .where({ order })
      .first();
  }

  public async insert(model: IOrder, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction).insert(model);
  }

  public async update(model: IOrder, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction).updateAndFetchById(model.id, <Order>model);
  }

  public async remove(id: number, transaction?: Transaction): Promise<void> {
    await Order.query(transaction)
      .del()
      .where({ id });
  }
}

