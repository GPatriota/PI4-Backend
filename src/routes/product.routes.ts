import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  productIdSchema,
} from '../validators/product.validator';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name and description
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
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
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
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
 */
router.get('/', validate(getProductsSchema), productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', validate(productIdSchema), productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone with A16 chip
 *               price:
 *                 type: number
 *                 example: 1199.99
 *               originalPrice:
 *                 type: number
 *                 example: 1299.99
 *               stock:
 *                 type: integer
 *                 default: 0
 *                 example: 50
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               imageAlt:
 *                 type: string
 *                 example: iPhone 14 Pro image
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.5
 *               ratingCount:
 *                 type: integer
 *                 example: 120
 *               badge:
 *                 type: string
 *                 example: New
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createProductSchema),
  productController.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *               imageAlt:
 *                 type: string
 *               rating:
 *                 type: number
 *               ratingCount:
 *                 type: integer
 *               badge:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product or category not found
 */
router.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only, soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(productIdSchema),
  productController.deleteProduct
);

export default router;
