import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdSchema,
} from '../validators/address.validator';

const router = Router();
const addressController = new AddressController();

// All address routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: List all addresses for the authenticated user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
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
 *                     addresses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           userId:
 *                             type: integer
 *                           label:
 *                             type: string
 *                           street:
 *                             type: string
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                           zipCode:
 *                             type: string
 *                           isDefault:
 *                             type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/', addressController.getAddresses);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - street
 *               - city
 *               - state
 *               - zipCode
 *             properties:
 *               label:
 *                 type: string
 *                 example: Home
 *               street:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: São Paulo
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: SP
 *               zipCode:
 *                 type: string
 *                 example: 01310-100
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createAddressSchema), addressController.createAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   patch:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: Work
 *               street:
 *                 type: string
 *                 example: 456 Market St
 *               city:
 *                 type: string
 *                 example: Rio de Janeiro
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: RJ
 *               zipCode:
 *                 type: string
 *                 example: 20040-020
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only update own addresses
 *       404:
 *         description: Address not found
 */
router.patch('/:id', validate(updateAddressSchema), addressController.updateAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only delete own addresses
 *       404:
 *         description: Address not found
 */
router.delete('/:id', validate(addressIdSchema), addressController.deleteAddress);

/**
 * @swagger
 * /addresses/{id}/set-default:
 *   patch:
 *     summary: Set an address as default
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only update own addresses
 *       404:
 *         description: Address not found
 */
router.patch('/:id/set-default', validate(addressIdSchema), addressController.setDefaultAddress);

export default router;
