
import Order from "../../domain/entity/order";
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItem from '../../domain/entity/order_items';

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    entity.items.map((item) => {
      OrderItemModel.upsert(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id
        }
      );
    });

    await OrderModel.update(
      { 
        total: entity.total(), }, 
      { where: { id: entity.id, } },
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id } ,
    include: [{model: OrderItemModel, as: 'items'}]});
    return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map((item) =>{
     return new OrderItem(
      item.id, item.name, item.price, item.product_id, item.quantity)})
    )
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"], });

    return orderModels.map((order) => {
      return new Order(
        order.id, 
        order.customer_id, 
        order.items.map((item) => {
          return new OrderItem(
            item.id, item.name, item.price, item.product_id, item.quantity
          );
      }));
      
    }); 
  }
}