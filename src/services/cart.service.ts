import { getDb } from '../database/connection';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.util';
import { SHIPPING } from '../utils/constants';
import { AddToCartInput, UpdateCartItemInput } from '../validators/cart.validator';

export class CartService {
  async getCart(userId: number) {
    const db = getDb();
    const cartItems = db
      .prepare(
        `
        SELECT
          ci.id,
          ci.userId,
          ci.productId,
          ci.quantity,
          ci.addedAt,
          p.name as productName,
          p.price as productPrice,
          p.originalPrice as productOriginalPrice,
          p.imageUrl as productImageUrl,
          p.imageAlt as productImageAlt,
          p.stock as productStock,
          p.isActive as productIsActive
        FROM cartItems ci
        INNER JOIN products p ON p.id = ci.productId
        WHERE ci.userId = ?
        ORDER BY ci.addedAt DESC
      `
      )
      .all(userId) as Array<{
      id: number;
      userId: number;
      productId: number;
      quantity: number;
      addedAt: string;
      productName: string;
      productPrice: number;
      productOriginalPrice: number | null;
      productImageUrl: string | null;
      productImageAlt: string | null;
      productStock: number;
      productIsActive: number;
    }>;

    return cartItems.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      addedAt: item.addedAt,
      product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        originalPrice: item.productOriginalPrice,
        imageUrl: item.productImageUrl,
        imageAlt: item.productImageAlt,
        stock: item.productStock,
        isActive: Boolean(item.productIsActive),
      },
    }));
  }

  async addToCart(userId: number, data: AddToCartInput) {
    const db = getDb();
    const { productId, quantity } = data;

    // Check if product exists and is active
    const product = db
      .prepare('SELECT id, name, stock, isActive FROM products WHERE id = ?')
      .get(productId) as { id: number; name: string; stock: number; isActive: number } | undefined;

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestError('Product is not available');
    }

    // Validate stock
    if (product.stock < quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available`);
    }

    // Check if item already exists in cart
    const existingCartItem = db
      .prepare('SELECT id, quantity FROM cartItems WHERE userId = ? AND productId = ?')
      .get(userId, productId) as { id: number; quantity: number } | undefined;

    if (existingCartItem) {
      // Update quantity if item already exists
      const newQuantity = existingCartItem.quantity + quantity;

      // Validate total quantity against stock
      if (product.stock < newQuantity) {
        throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available`);
      }

      db.prepare('UPDATE cartItems SET quantity = ? WHERE id = ?').run(newQuantity, existingCartItem.id);
      const [updatedCartItem] = (await this.getCart(userId)).filter((item) => item.id === existingCartItem.id);
      return updatedCartItem;
    }

    // Create new cart item
    const result = db
      .prepare('INSERT INTO cartItems (userId, productId, quantity) VALUES (?, ?, ?)')
      .run(userId, productId, quantity);
    const [cartItem] = (await this.getCart(userId)).filter((item) => item.id === Number(result.lastInsertRowid));
    return cartItem;
  }

  async updateCartItem(userId: number, itemId: number, data: UpdateCartItemInput) {
    const db = getDb();
    const { quantity } = data;

    // Check if cart item exists
    const cartItem = db
      .prepare(
        `
        SELECT ci.id, ci.userId, ci.productId, ci.quantity, p.stock as productStock
        FROM cartItems ci
        INNER JOIN products p ON p.id = ci.productId
        WHERE ci.id = ?
      `
      )
      .get(itemId) as
      | { id: number; userId: number; productId: number; quantity: number; productStock: number }
      | undefined;

    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    // Validate ownership
    if (cartItem.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this cart item');
    }

    // Validate stock
    if (cartItem.productStock < quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${cartItem.productStock} items available`);
    }

    // Update cart item
    db.prepare('UPDATE cartItems SET quantity = ? WHERE id = ?').run(quantity, itemId);
    const [updatedCartItem] = (await this.getCart(userId)).filter((item) => item.id === itemId);
    return updatedCartItem;
  }

  async removeCartItem(userId: number, itemId: number) {
    const db = getDb();
    // Check if cart item exists
    const cartItem = db
      .prepare('SELECT id, userId FROM cartItems WHERE id = ?')
      .get(itemId) as { id: number; userId: number } | undefined;

    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    // Validate ownership
    if (cartItem.userId !== userId) {
      throw new ForbiddenError('You do not have permission to remove this cart item');
    }

    // Delete cart item
    db.prepare('DELETE FROM cartItems WHERE id = ?').run(itemId);

    return { message: 'Cart item removed successfully' };
  }

  async clearCart(userId: number) {
    const db = getDb();
    // Delete all cart items for the user
    db.prepare('DELETE FROM cartItems WHERE userId = ?').run(userId);

    return { message: 'Cart cleared successfully' };
  }

  async calculateCartTotals(userId: number) {
    const db = getDb();
    const cartItems = db
      .prepare(
        `
        SELECT ci.quantity, p.price
        FROM cartItems ci
        INNER JOIN products p ON p.id = ci.productId
        WHERE ci.userId = ?
      `
      )
      .all(userId) as Array<{ quantity: number; price: number }>;

    // Calculate subtotal
    const subtotal = cartItems.reduce((total: number, item) => {
      const itemTotal = Number(item.price) * item.quantity;
      return total + itemTotal;
    }, 0);

    // Calculate shipping
    const shipping = subtotal >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.COST;

    // Calculate total
    const total = subtotal + shipping;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }
}
