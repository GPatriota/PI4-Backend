import { Request, Response, NextFunction } from 'express';
import { parseIdParam } from '../utils/helpers';
import { CartService } from '../services/cart.service';
import { AddToCartInput, UpdateCartItemInput } from '../validators/cart.validator';

const cartService = new CartService();

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      
      // Get cart items and calculate totals
      const [cartItems, totals] = await Promise.all([
        cartService.getCart(userId),
        cartService.calculateCartTotals(userId),
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          items: cartItems,
          totals,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(
    req: Request<object, object, AddToCartInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const cartItem = await cartService.addToCart(userId, req.body);

      res.status(201).json({
        status: 'success',
        message: 'Item added to cart successfully',
        data: { cartItem },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(
    req: Request<{ id: string }, object, UpdateCartItemInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const itemId = parseIdParam(req.params.id);
      const cartItem = await cartService.updateCartItem(userId, itemId, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Cart item updated successfully',
        data: { cartItem },
      });
    } catch (error) {
      next(error);
    }
  }

  async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const itemId = parseIdParam(req.params.id);
      const result = await cartService.removeCartItem(userId, itemId);

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await cartService.clearCart(userId);

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
