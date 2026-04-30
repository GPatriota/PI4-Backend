import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemIdSchema,
} from '../validators/cart.validator';

const router = Router();
const cartController = new CartController();

// All cart routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart with totals
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           userId:
 *                             type: integer
 *                           productId:
 *                             type: integer
 *                           quantity:
 *                             type: integer
 *                           addedAt:
 *                             type: string
 *                             format: date-time
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               price:
 *                                 type: number
 *                               originalPrice:
 *                                 type: number
 *                               imageUrl:
 *                                 type: string
 *                               imageAlt:
 *                                 type: string
 *                               stock:
 *                                 type: integer
 *                               isActive:
 *                                 type: boolean
 *                     totals:
 *                       type: object
 *                       properties:
 *                         subtotal:
 *                           type: number
 *                           example: 599.90
 *                         shipping:
 *                           type: number
 *                           example: 0
 *                         total:
 *                           type: number
 *                           example: 599.90
 *       401:
 *         description: Unauthorized
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request (product not available or insufficient stock)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/items', validate(addToCartSchema), cartController.addToCart);

/**
 * @swagger
 * /cart/items/{id}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Bad request (insufficient stock)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not your cart item)
 *       404:
 *         description: Cart item not found
 */
router.patch(
  '/items/:id',
  validate(updateCartItemSchema),
  cartController.updateCartItem
);

/**
 * @swagger
 * /cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not your cart item)
 *       404:
 *         description: Cart item not found
 */
router.delete(
  '/items/:id',
  validate(cartItemIdSchema),
  cartController.removeCartItem
);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/clear', cartController.clearCart);

export default router;
