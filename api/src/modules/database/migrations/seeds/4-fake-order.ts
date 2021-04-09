import * as faker from 'faker/locale/pt_BR';
import * as Knex from 'knex';
import  IOrder from 'modules/database/interfaces/order';
import { IS_DEV } from 'settings';

export async function seed(knex: Knex): Promise<void> {
  if (!IS_DEV) return;

  const orders = await knex
    .count()
    .from('Order')
    .first();

  if (Number(orders.count) !== 1) return;

  for (let x = 0; x < 100; x++) {

    //creates fake descriptions with a time stamp date, because in the business rule is necessary to be distinct
    const description = `Projeto da(o) ${faker.name.firstName()}, código ${new Date().getTime()}.`

    //generates random number in the thousands
    const value =  (Math.floor(Math.random() * 10) +1)*1000;

    //generates random number between 1 and 10
    const quantity =  Math.floor(Math.random() * 10) +1 //

    const order: IOrder = {
      description,
      value,
      quantity,
      createdDate: new Date(),
      updatedDate: new Date()
    };
    
    await knex.insert(order).into('Order');
  }
}
