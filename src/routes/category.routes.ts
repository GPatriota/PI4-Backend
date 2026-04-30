import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Smartphones
 *                           icon:
 *                             type: string
 *                             example: smartphone
 *                           productCount:
 *                             type: integer
 *                             example: 15
 */
router.get('/', categoryController.getCategories);

export default router;
