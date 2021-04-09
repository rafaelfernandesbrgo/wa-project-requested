import * as Knex from 'knex';
import IOrder from 'modules/database/interfaces/order';


//just to test
export async function seed(knex: Knex): Promise<void> {
  const orderTestFirst: IOrder = {
    description: 'Projeto da(o) Yuri, código 1617976143006.',
    value: 8000,
    quantity: 2,

    createdDate: new Date(),
    updatedDate: new Date()
  };

  const order = await knex
    .count()
    .from('Order')
    .where({ description: orderTestFirst.description })
    .first();


  if (Number(order.count) > 0) return;

  await knex.insert(orderTestFirst).into('Order');
}
