import { Request, Response, NextFunction } from 'express';
import { parseIdParam } from '../utils/helpers';
import { OrderService } from '../services/order.service';
import { GetOrdersQuery, UpdateOrderStatusInput } from '../validators/order.validator';

const orderService = new OrderService();

export class OrderController {
  async getOrders(
    req: Request<object, object, object, GetOrdersQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const result = await orderService.getOrders(userId, req.query);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const orderId = parseIdParam(req.params.id);
      const order = await orderService.getOrderById(userId, orderId);

      res.status(200).json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await orderService.checkout(userId);

      res.status(201).json({
        status: 'success',
        message: 'Checkout initialized successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkoutWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as Record<string, string | undefined>;
      const body = req.body as { data?: { id?: string | number } };

      const topic = query.type ?? query.topic;
      if (topic !== 'payment') {
        res.status(200).json({ status: 'ignored' });
        return;
      }

      const paymentIdFromQuery = query['data.id'];
      const paymentIdFromBody = body?.data?.id;
      const paymentId = String(paymentIdFromQuery ?? paymentIdFromBody ?? '');

      if (!paymentId) {
        res.status(200).json({ status: 'ignored' });
        return;
      }

      await orderService.processCheckoutWebhook(paymentId);
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(
    req: Request<{ id: string }, object, UpdateOrderStatusInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = parseIdParam(req.params.id);
      const order = await orderService.updateOrderStatus(orderId, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Order status updated successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }
}
