import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_items';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order.repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository implements OrderRepositoryInterface{
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