import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { orderIdSchema, getOrdersSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();
const orderController = new OrderController();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           userId:
 *                             type: integer
 *                           status:
 *                             type: string
 *                             enum: [PENDING, CONFIRMED, CANCELLED, SHIPPED, DELIVERED]
 *                           subtotal:
 *                             type: number
 *                           shipping:
 *                             type: number
 *                           total:
 *                             type: number
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, validate(getOrdersSchema), orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         userId:
 *                           type: integer
 *                         status:
 *                           type: string
 *                           enum: [PENDING, CONFIRMED, CANCELLED, SHIPPED, DELIVERED]
 *                         subtotal:
 *                           type: number
 *                         shipping:
 *                           type: number
 *                         total:
 *                           type: number
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               productId:
 *                                 type: integer
 *                               quantity:
 *                                 type: integer
 *                               unitPrice:
 *                                 type: number
 *                               product:
 *                                 type: object
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Order belongs to another user
 *       404:
 *         description: Order not found
 */
router.get('/:id', authMiddleware, validate(orderIdSchema), orderController.getOrderById);

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         userId:
 *                           type: integer
 *                         status:
 *                           type: string
 *                           enum: [PENDING, CONFIRMED, CANCELLED, SHIPPED, DELIVERED]
 *                         subtotal:
 *                           type: number
 *                         shipping:
 *                           type: number
 *                           description: Shipping cost (free if subtotal >= 499)
 *                         total:
 *                           type: number
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request - Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', authMiddleware, orderController.checkout);

router.post('/checkout/webhook', orderController.checkoutWebhook);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, SHIPPED, DELIVERED]
 *                 example: CONFIRMED
 *                 description: New order status. Cancelling an order will restore product stock.
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;
